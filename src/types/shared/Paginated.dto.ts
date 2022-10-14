import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class Paginated<T> {
  @ApiProperty({ type: Array<T> })
  @IsArray()
  items: T[];

  @ApiProperty({ type: Number })
  @IsNumber()
  count: number;
}
