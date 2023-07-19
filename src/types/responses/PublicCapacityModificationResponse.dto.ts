import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class PublicCapacityModificationResponse {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  success?: boolean;
}
