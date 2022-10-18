import { ApiProperty } from '@nestjs/swagger';

import { ManagementEntitySourceItem } from '../shared';

export class ManagementEntitySourcePayload {
  @ApiProperty({ type: ManagementEntitySourceItem })
  entitySource?: ManagementEntitySourceItem;
}
