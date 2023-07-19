import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { ManagementCapacityItem } from '../shared';

export class ManagementCapacityPayload {
  @ApiProperty({ type: ManagementCapacityItem })
  @Type(() => ManagementCapacityItem)
  @ValidateNested()
  @IsOptional()
  capacity?: ManagementCapacityItem;
}
