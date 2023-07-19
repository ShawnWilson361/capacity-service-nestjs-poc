import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { ManagementCapacityResponseItem } from '../shared';

export class ManagementCapacityResponse {
  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ type: ManagementCapacityResponseItem })
  @IsOptional()
  capacity?: ManagementCapacityResponseItem;
}
