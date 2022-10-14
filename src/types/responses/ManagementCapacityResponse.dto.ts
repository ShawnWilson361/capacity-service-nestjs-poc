import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

import { ManagementCapacityResponseItem } from '../shared';

export class ManagementCapacityResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ type: ManagementCapacityResponseItem })
  item?: ManagementCapacityResponseItem;
}
