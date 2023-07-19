import { ApiProperty } from '@nestjs/swagger';

import { ManagementEntitySourceFilters } from '../queryParams';
import { ListOptions } from '../shared';
import { IsOptional } from 'class-validator';

export class ManagementEntitySourceListQuery extends ListOptions {
  @ApiProperty({ type: ManagementEntitySourceFilters })
  @IsOptional()
  filters?: ManagementEntitySourceFilters;
}
