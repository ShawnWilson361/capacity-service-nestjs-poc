import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class ManagementCapacityChange {
  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Change Id is a string' })
  @IsOptional()
  id?: string;

  @ApiProperty({ type: Number, nullable: true })
  @IsInt({ message: 'Capacity Change Amount is a integer' })
  @IsOptional()
  amount?: number;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Change Entity Type is a string' })
  @IsOptional()
  entityType?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Id is a string' })
  @IsOptional()
  capacityId?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Guest Reference Id is a string' })
  @IsOptional()
  guestReferenceId?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Booking Reference Id is a string' })
  @IsOptional()
  bookingReferenceId?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsDateString({}, { message: 'Created At is a date string' })
  @IsOptional()
  createdAt?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsDateString({}, { message: 'Updated At is a date string' })
  @IsOptional()
  updatedAt?: string;

  @ApiProperty({ type: String, nullable: true })
  @IsDateString({}, { message: 'Deleted At is a date string' })
  @IsOptional()
  deletedAt?: string;
}
