import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

import { ManagementEntitySourceItem } from '../shared';
import { ManagementEntitySourceListQuery } from './ManagementEntitySourceListQuery.dto';

export class ManagementEntitySourceListResponse {
  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  count?: number;

  @ApiProperty({ type: ManagementEntitySourceListQuery })
  @IsOptional()
  query?: ManagementEntitySourceListQuery;

  @ApiProperty({ type: [ManagementEntitySourceItem] })
  @IsOptional()
  items?: ManagementEntitySourceItem[];
}
