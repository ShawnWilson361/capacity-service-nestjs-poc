import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CapacityInfo {
  @ApiProperty({ type: String, required: true })
  @IsString({ message: 'Entity Id is a string' })
  entityId: string;

  @ApiProperty({ type: Number })
  @IsInt({ message: 'Used Capacity is a positive integer or zero' })
  @Min(0, { message: 'ZAM Id is a positive integer or zero' })
  @IsOptional()
  usedCapacity?: number;

  @ApiProperty({ type: Number, required: true })
  @IsInt({ message: 'Max Capacity is a positive integer or zero' })
  @Min(0, { message: 'Max Id is a positive integer or zero' })
  maxCapacity: number;

  @ApiProperty({ type: String, required: true })
  @IsString({ message: 'Entity Type is a string' })
  entityType: string;
}
