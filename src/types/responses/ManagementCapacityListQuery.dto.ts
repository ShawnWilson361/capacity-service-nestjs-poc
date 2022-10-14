import { ApiProperty } from '@nestjs/swagger';

import { ManagementCapacityFilters } from '../queryParams';
import { ListOptions } from '../shared';

export class ManagementCapacityListQuery extends ListOptions {
  @ApiProperty({ type: ManagementCapacityFilters })
  filters?: ManagementCapacityFilters;
}
