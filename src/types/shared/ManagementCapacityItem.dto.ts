import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ManagementCapacityItem {
  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Item Id is a string' })
  @IsOptional()
  id?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Entity Id is a string' })
  @IsOptional()
  entityId?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Entity Type is a string' })
  @IsOptional()
  entityType?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Entity Source Id is a string' })
  @IsOptional()
  entitySourceId?: string;

  @ApiProperty({ type: Number, nullable: true })
  @IsInt({ message: 'Max Capacity is a positive integer or zero' })
  @Min(0, { message: 'Max Capacity is a positive integer or zero' })
  @IsOptional()
  maxCapacity?: number;

  @ApiProperty({ type: Number, nullable: true })
  @IsInt({ message: 'Used Capacity is a positive integer or zero' })
  @Min(0, { message: 'Used Capacity is a positive integer or zero' })
  @IsOptional()
  usedCapacity?: number;

  @ApiProperty({ type: Number, nullable: true })
  @IsInt({ message: 'Held Capacity is a positive integer or zero' })
  @Min(0, { message: 'Held Capacity is a positive integer or zero' })
  @IsOptional()
  heldCapacity?: number;

  @ApiProperty({ type: Boolean, nullable: true })
  @IsBoolean({ message: 'Is Live is a boolean' })
  @IsOptional()
  isLive?: boolean;

  @ApiProperty({ type: String, nullable: true })
  @IsDateString({}, { message: 'Created At is a date string' })
  @IsOptional()
  createdAt?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsDateString({}, { message: 'Updated At is a date string' })
  @IsOptional()
  updatedAt?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsDateString({}, { message: 'Deleted At is a date string' })
  @IsOptional()
  deletedAt?: string;
}
