import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PublicCapacityModificationResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success?: boolean;
}
