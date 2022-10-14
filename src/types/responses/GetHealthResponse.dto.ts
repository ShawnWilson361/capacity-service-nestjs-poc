import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class GetHealthResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success: boolean;
}
