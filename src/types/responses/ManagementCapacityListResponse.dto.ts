import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

import { ManagementCapacityItem } from '../shared';
import { ManagementCapacityListQuery } from './ManagementCapacityListQuery.dto';

export class ManagementCapacityListResponse {
  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  count?: number;

  @ApiProperty({ type: ManagementCapacityListQuery })
  @IsOptional()
  query?: ManagementCapacityListQuery;

  @ApiProperty({ type: [ManagementCapacityItem] })
  @IsOptional()
  items?: ManagementCapacityItem[];
}
