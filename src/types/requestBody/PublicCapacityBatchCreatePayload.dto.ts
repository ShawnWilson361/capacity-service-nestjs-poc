import { ApiProperty } from '@nestjs/swagger';

import { PublicCapacityItem } from '../shared';
import { IsOptional } from 'class-validator';

export class PublicCapacityBatchCreatePayload {
  @ApiProperty({ type: [PublicCapacityItem] })
  @IsOptional()
  capacities?: PublicCapacityItem[];
}
