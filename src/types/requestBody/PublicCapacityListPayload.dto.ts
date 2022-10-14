import { ApiProperty } from '@nestjs/swagger';

export class PublicCapacityListPayload {
  @ApiProperty({ type: [String] })
  ids: string[];
}
