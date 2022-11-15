import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';

import { Capacity, CapacityChange } from '../../entities';

export class CapacityModificationContext {
  @ApiProperty({ type: Capacity, nullable: false })
  @IsDefined({ message: 'Capacity is required' })
  @Type(() => Capacity)
  @ValidateNested()
  capacity: Capacity;

  @ApiProperty({ type: Array, nullable: false })
  @IsDefined({ message: 'Capacity Changes is required' })
  @ValidateNested({ each: true })
  capacityChanges: CapacityChange[];
}
