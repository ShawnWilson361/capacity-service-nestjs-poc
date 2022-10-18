import { isUUID } from 'class-validator';
import {
  DeepPartial,
  In,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Capacity } from '../entities';
import { ApplicationError } from '../errors/ApplicationError.error';
import { ManagementCapacityFilters } from '../types/queryParams';
import { ListOptions, Paginated } from '../types/shared';

export class CapacityRepository extends Repository<Capacity> {
  /* Find One */
  async findCapacity(id: string): Promise<Capacity | undefined> {
    return (
      (await this.findOne({ where: { id }, relations: ['changes'] })) ||
      undefined
    );
  }

  async findCapacityByEntityIdAndEntitySource(
    entityId: string,
    entitySourceId: string
  ): Promise<Capacity> {
    return await this.findOne({ where: { entityId, entitySourceId } });
  }

  /* Find Many */
  async findPaginatedCapacities(
    paginationOptions: ListOptions,
    filters: ManagementCapacityFilters
  ): Promise<Paginated<Capacity>> {
    let query = this.createQueryBuilder('capacity');

    if (isUUID(filters?.id || '')) {
      query = query.andWhere({ id: filters.id });
    }

    if (filters?.entityId) {
      query = query.andWhere({ entityId: filters.entityId });
    }

    if (filters?.entitySourceId) {
      query = query.andWhere({ entityId: filters.entitySourceId });
    }

    if (filters?.entityType) {
      query = query.andWhere({ entityId: filters.entityType });
    }

    if (filters?.isLive) {
      query = query.andWhere({ isLive: true });
    }

    const count = await query.getCount();

    query = query.take(paginationOptions.limit || 50);
    query = query.skip(
      (paginationOptions.page || 0) * (paginationOptions.limit || 50)
    );
    query = query.orderBy(
      `"capacity"."${paginationOptions.orderBy}"`,
      paginationOptions.orderDirection
    );

    return {
      count,
      items: await query.getMany(),
    };
  }

  async findCapacitiesByIdsAndEntitySource(
    ids: string[],
    entitySourceId: string
  ): Promise<Capacity[]> {
    return await this.find({ where: { id: In(ids), entitySourceId } });
  }

  async findCapacitiesByEntityIdsAndEntitySource(
    ids: string[],
    entitySourceId: string
  ): Promise<Capacity[]> {
    return await this.find({ where: { entityId: In(ids), entitySourceId } });
  }

  /* Create */
  async createCapacity(
    partial: Partial<Capacity>,
    queryRunner?: QueryRunner
  ): Promise<Capacity> {
    let qr: SelectQueryBuilder<Capacity>;

    if (queryRunner) {
      qr = queryRunner.manager.createQueryBuilder();
    } else {
      qr = this.createQueryBuilder();
    }

    const res = await qr
      .insert()
      .into(Capacity)
      .values({ id: uuid(), ...partial })
      .returning('*')
      .execute();

    return this.create(res.generatedMaps[0] as DeepPartial<Capacity>);
  }

  async createCapacities(partials: Partial<Capacity>[]): Promise<Capacity[]> {
    const res = await this.createQueryBuilder()
      .insert()
      .into(Capacity)
      .values(partials.map((partial) => ({ id: uuid(), ...partial })))
      .returning('*')
      .execute();

    const deepPartials = res.generatedMaps.map(
      (m) => m as DeepPartial<Capacity>
    );

    return deepPartials.map((dp) => this.create(dp));
  }

  /* Update */
  async updateCapacity(
    partial: Partial<Capacity>,
    queryRunner?: QueryRunner
  ): Promise<Capacity> {
    let qr: SelectQueryBuilder<Capacity>;

    if (queryRunner) {
      qr = queryRunner.manager.createQueryBuilder();
    } else {
      qr = this.createQueryBuilder();
    }

    const result = await qr
      .update(Capacity)
      .set(partial)
      .where({
        entityId: partial.entityId,
      })
      .returning('*')
      .execute();

    if (result.affected < 1) {
      throw new ApplicationError('No update', 400);
    }

    return result.raw[0] as Capacity;
  }

  async increaseUsedCapacity(
    amount: number,
    capacityId: string,
    currentUsedCapacity: number,
    teamMemberBooking: boolean,
    queryRunner?: QueryRunner
  ): Promise<Capacity> {
    let qr: SelectQueryBuilder<Capacity>;

    if (queryRunner) {
      qr = queryRunner.manager.createQueryBuilder();
    } else {
      qr = this.createQueryBuilder();
    }

    let query = qr
      .update(Capacity)
      .set({ usedCapacity: () => `"Capacities"."usedCapacity" + ${amount}` })
      .where({ id: capacityId, usedCapacity: currentUsedCapacity });

    if (!teamMemberBooking && amount > 0) {
      query = query.andWhere(
        '"Capacities"."maxCapacity" >= "Capacities"."usedCapacity" + :amount',
        {
          amount,
        }
      );
    }

    query = query.andWhere(`0 <= "Capacities"."usedCapacity" + :amount`, {
      amount,
    });

    const result = await query.execute();

    if (result.affected < 1) {
      throw new ApplicationError('No update', 400);
    }

    return result.raw[0] as Capacity;
  }

  /* Upsert */
  async upsertCapacity(
    partial: Partial<Capacity>,
    queryRunner?: QueryRunner
  ): Promise<Capacity> {
    const exists = await this.doesExist(
      partial.entityId,
      partial.entitySourceId
    );

    if (exists) {
      return await this.updateCapacity(partial, queryRunner);
    } else {
      if (typeof partial.usedCapacity !== 'number') {
        throw new ApplicationError(
          `"usedCapacity" is required for new capacity insert (entityId: ${partial.entityId})`,
          400,
          'BAD_REQUEST'
        );
      }

      return await this.createCapacity(partial, queryRunner);
    }
  }

  /* Delete */
  async deleteCapacity(id: string): Promise<void> {
    await this.delete(id);
  }

  /* Query */
  async doesExist(entityId: string, entitySourceId: string): Promise<boolean> {
    const capacity = await this.findOne({
      where: { entityId, entitySourceId },
    });

    return Boolean(capacity);
  }
}
