import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEntityId1665412482471 implements MigrationInterface {
  name = 'AddEntityId1665412482471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Capacities" ADD "entityId" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Capacities" DROP COLUMN "entityId"`);
  }
}
