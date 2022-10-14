import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1665406891104 implements MigrationInterface {
  name = 'CreateTables1665406891104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "CapacityChanges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "guestReferenceId" character varying NOT NULL, "bookingReferenceId" character varying, "capacityId" uuid NOT NULL, "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP(3) WITH TIME ZONE, CONSTRAINT "PK_307575d660b489c2a3cd3b3742c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Capacities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entityType" character varying NOT NULL, "entitySourceId" character varying NOT NULL, "maxCapacity" integer NOT NULL, "usedCapacity" integer NOT NULL DEFAULT '0', "heldCapacity" integer NOT NULL DEFAULT '0', "isLive" boolean, "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP(3) WITH TIME ZONE, CONSTRAINT "PK_419fa422bc89ca91b09e24ab35b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "EntitySources" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "keyReference" character varying NOT NULL, "isLive" boolean, "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP(3) WITH TIME ZONE, CONSTRAINT "UQ_add758da5136eb407cea84933e3" UNIQUE ("keyReference"), CONSTRAINT "PK_39f61d12c620fc5990437ca05d8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "CapacityChanges" ADD CONSTRAINT "FK_439fc7935b5e43fc0349d01a4f8" FOREIGN KEY ("capacityId") REFERENCES "Capacities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CapacityChanges" DROP CONSTRAINT "FK_439fc7935b5e43fc0349d01a4f8"`
    );
    await queryRunner.query(`DROP TABLE "EntitySources"`);
    await queryRunner.query(`DROP TABLE "Capacities"`);
    await queryRunner.query(`DROP TABLE "CapacityChanges"`);
  }
}
