import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ManagementEntitySourceFilters {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString({ message: 'Id is a string' })
  id?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString({ message: 'Name is a string' })
  name?: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean({ message: 'Is Live is a boolean' })
  isLive?: boolean;
}
