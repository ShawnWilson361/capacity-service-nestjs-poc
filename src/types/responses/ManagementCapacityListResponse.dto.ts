import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

import { ManagementCapacityItem } from '../shared';
import { ManagementCapacityListQuery } from './ManagementCapacityListQuery.dto';

export class ManagementCapacityListResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ type: Number })
  @IsNumber()
  count?: number;

  @ApiProperty({ type: ManagementCapacityListQuery })
  query?: ManagementCapacityListQuery;

  @ApiProperty({ type: [ManagementCapacityItem] })
  items?: ManagementCapacityItem[];
}
