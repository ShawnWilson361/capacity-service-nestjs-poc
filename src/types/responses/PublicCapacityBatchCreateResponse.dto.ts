import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PublicCapacityResponse } from './';

export class PublicCapacityBatchCreateResponse {
  @ApiProperty({ type: [PublicCapacityResponse] })
  @IsOptional()
  results?: PublicCapacityResponse[];
}
