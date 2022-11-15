import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PublicCapacityModificationItem {
  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsDefined({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount is a number' })
  amount: number;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty({ message: 'Entity Id is required' })
  @IsDefined({ message: 'Entity Id is required' })
  @IsString({ message: 'Entity Id is a string' })
  entityId: string;
}
