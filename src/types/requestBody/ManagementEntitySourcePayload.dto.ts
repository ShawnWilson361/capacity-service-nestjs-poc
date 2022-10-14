import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class ManagementEntitySourcePayload {
  @ApiProperty({ type: String })
  @IsString()
  id?: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  keyReference: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isLive?: boolean;

  @ApiProperty({ type: String })
  @IsString()
  description?: string;
}
