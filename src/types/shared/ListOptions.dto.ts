import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

import { OrderDirection } from '../enums';

export class ListOptions {
  @ApiProperty({ type: Number })
  @IsNumber()
  page: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  limit: number;

  @ApiProperty({ type: String })
  @IsString()
  orderBy: string;

  @ApiProperty({ enum: OrderDirection })
  @IsEnum(OrderDirection)
  orderDirection: OrderDirection;
}
