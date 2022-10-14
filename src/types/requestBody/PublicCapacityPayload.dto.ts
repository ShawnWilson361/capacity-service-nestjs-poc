import { ApiProperty } from '@nestjs/swagger';

import { PublicCapacityItem } from '../shared';

export class PublicCapacityPayload {
  @ApiProperty({ type: PublicCapacityItem, required: true })
  capacity: PublicCapacityItem;
}
