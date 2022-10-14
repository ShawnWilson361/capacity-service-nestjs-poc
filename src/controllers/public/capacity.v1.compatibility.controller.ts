import { Body, Controller, Headers, Inject, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ConfigService } from '../../services/config.service';
import { PublicCapacityOverridePayload } from '../../types/requestBody';
import {
  ErrorResponse,
  PublicCapacityCompatibilityModificationResponse,
} from '../../types/responses';

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
  @Patch('/')
  async updateCapacity(
    @Body() body: PublicCapacityOverridePayload,
    @Headers() headers
  ): Promise<PublicCapacityCompatibilityModificationResponse> {
    const guestReferenceId = headers[this.guestReferenceIdHeaderKey] as string;

    body.items;

    await Promise.resolve();

    return;
  }
}
