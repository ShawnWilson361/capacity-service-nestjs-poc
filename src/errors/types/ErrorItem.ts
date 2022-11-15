import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class ErrorItem {
  @ApiProperty({ type: String, nullable: false })
  @IsString({ message: 'Path is a string' })
  @IsNotEmpty({ message: 'Path is required' })
  @IsDefined({ message: 'Path is required' })
  path: string;

  @ApiProperty({ type: String, nullable: false })
  @IsString({ message: 'Message is a string' })
  message?: string;

  @ApiProperty({ type: String, nullable: false })
  @IsString({ message: 'Error code is a string' })
  errorCode?: string;
}
