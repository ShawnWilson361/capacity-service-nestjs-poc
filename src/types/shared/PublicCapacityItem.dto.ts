import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString, Min } from 'class-validator';

export class PublicCapacityItem {
  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Item Id is a string' })
  id?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Item Entity Id is a string' })
  entityId?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Item Entity Type is a string' })
  entityType?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Item Entity Source Id is a string' })
  entitySourceId?: string;

  @ApiProperty({ type: Number, nullable: true })
  @IsInt({ message: 'Max Capacity is a positive integer or zero' })
  @Min(0, { message: 'Max Capacity is a positive integer or zero' })
  maxCapacity?: number;

  @ApiProperty({ type: Number, nullable: true })
  @IsInt({ message: 'Used Capacity is a positive integer or zero' })
  @Min(0, { message: 'Used Capacity is a positive integer or zero' })
  usedCapacity?: number;

  @ApiProperty({ type: Number, nullable: true })
  @IsInt({ message: 'Held Capacity is a positive integer or zero' })
  @Min(0, { message: 'Held Capacity is a positive integer or zero' })
  heldCapacity?: number;

  @ApiProperty({ type: String, nullable: true })
  @IsDateString({}, { message: 'Created At is a date string' })
  createdAt?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsDateString({}, { message: 'Updated At is a date string' })
  updatedAt?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsDateString({}, { message: 'Deleted At is a date string' })
  deletedAt?: string;
}
