import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

import { ManagementEntitySourceItem } from '../shared';

export class ManagementEntitySourceResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ type: ManagementEntitySourceItem })
  entitySource?: ManagementEntitySourceItem;
}
