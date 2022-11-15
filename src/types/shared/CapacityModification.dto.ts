import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CapacityModification {
  @ApiProperty({ type: Number, nullable: false })
  @IsNumber({}, { message: 'Amount is a integer' })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsDefined({ message: 'ZAM Id is required' })
  amount: number;

  @ApiProperty({ type: String, nullable: false })
  @IsString({ message: 'Entity Id is a string' })
  @IsNotEmpty({ message: 'Entity Id is required' })
  @IsDefined({ message: 'Entity Id is required' })
  entityId: string;

  @ApiProperty({ type: String, nullable: false })
  @IsString({ message: 'Guest Reference Id is a string' })
  @IsNotEmpty({ message: 'Guest Reference Id is required' })
  @IsDefined({ message: 'Guest Reference Id is required' })
  guestReferenceId: string;

  @ApiProperty({ type: String, nullable: false })
  @IsString({ message: 'Booking Reference Id is a string' })
  bookingReferenceId?: string;

  @ApiProperty({ type: String, nullable: false })
  @IsBoolean({ message: 'Team Member Booking is a boolean' })
  teamMemberBooking: boolean;
}
