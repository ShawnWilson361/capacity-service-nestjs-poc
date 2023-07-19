import { ApiProperty } from '@nestjs/swagger';

import { PublicCapacityResponse } from './';
import { IsOptional } from 'class-validator';

export class PublicCapacityBatchCreateResponse {
  @ApiProperty({ type: [PublicCapacityResponse] })
  @IsOptional()
  results?: PublicCapacityResponse[];
}
