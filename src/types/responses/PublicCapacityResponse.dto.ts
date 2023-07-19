import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { PublicCapacityItem } from '../shared';

export class PublicCapacityResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  success?: boolean;

  @ApiProperty({ type: PublicCapacityItem })
  @IsOptional()
  capacity?: PublicCapacityItem;
}
