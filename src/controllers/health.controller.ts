import { Controller, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ErrorResponse, GetHealthResponse } from '../types/responses';

@ApiHeader({
  name: 'x-trace-id',
  description: 'set a custom request id for the request',
  schema: { type: 'string' },
})
@ApiHeader({
  name: ' x-api-key',
  description: 'the capacity service api key',
  schema: { type: 'string' },
})
@ApiTags('Infrastructure')
@Controller('_health')
export class HealthController {
  @ApiOkResponse({
    description: 'service is ready',
    schema: {
      $ref: getSchemaPath(GetHealthResponse),
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
  @Get('/')
  getHealth(): GetHealthResponse {
    return {
      success: true,
    };
  }
}
