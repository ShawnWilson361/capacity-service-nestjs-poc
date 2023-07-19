import { ApiProperty } from '@nestjs/swagger';

import { ManagementCapacityFilters } from '../queryParams';
import { ListOptions } from '../shared';
import { IsOptional } from 'class-validator';

export class ManagementCapacityListQuery extends ListOptions {
  @ApiProperty({ type: ManagementCapacityFilters })
  @IsOptional()
  filters?: ManagementCapacityFilters;
}
