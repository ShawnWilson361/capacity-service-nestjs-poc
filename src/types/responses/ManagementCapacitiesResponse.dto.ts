import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { ManagementCapacityItem } from '../shared';

export class ManagementCapacitiesResponse {
  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  success?: boolean;

  @ApiProperty({ type: [ManagementCapacityItem] })
  @IsOptional()
  capacities?: ManagementCapacityItem[];
}
