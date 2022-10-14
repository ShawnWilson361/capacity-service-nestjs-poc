import { ApiProperty } from '@nestjs/swagger';

import { PublicCapacityResponse } from './';

export class PublicCapacityBatchCreateResponse {
  @ApiProperty({ type: [PublicCapacityResponse] })
  results?: PublicCapacityResponse[];
}
