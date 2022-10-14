import { ApiProperty } from '@nestjs/swagger';

import { ManagementEntitySourceFilters } from '../queryParams';
import { ListOptions } from '../shared';

export class ManagementEntitySourceListQuery extends ListOptions {
  @ApiProperty({ type: ManagementEntitySourceFilters })
  filters?: ManagementEntitySourceFilters;
}
