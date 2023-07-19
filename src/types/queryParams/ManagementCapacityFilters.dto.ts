import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ManagementCapacityFilters {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString({ message: 'Id is a string' })
  id?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString({ message: 'Entity Id is a string' })
  entityId?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString({ message: 'Entity Type is a string' })
  entityType?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString({ message: 'Entity Source Id is a string' })
  entitySourceId?: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean({ message: 'Is Live is a boolean' })
  isLive?: boolean;
}
