import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { ManagementEntitySourceItem } from '../shared';

export class ManagementEntitySourceResponse {
  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ type: ManagementEntitySourceItem })
  @IsOptional()
  entitySource?: ManagementEntitySourceItem;
}
