import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { ManagementCapacityFilters } from '../queryParams';
import { ListOptions } from '../shared';

export class ManagementCapacityListQuery extends ListOptions {
  @ApiProperty({ type: ManagementCapacityFilters })
  @IsOptional()
  filters?: ManagementCapacityFilters;
}
