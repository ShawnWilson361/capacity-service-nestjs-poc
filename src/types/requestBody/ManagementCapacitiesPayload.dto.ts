import { ApiProperty } from '@nestjs/swagger';

import { ManagementCapacityMaxCapacityChangeItem } from './ManagementCapacityMaxCapacityChangeItem.dto';

export class ManagementCapacitiesPayload {
  @ApiProperty({
    type: [ManagementCapacityMaxCapacityChangeItem],
    required: true,
  })
  items?: ManagementCapacityMaxCapacityChangeItem[];
}
