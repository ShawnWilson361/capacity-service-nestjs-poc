import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { ManagementEntitySourceItem } from '../shared';

export class ManagementEntitySourcePayload {
  @ApiProperty({ type: ManagementEntitySourceItem })
  @Type(() => ManagementEntitySourceItem)
  @ValidateNested()
  entitySource?: ManagementEntitySourceItem;
}
