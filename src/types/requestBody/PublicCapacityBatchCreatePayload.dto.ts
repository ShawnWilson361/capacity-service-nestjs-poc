import { ApiProperty } from '@nestjs/swagger';

import { PublicCapacityItem } from '../shared';

export class PublicCapacityBatchCreatePayload {
  @ApiProperty({ type: [PublicCapacityItem] })
  capacities?: PublicCapacityItem[];
}
