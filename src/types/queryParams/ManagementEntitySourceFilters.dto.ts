import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class ManagementEntitySourceFilters {
  @ApiProperty({ type: String })
  @IsString()
  id?: string;

  @ApiProperty({ type: String })
  @IsString()
  name?: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isLive?: boolean;
}
