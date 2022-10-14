import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class GenericDeleteResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success: boolean;

  @ApiProperty({ type: String })
  @IsString()
  id: string;
}
