import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class PublicCapacityModificationItem {
  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  amount: number;

  @ApiProperty({ type: String, required: true })
  @IsString()
  entityId: string;
}
