import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsString, Min } from 'class-validator';

export class ManagementCapacityItem {
  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Item Id is a string' })
  id?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Entity Id is a string' })
  entityId?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Entity Type is a string' })
  entityType?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Entity Source Id is a string' })
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

  @ApiProperty({ type: Boolean, nullable: true })
  @IsBoolean({ message: 'Is Live is a boolean' })
  isLive?: boolean;

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
