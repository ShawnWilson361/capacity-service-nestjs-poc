import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { ManagementCapacityItem } from '../shared';

export class ManagementCapacityPayload {
  @ApiProperty({ type: ManagementCapacityItem })
  @Type(() => ManagementCapacityItem)
  @ValidateNested()
  capacity?: ManagementCapacityItem;
}
