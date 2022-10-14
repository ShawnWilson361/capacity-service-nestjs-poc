import {
  DeepPartial,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CapacityChange } from '../entities';

export class CapacityChangeRepository extends Repository<CapacityChange> {
  /* Find One */
  async findCapacityChange(id: string): Promise<CapacityChange | undefined> {
    return (await this.findOne({ where: { id } })) || undefined;
  }

  /* Find Many */
  async findByCapacityIdAndGuestReference(
    capacityId: string,
    guestReferenceId: string
  ): Promise<CapacityChange[]> {
    return this.find({
      where: {
        capacityId,
        guestReferenceId,
      },
    });
  }

  /* Create */
  async createCapacityChange(
    partial: Partial<CapacityChange>,
    queryRunner?: QueryRunner
  ): Promise<CapacityChange> {
    let qr: SelectQueryBuilder<CapacityChange>;

    if (queryRunner) {
      qr = queryRunner.manager.createQueryBuilder();
    } else {
      qr = this.createQueryBuilder();
    }

    const res = await qr
      .insert()
      .into(CapacityChange)
      .values({ id: uuid(), ...partial })
      .returning('*')
      .execute();

    return this.create(res.generatedMaps[0] as DeepPartial<CapacityChange>);
  }
}
