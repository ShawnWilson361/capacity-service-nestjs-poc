import { ApiProperty } from '@nestjs/swagger';

import { CapacityInfo } from '../shared';

export class PublicCapacityOverridePayload {
  @ApiProperty({ type: [CapacityInfo], required: true })
  items: CapacityInfo[];
}
