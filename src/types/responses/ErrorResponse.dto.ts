import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class Error {
  @ApiProperty({ type: String })
  @IsString()
  path: string;

  @ApiProperty({ type: String })
  @IsString()
  message: string;

  @ApiProperty({ type: String })
  @IsString()
  errorCode: string;
}

export class ErrorResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success: boolean;

  @ApiProperty({ type: String })
  @IsString()
  message: string;

  @ApiProperty({ type: Number })
  @IsString()
  status: number;

  @ApiProperty({ type: String })
  @IsString()
  code: string;

  @ApiProperty({ type: Array })
  errors: Error[];
}
