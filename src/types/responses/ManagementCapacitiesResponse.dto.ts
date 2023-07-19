import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

import { ManagementCapacityItem } from '../shared';

export class ManagementCapacitiesResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ type: [ManagementCapacityItem] })
  capacities?: ManagementCapacityItem[];
}
