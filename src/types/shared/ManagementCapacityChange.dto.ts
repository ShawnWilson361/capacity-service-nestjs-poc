import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ManagementCapacityChange {
  @ApiProperty({ type: String })
  @IsString()
  id?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  amount?: number;

  @ApiProperty({ type: String })
  @IsString()
  entityType?: string;

  @ApiProperty({ type: String })
  @IsString()
  capacityId?: string;

  @ApiProperty({ type: String })
  @IsString()
  guestReferenceId?: string;

  @ApiProperty({ type: String })
  @IsString()
  bookingReferenceId?: string;

  @ApiProperty({ type: String })
  @IsString()
  createdAt?: string;

  @ApiProperty({ type: String })
  @IsString()
  updatedAt?: string;

  @ApiProperty({ type: String })
  @IsString()
  deletedAt?: string;
}
