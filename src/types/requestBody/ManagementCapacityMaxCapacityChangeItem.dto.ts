import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ManagementCapacityMaxCapacityChangeItem {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  entityId: string;

  @ApiProperty({ type: String })
  @IsString()
  entityType: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  maxCapacity: number;
}
