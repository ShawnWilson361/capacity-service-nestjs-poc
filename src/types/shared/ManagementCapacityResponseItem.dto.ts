import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { ManagementCapacityChange } from './ManagementCapacityChange.dto';
import { ManagementCapacityItem } from './ManagementCapacityItem.dto';

export class ManagementCapacityResponseItem extends ManagementCapacityItem {
  @ApiProperty({ type: [ManagementCapacityChange] })
  @IsArray()
  changes?: ManagementCapacityChange[];
}
