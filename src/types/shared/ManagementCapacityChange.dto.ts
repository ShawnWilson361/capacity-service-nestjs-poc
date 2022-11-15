import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString } from 'class-validator';

export class ManagementCapacityChange {
  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Change Id is a string' })
  id?: string;

  @ApiProperty({ type: Number, nullable: true })
  @IsInt({ message: 'Capacity Change Amount is a integer' })
  amount?: number;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Change Entity Type is a string' })
  entityType?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Id is a string' })
  capacityId?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Guest Reference Id is a string' })
  guestReferenceId?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Booking Reference Id is a string' })
  bookingReferenceId?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsDateString({ message: 'Created At is a date string' })
  createdAt?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsDateString({ message: 'Updated At is a date string' })
  updatedAt?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsDateString({ message: 'Deleted At is a date string' })
  deletedAt?: string;
}
