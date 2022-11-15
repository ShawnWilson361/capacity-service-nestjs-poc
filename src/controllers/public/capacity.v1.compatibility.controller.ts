import {
  Body,
  Controller,
  Headers,
  Inject,
  Patch,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ValidationFilter } from '../../filters/validation.filter';
import { CapacityService } from '../../services/capacity.service';
import { ConfigService } from '../../services/config.service';
import { PublicCapacityOverridePayload } from '../../types/requestBody';
import {
  ErrorResponse,
  PublicCapacityCompatibilityModificationResponse,
} from '../../types/responses';
import { mapCapacityToPublicCapacityItem } from '../../utils/mappers.ts';

@ApiHeader({
  name: 'x-trace-id',
  required: true,
  description: 'set a custom request id for the request',
  schema: { type: 'string' },
})
@ApiHeader({
  name: ' x-api-key',
  required: true,
  description: 'the capacity service api key',
  schema: { type: 'string' },
})
@ApiTags('Public')
@Controller('/public/v1-compatibility/capacity')
export class CapacityV1CompatibilityController {
  private readonly guestReferenceIdHeaderKey: string;

  constructor(
    @Inject(CapacityService)
    private readonly capacityService: CapacityService,
    @Inject(ConfigService)
    private readonly configService: ConfigService
  ) {
    this.guestReferenceIdHeaderKey = this.configService.get<string>(
      'guest-reference-id-header'
    );
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(PublicCapacityCompatibilityModificationResponse),
    },
  })
  @ApiBadRequestResponse({
    schema: {
      $ref: getSchemaPath(ErrorResponse),
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    schema: {
      $ref: getSchemaPath(ErrorResponse),
    },
  })
  @ApiHeader({
    name: ' x-guest-reference-id',
    required: true,
    description: 'guest reference id to set it for the change',
    schema: { type: 'string' },
  })
  @ApiOperation({ summary: 'Update a capacity' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      skipMissingProperties: true,
    })
  )
  @UseFilters(ValidationFilter)
  @Patch('/')
  async updateCapacity(
    @Body() body: PublicCapacityOverridePayload,
    @Headers() headers
  ): Promise<PublicCapacityCompatibilityModificationResponse> {
    const guestReferenceId = headers[this.guestReferenceIdHeaderKey] as string;

    const items = await this.capacityService.replaceCapacity(
      body.items,
      guestReferenceId
    );

    return {
      success: true,
      items: items.map((item) => mapCapacityToPublicCapacityItem(item)),
    };
  }
}
