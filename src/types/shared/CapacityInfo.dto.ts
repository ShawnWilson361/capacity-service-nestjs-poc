import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CapacityInfo {
  @ApiProperty({ type: String, required: true })
  @IsString()
  entityId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  usedCapacity?: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  maxCapacity: number;

  @ApiProperty({ type: String, required: true })
  @IsString()
  entityType: string;
}
