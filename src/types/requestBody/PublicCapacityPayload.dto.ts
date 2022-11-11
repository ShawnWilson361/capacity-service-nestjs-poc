import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';

import { PublicCapacityItem } from '../shared';

export class PublicCapacityPayload {
  @ApiProperty({ type: PublicCapacityItem, required: true, nullable: false })
  @IsDefined()
  @Type(() => PublicCapacityItem)
  @ValidateNested()
  capacity: PublicCapacityItem;
}
