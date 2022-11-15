import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class ManagementEntitySourceFilters {
  @ApiProperty({ type: String })
  @IsString({ message: 'Id is a string' })
  id?: string;

  @ApiProperty({ type: String })
  @IsString({ message: 'Name is a string' })
  name?: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean({ message: 'Is Live is a boolean' })
  isLive?: boolean;
}
