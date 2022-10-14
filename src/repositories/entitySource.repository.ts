import { isUUID } from 'class-validator';
import { DeepPartial, Like, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { EntitySource } from '../entities';
import { ManagementEntitySourceFilters } from '../types/queryParams';
import { ListOptions, Paginated } from '../types/shared';

export class EntitySourceRepository extends Repository<EntitySource> {
  /* Find One */
  async findEntitySource(id: string): Promise<EntitySource | undefined> {
    return (await this.findOne({ where: { id } })) || undefined;
  }

  /* Find Many */
  async findPaginatedEntitySources(
    paginationOptions: ListOptions,
    filters: ManagementEntitySourceFilters
  ): Promise<Paginated<EntitySource>> {
    let query = this.createQueryBuilder('entitySource');

    if (isUUID(filters?.id || '')) {
      query = query.andWhere({ id: filters.id });
    }

    if (filters?.name) {
      query = query.andWhere({ name: Like(`%${filters.name}%`) });
    }

    if (filters?.isLive) {
      query = query.andWhere({ isLive: true });
    }

    const count = await query.getCount();

    query = query.take(paginationOptions.limit || 50);
    query = query.skip(
      (paginationOptions.page || 50) * (paginationOptions.limit || 50)
    );
    query = query.orderBy(
      paginationOptions.orderBy,
      paginationOptions.orderDirection
    );

    return {
      count,
      items: await query.getMany(),
    };
  }

  /* Create */
  async createEntitySource(
    partial: Partial<EntitySource>
  ): Promise<EntitySource> {
    const res = await this.createQueryBuilder()
      .insert()
      .into(EntitySource)
      .values({ id: uuid(), ...partial })
      .returning('*')
      .execute();

    return this.create(res.generatedMaps[0] as DeepPartial<EntitySource>);
  }

  /* Update */
  async updateEntitySource(
    partial: Partial<EntitySource>
  ): Promise<EntitySource> {
    const result = await this.createQueryBuilder()
      .update(partial)
      .where({
        id: partial.id,
      })
      .returning('*')
      .execute();

    return result.raw[0] as EntitySource;
  }

  /* Delete */
  async deleteEntitySource(id: string): Promise<void> {
    await this.delete(id);
  }
}
