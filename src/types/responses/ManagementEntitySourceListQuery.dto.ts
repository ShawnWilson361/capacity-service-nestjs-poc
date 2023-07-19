import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { ManagementEntitySourceFilters } from '../queryParams';
import { ListOptions } from '../shared';

export class ManagementEntitySourceListQuery extends ListOptions {
  @ApiProperty({ type: ManagementEntitySourceFilters })
  @IsOptional()
  filters?: ManagementEntitySourceFilters;
}
