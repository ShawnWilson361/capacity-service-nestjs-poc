import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

import { PublicCapacityItem } from '../shared';

export class PublicCapacityResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ type: PublicCapacityItem })
  capacity?: PublicCapacityItem;
}
