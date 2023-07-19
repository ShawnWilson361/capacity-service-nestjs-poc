import { Controller, Get, Inject } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { AppService } from '../services/app.service';
import { ErrorResponse, GetServiceInfoResponse } from '../types/responses';

@ApiHeader({
  name: 'x-trace-id',
  description: 'set a custom request id for the request',
  schema: { type: 'string' },
})
@ApiHeader({
  name: 'x-api-key',
  description: 'the capacity service api key',
  schema: { type: 'string' },
})
@ApiTags('Infrastructure')
@Controller('/service-info')
export class ServiceInfoController {
  constructor(
    @Inject(AppService)
    private appService: AppService
  ) {}

  @ApiOkResponse({
    description: 'service is ready',
    schema: {
      $ref: getSchemaPath(GetServiceInfoResponse),
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
  async getServiceInfo(): Promise<GetServiceInfoResponse> {
    return await this.appService.getServiceInfo();
  }
}
