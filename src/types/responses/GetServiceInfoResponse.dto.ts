import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class GetServiceInfoResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success: boolean;

  @ApiProperty({ type: String })
  @IsString()
  version: string;

  @ApiProperty({ type: String })
  @IsString()
  date: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  age: number;

  @ApiProperty({ type: String })
  @IsString()
  started: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  dbConnection: boolean;
}
