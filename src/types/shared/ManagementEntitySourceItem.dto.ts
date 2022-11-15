import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ManagementEntitySourceItem {
  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Change Id is a string' })
  id?: string;

  @ApiProperty({ type: String, nullable: false })
  @IsString({ message: 'Entity Source Item Name is a string' })
  @IsNotEmpty({ message: 'Entity Source Item Name is required' })
  @IsDefined({ message: 'Entity Source Item Name is required' })
  name: string;

  @ApiProperty({ type: String, nullable: false })
  @IsString({ message: 'Entity Source Item Key Reference is a string' })
  @IsNotEmpty({ message: 'Entity Source Item Key Reference is required' })
  @IsDefined({ message: 'Entity Source Item Key Reference is required' })
  keyReference: string;

  @ApiProperty({ type: Boolean, nullable: true })
  @IsBoolean({ message: 'Is Live is a boolean' })
  isLive?: boolean;

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
