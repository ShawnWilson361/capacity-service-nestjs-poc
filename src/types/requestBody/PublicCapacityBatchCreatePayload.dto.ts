import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PublicCapacityItem } from '../shared';

export class PublicCapacityBatchCreatePayload {
  @ApiProperty({ type: [PublicCapacityItem] })
  @IsOptional()
  capacities?: PublicCapacityItem[];
}
