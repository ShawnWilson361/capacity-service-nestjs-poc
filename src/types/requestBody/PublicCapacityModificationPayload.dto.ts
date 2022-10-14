import { ApiProperty } from '@nestjs/swagger';

import { PublicCapacityModificationItem } from '../shared/PublicCapacityModificationItem.dto';

export class PublicCapacityModificationPayload {
  @ApiProperty({ type: [PublicCapacityModificationItem], required: true })
  changes: PublicCapacityModificationItem[];
}
