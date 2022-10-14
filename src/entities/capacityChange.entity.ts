import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Capacity from './capacity.entity';

@Entity({ name: 'CapacityChanges' })
export default class CapacityChange {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('int', { name: 'amount' })
  amount!: number;

  @Column('varchar', { name: 'guestReferenceId' })
  guestReferenceId!: string;

  @Column('varchar', { name: 'bookingReferenceId', nullable: true })
  bookingReferenceId?: string;

  @Column('uuid', { name: 'capacityId' })
  capacityId!: string;

  @ManyToOne(() => Capacity, (capacity) => capacity.changes)
  capacity: Capacity;

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
