import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';

import { Capacity, CapacityChange } from '../entities';
import { ApplicationErrorList } from '../errors/ApplicationErrorList.error';
import { CapacityChangeRepository, CapacityRepository } from '../repositories';
import { PublicCapacityModificationResponse } from '../types/responses';
import { CapacityModificationRequest } from '../types/shared';
import { PublicCapacityModificationItem } from '../types/shared/PublicCapacityModificationItem.dto';
import { CapacityValidationService } from './capacityValidation.service';
import { EntitySourceService } from './entitySource.service';

@Injectable()
export class CapacityChangeService {
  constructor(
    @InjectRepository(CapacityRepository)
    private readonly capacityRepository: CapacityRepository,
    @InjectRepository(CapacityChangeRepository)
    private readonly capacityChangeRepository: CapacityChangeRepository,
    @Inject(EntitySourceService)
    private readonly entitySourceService: EntitySourceService,
    @Inject(CapacityValidationService)
    private readonly capacityValidationService: CapacityValidationService,
    private dataSource: DataSource,
    private logger: Logger
  ) {}

  async createCapacityChanges(
    changes: (PublicCapacityModificationItem & {
      guestReferenceId: string;
      bookingReferenceId: string;
      teamMemberBooking: boolean;
    })[]
  ): Promise<CapacityModificationRequest[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      this.logger.log(
        '[CapacityChangeService:createCapacityChanges] - load modification related entities'
      );

      const modificationRequests = await this.buildModificationRequest(changes);

      this.logger.log(
        '[CapacityChangeService:createCapacityChanges] - validate modifications'
      );

      const validatedModificationRequests =
        this.applyCapacityValidators(modificationRequests);

      this.logger.log(
        '[CapacityChangeService:createCapacityChanges] - apply modification changes'
      );

      await this.applyCapacityChanges(
        validatedModificationRequests,
        queryRunner
      );

      this.logger.log(
        '[CapacityChangeService:createCapacityChanges] - persist modification'
      );
      await this.persistCapacityChanges(
        validatedModificationRequests,
        queryRunner
      );

      await queryRunner.commitTransaction();

      return validatedModificationRequests;
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  private async buildModificationRequest(
    changes: (PublicCapacityModificationItem & {
      guestReferenceId: string;
      bookingReferenceId: string;
      teamMemberBooking: boolean;
    })[]
  ) {
    const entityIds = changes.map((change) => change.entityId);
    const entitySourceId = await this.entitySourceService.getEntitySourceId();

    const capacities =
      await this.capacityRepository.findCapacitiesByEntityIdsAndEntitySource(
        entityIds,
        entitySourceId
      );

    const modificationRequest: {
      change: PublicCapacityModificationItem & {
        guestReferenceId: string;
        bookingReferenceId: string;
        teamMemberBooking: boolean;
      };
      context: {
        capacity: Capacity;
        capacityChanges: CapacityChange[];
      };
    }[] = [];
    for (const change of changes) {
      const capacity = capacities.find(
        (capacity) => capacity.entityId === change.entityId
      );

      const capacityChanges =
        await this.capacityChangeRepository.findByCapacityIdAndGuestReference(
          capacity.id,
          change.guestReferenceId
        );

      modificationRequest.push({
        change,
        context: {
          capacity,
          capacityChanges,
        },
      });
    }

    return modificationRequest;
  }

  private validateCapacityChanges(
    modificationRequests: CapacityModificationRequest[]
  ): CapacityModificationRequest[] {
    const errors =
      this.capacityValidationService.validateGlobal(modificationRequests);
    if (errors.length) {
      return [
        {
          change: null,
          context: null,
          errors: errors.map((r) => ({
            path: '.body.changes',
            message: r.message,
          })),
        },
      ];
    }
    return modificationRequests.map((m, i) => ({
      ...m,
      errors: this.capacityValidationService.validate(m).map((r) => ({
        path: `.body.changes[${i}]`,
        message: r.message,
        errorCode: r.code,
      })),
    }));
  }

  private applyCapacityValidators(
    modificationRequests: CapacityModificationRequest[]
  ): CapacityModificationRequest[] {
    const validatedModificationRequests =
      this.validateCapacityChanges(modificationRequests);

    const errors = validatedModificationRequests
      .map((r) => r.errors || [])
      .flat();
    if (errors.length > 0) {
      throw new ApplicationErrorList(
        'Validation error',
        errors,
        400,
        'VALIDATION_ERROR'
      );
    }
    return validatedModificationRequests;
  }

  private async applyCapacityChanges(
    modificationRequests: CapacityModificationRequest[],
    queryRunner: QueryRunner
  ) {
    for (const { change, context } of modificationRequests) {
      let amountToDoNotFallBelowZero = change.amount;
      if (
        amountToDoNotFallBelowZero < 0 &&
        context.capacity.usedCapacity + amountToDoNotFallBelowZero < 0
      ) {
        amountToDoNotFallBelowZero = -1 * context.capacity.usedCapacity;
      }

      await this.capacityRepository.increaseUsedCapacity(
        amountToDoNotFallBelowZero,
        context.capacity.id,
        context.capacity.usedCapacity,
        change.teamMemberBooking,
        queryRunner
      );
    }
  }

  private async persistCapacityChanges(
    modificationRequests: CapacityModificationRequest[],
    queryRunner: QueryRunner
  ): Promise<void> {
    for (const modificationRequest of modificationRequests) {
      const modificationItem = {
        amount: modificationRequest.change.amount,
        capacityId: modificationRequest.context.capacity.id,
        guestReferenceId: modificationRequest.change.guestReferenceId,
        bookingReferenceId: modificationRequest.change.bookingReferenceId,
      };

      await this.capacityChangeRepository.createCapacityChange(
        modificationItem,
        queryRunner
      );
    }
  }
}
