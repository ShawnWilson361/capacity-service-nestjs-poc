import { ApiProperty } from '@nestjs/swagger';

import { ManagementCapacityItem } from '../shared';

export class ManagementCapacityPayload {
  @ApiProperty({ type: ManagementCapacityItem })
  capacity?: ManagementCapacityItem;
}
