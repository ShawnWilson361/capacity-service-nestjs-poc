import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class ManagementCapacityFilters {
  @ApiProperty({ type: String })
  @IsString()
  id?: string;

  @ApiProperty({ type: String })
  @IsString()
  entityId?: string;

  @ApiProperty({ type: String })
  @IsString()
  entityType?: string;

  @ApiProperty({ type: String })
  @IsString()
  entitySourceId?: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isLive?: boolean;
}
