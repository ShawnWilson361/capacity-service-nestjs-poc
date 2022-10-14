import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

import { PublicCapacityItem } from '../shared';

export class PublicCapacityListResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ type: [PublicCapacityItem] })
  items?: PublicCapacityItem[];
}
