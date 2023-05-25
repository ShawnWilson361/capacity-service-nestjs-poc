import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';

import { Capacity } from '../entities';
import { ApplicationError } from '../errors/ApplicationError.error';
import { CapacityChangeRepository, CapacityRepository } from '../repositories';
import { ManagementCapacityMaxCapacityChangeItem } from '../types/requestBody';
import {
  GenericDeleteResponse,
  ManagementCapacitiesResponse,
  ManagementCapacityListQuery,
  ManagementCapacityListResponse,
  ManagementCapacityResponse,
  PublicCapacityBatchCreateResponse,
  PublicCapacityListResponse,
} from '../types/responses';
import { CapacityInfo } from '../types/shared';
import {
  mapCapacityToManagementCapacityItem,
  mapCapacityToPublicCapacityItem,
} from '../utils/mappers.ts';
import { EntitySourceService } from './entitySource.service';

@Injectable()
export class CapacityService {
  constructor(
    @InjectRepository(CapacityRepository)
    private readonly capacityRepository: CapacityRepository,
    @InjectRepository(CapacityChangeRepository)
    private readonly capacityChangeRepository: CapacityChangeRepository,
    @Inject(EntitySourceService)
    private readonly entitySourceService: EntitySourceService,
    private dataSource: DataSource,
    private logger: Logger
  ) {}

  async getCapacities(
    query: ManagementCapacityListQuery
  ): Promise<ManagementCapacityListResponse> {
    const results = await this.capacityRepository.findPaginatedCapacities(
      {
        limit: query?.limit,
        orderBy: query?.orderBy,
        orderDirection: query?.orderDirection,
        page: query?.page,
      },
      query?.filters
    );

    return {
      success: true,
      count: results?.count || 0,
      items:
        results?.items.map((item) =>
          mapCapacityToManagementCapacityItem(item)
        ) || [],
      query,
    };
  }

  async getCapacityById(id: string): Promise<Capacity> {
    const item = await this.capacityRepository.findCapacity(id);

    if (!item) {
      throw new ApplicationError('Not found!', 404, 'NOT FOUND');
    }

    return item;
  }

  async findCapacitiesByIds(
    ids: string[]
  ): Promise<PublicCapacityListResponse> {
    const entitySourceId = await this.entitySourceService.getEntitySourceId();

    const items =
      await this.capacityRepository.findCapacitiesByIdsAndEntitySource(
        ids,
        entitySourceId
      );

    return {
      success: true,
      items: items.map((item) => mapCapacityToPublicCapacityItem(item)),
    };
  }

  async createCapacity(
    partial: Partial<Capacity>,
    overrideEntitySource = false
  ): Promise<Capacity> {
    if (overrideEntitySource) {
      partial.entitySourceId =
        await this.entitySourceService.getEntitySourceId();
    }

    return await this.capacityRepository.createCapacity(partial);
  }

  async createCapacities(
    partials: Partial<Capacity>[]
  ): Promise<PublicCapacityBatchCreateResponse> {
    const entitySourceId = await this.entitySourceService.getEntitySourceId();

    const items = await this.capacityRepository.createCapacities(
      partials.map((partial) => ({
        isLive: true,
        heldCapacity: 0,
        ...partial,
        entitySourceId,
      }))
    );

    return {
      results: items.map((item) => ({
        success: true,
        capacity: mapCapacityToPublicCapacityItem(item),
      })),
    };
  }

  async updateCapacity(
    partial: Partial<Capacity>
  ): Promise<ManagementCapacityResponse> {
    const item = await this.capacityRepository.updateCapacityById(partial);

    return {
      success: true,
      capacity: mapCapacityToManagementCapacityItem(item),
    };
  }

  async updateCapacities(
    capacities: ManagementCapacityMaxCapacityChangeItem[]
  ): Promise<ManagementCapacitiesResponse> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const savedCapacities: Capacity[] = [];

      for (const capacity of capacities) {
        if (capacity?.id) {
          const cap = await this.capacityRepository.updateCapacityById(
            capacity,
            queryRunner
          );

          savedCapacities.push(cap);
        }
      }

      await queryRunner.commitTransaction();
      return {
        success: true,
        capacities: savedCapacities.map(mapCapacityToManagementCapacityItem),
      };
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async deleteCapacity(id: string): Promise<GenericDeleteResponse> {
    await this.capacityRepository.deleteCapacity(id);

    return {
      id,
      success: true,
    };
  }

  async upsertCapacity(
    capacityInfo: CapacityInfo,
    queryRunner?: QueryRunner
  ): Promise<{
    originalCapacity: Capacity;
    updatedCapacity: Capacity;
  }> {
    this.logger.log(
      `[CapacityService:upsertCapacity] - load modification related entities`
    );

    const entitySourceId = await this.entitySourceService.getEntitySourceId();

    const originalCapacity =
      await this.capacityRepository.findCapacityByEntityIdAndEntitySource(
        capacityInfo.entityId,
        entitySourceId
      );

    if (
      !originalCapacity &&
      capacityInfo.usedCapacity !== 0 &&
      !capacityInfo.usedCapacity
    ) {
      throw new BadRequestException('Used Capacity is required');
    }

    const updatedCapacity = await this.capacityRepository.upsertCapacity(
      {
        ...capacityInfo,
        entitySourceId,
      },
      queryRunner
    );

    return {
      originalCapacity,
      updatedCapacity,
    };
  }

  async replaceCapacity(
    capacityInfoList: CapacityInfo[],
    guestReferenceId: string
  ): Promise<Capacity[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const capacities: Capacity[] = [];

      for (const newCapacity of capacityInfoList) {
        this.logger.log(
          `[CapacityService:replaceCapacity] - load modification related entities`
        );

        const { originalCapacity, updatedCapacity } = await this.upsertCapacity(
          newCapacity,
          queryRunner
        );

        const capacityChange = {
          amount:
            -1 *
            ((originalCapacity?.usedCapacity || 0) -
              (updatedCapacity.usedCapacity || 0)),
          capacityId: updatedCapacity.id,
          guestReferenceId,
        };

        if (capacityChange.amount !== 0) {
          await this.capacityChangeRepository.createCapacityChange(
            capacityChange,
            queryRunner
          );
        }

        capacities.push(updatedCapacity);
      }

      await queryRunner.commitTransaction();
      return capacities;
    } catch (e) {
      this.logger.error(e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
