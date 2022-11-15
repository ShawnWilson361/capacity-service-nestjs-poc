import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';

import { ErrorItem } from '../../errors/types/ErrorItem';
import { CapacityModification } from './CapacityModification.dto';
import { CapacityModificationContext } from './CapacityModificationContext.dto';

export class CapacityModificationRequest {
  @ApiProperty({ type: CapacityModification, nullable: false })
  @IsDefined({ message: 'Change is required' })
  @Type(() => CapacityModification)
  @ValidateNested()
  change: CapacityModification;

  @ApiProperty({ type: ErrorItem, nullable: false })
  errors?: ErrorItem[];

  @ApiProperty({ type: CapacityModificationContext, nullable: false })
  @IsDefined({ message: 'Context is required' })
  @Type(() => CapacityModificationContext)
  @ValidateNested()
  context: CapacityModificationContext;
}
