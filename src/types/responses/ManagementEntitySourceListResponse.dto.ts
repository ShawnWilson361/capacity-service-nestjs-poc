import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

import { ManagementEntitySourceItem } from '../shared';
import { ManagementEntitySourceListQuery } from './ManagementEntitySourceListQuery.dto';

export class ManagementEntitySourceListResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ type: Number })
  @IsNumber()
  count?: number;

  @ApiProperty({ type: ManagementEntitySourceListQuery })
  query?: ManagementEntitySourceListQuery;

  @ApiProperty({ type: [ManagementEntitySourceItem] })
  items?: ManagementEntitySourceItem[];
}
