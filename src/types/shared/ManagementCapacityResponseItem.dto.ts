import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';

import { ManagementCapacityChange } from './ManagementCapacityChange.dto';
import { ManagementCapacityItem } from './ManagementCapacityItem.dto';

export class ManagementCapacityResponseItem extends ManagementCapacityItem {
  @ApiProperty({ type: [ManagementCapacityChange] })
  @IsArray({ message: 'Changes is an array of ManagementCapacityChange' })
  @ValidateNested({ each: true })
  @IsOptional()
  changes?: ManagementCapacityChange[];
}
