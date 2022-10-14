import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'EntitySources' })
export default class EntitySource {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { name: 'name' })
  name!: string;

  @Column('varchar', { name: 'description', nullable: true })
  description?: string;

  @Column('varchar', { name: 'keyReference', unique: true })
  keyReference!: string;

  @Column('boolean', { name: 'isLive', nullable: true })
  isLive?: boolean;

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
