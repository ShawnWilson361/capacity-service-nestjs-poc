import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class ManagementCapacityItem {
  @ApiProperty({ type: String })
  @IsString()
  id?: string;

  @ApiProperty({ type: String })
  @IsString()
  entityId?: string;

  @ApiProperty({ type: String })
  @IsString()
  entityType?: string;

  @ApiProperty({ type: String })
  @IsString()
  entitySourceId?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  maxCapacity?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  usedCapacity?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  heldCapacity?: number;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isLive?: boolean;

  @ApiProperty({ type: String })
  @IsString()
  createdAt?: string;

  @ApiProperty({ type: String })
  @IsString()
  updatedAt?: string;

  @ApiProperty({ type: String })
  @IsString()
  deletedAt?: string;
}