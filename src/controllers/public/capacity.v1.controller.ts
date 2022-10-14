import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
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

import { CapacityService } from '../../services/capacity.service';
import { CapacityChangeService } from '../../services/capacityChange.service';
import { ConfigService } from '../../services/config.service';
import {
  PublicCapacityBatchCreatePayload,
  PublicCapacityListPayload,
  PublicCapacityModificationPayload,
  PublicCapacityPayload,
} from '../../types/requestBody';
import {
  ErrorResponse,
  PublicCapacityBatchCreateResponse,
  PublicCapacityCreateResponse,
  PublicCapacityListResponse,
  PublicCapacityModificationResponse,
  PublicCapacityResponse,
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
@Controller('/public/v1/capacity')
export class CapacityV1Controller {
  private readonly guestReferenceIdHeaderKey: string;
  private readonly bookingReferenceIdHeaderKey: string;
  private readonly teamMemberBookingHeaderKey: string;

  constructor(
    @Inject(CapacityService)
    private readonly capacityService: CapacityService,
    @Inject(CapacityChangeService)
    private readonly capacityChangeService: CapacityChangeService,
    @Inject(ConfigService)
    private readonly configService: ConfigService
  ) {
    this.guestReferenceIdHeaderKey = this.configService.get<string>(
      'guest-reference-id-header'
    );
    this.bookingReferenceIdHeaderKey = this.configService.get<string>(
      'booking-reference-id-header'
    );
    this.teamMemberBookingHeaderKey = this.configService.get<string>(
      'team-member-booking-header'
    );
  }

  @ApiOkResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(PublicCapacityListResponse),
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
  @HttpCode(200)
  @ApiOperation({ summary: 'Get multiple capacities' })
  @Post('/batch')
  async getCapacities(
    @Body() body: PublicCapacityListPayload
  ): Promise<PublicCapacityListResponse> {
    return await this.capacityService.findCapacitiesByIds(body?.ids || []);
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(PublicCapacityResponse),
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
  @ApiOperation({ summary: 'Get a capacity' })
  @Get('/:id')
  async getCapacity(@Param('id') id: string): Promise<PublicCapacityResponse> {
    const item = await this.capacityService.getCapacityById(id);

    return {
      success: true,
      capacity: mapCapacityToPublicCapacityItem(item),
    };
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(PublicCapacityBatchCreateResponse),
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
  @ApiOperation({ summary: 'Create one or many capacities' })
  @Post('/batch/create')
  async createCapacities(
    @Body() body: PublicCapacityBatchCreatePayload
  ): Promise<PublicCapacityBatchCreateResponse> {
    return await this.capacityService.createCapacities(
      (body?.capacities || []).map((capacity) => ({
        ...capacity,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
      }))
    );
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(PublicCapacityCreateResponse),
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
  @ApiOperation({ summary: 'Create one or many capacities' })
  @Post('/')
  async createCapacity(
    @Body() body: PublicCapacityPayload
  ): Promise<PublicCapacityCreateResponse> {
    const item = await this.capacityService.createCapacity({
      isLive: true,
      heldCapacity: 0,
      ...body.capacity,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    });

    return {
      success: true,
      capacity: mapCapacityToPublicCapacityItem(item),
    };
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(PublicCapacityModificationResponse),
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
  @ApiHeader({
    name: 'x-booking-reference-id',
    description: 'booking reference id to set it for the change',
    schema: { type: 'string' },
  })
  @ApiHeader({
    name: 'x-team-member-booking',
    description: 'team member booking to allow overbook on a session',
    schema: { type: 'boolean' },
  })
  @ApiOperation({ summary: 'Reserve or free a specific amount of a capacity' })
  @Patch('/')
  async updateCapacity(
    @Body() body: PublicCapacityModificationPayload,
    @Headers() headers
  ): Promise<PublicCapacityModificationResponse> {
    const guestReferenceId = headers[this.guestReferenceIdHeaderKey] as string;
    const bookingReferenceId =
      (headers[this.bookingReferenceIdHeaderKey] as string) || undefined;
    const teamMemberBooking =
      (headers[this.teamMemberBookingHeaderKey] as unknown as boolean) || false;

    const changes = body.changes.map((change) => ({
      ...change,
      guestReferenceId,
      bookingReferenceId,
      teamMemberBooking,
    }));

    await this.capacityChangeService.createCapacityChanges(changes);

    return {
      success: true,
    };
  }
}
