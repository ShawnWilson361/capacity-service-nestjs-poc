import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, Min } from 'class-validator';

import { OrderDirection } from '../enums';

export class ListOptions {
  @ApiProperty({ type: Number })
  @IsInt({ message: 'Page is a positive integer or zero' })
  @Min(0, { message: 'Page is a positive integer or zero' })
  page: number;

  @ApiProperty({ type: Number })
  @IsInt({ message: 'Limit is a positive integer' })
  @Min(1, { message: 'Limit is a positive integer' })
  limit: number;

  @ApiProperty({ type: String })
  @IsString({ message: 'Order By is a string' })
  orderBy: string;

  @ApiProperty({ enum: OrderDirection })
  @IsEnum(OrderDirection, {
    message: 'Order Direction must be either ASC or DESC',
  })
  orderDirection: OrderDirection;
}
