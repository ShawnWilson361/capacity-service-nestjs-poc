import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { PublicCapacityItem } from '../shared';

export class PublicCapacityCreateResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  success?: boolean;

  @ApiProperty({ type: PublicCapacityItem, required: true })
  capacity: PublicCapacityItem;
}
