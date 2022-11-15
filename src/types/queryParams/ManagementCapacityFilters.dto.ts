import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class ManagementCapacityFilters {
  @ApiProperty({ type: String })
  @IsString({ message: 'Id is a string' })
  id?: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Entity Id is a string' })
  entityId?: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Entity Type is a string' })
  entityType?: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Entity Source Id is a string' })
  entitySourceId?: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Is Live is a boolean' })
  isLive?: boolean;
}
