/* prettier-ignore */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min } from 'class-validator';

export class Paginated<T> {
  @ApiProperty({ type: Array<T> })
  @IsArray({ message: 'Items is an array' })
  items: T[];

  @ApiProperty({ type: Number, nullable: false })
  @IsInt({ message: 'Count is a positive integer or zero' })
  @Min(0, { message: 'Count is a positive integer or zero' })
  count: number;
}
