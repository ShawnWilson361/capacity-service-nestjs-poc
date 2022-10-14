import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import CapacityChange from './capacityChange.entity';

@Entity({ name: 'Capacities' })
export default class Capacity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { name: 'entityId' })
  entityId!: string;

  @Column('varchar', { name: 'entityType' })
  entityType!: string;

  @Column('varchar', { name: 'entitySourceId' })
  entitySourceId!: string;

  @Column('int', { name: 'maxCapacity' })
  maxCapacity!: number;

  @Column('int', { name: 'usedCapacity', default: 0 })
  usedCapacity!: number;

  @Column('int', { name: 'heldCapacity', default: 0 })
  heldCapacity!: number;

  @Column('boolean', { name: 'isLive', nullable: true })
  isLive?: boolean;

  @OneToMany(() => CapacityChange, (change) => change.capacity)
  changes: CapacityChange[];

  @CreateDateColumn({
    precision: 3,
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    precision: 3,
    type: 'timestamptz',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    precision: 3,
    type: 'timestamptz',
  })
  deletedAt?: Date;
}
