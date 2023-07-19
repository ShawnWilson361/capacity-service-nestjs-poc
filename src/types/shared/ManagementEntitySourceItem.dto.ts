import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ManagementEntitySourceItem {
  @ApiProperty({ type: String, nullable: true })
  @IsString({ message: 'Capacity Change Id is a string' })
  @IsOptional()
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
  @IsOptional()
  isLive?: boolean;

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
