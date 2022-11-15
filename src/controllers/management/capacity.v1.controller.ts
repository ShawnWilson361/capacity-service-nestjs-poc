import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ValidationFilter } from '../../filters/validation.filter';
import { CapacityService } from '../../services/capacity.service';
import { OrderDirection } from '../../types/enums';
import { ManagementCapacityFilters } from '../../types/queryParams';
import { ManagementCapacityPayload } from '../../types/requestBody';
import {
  ErrorResponse,
  GenericDeleteResponse,
  ManagementCapacityListResponse,
  ManagementCapacityResponse,
} from '../../types/responses';
import {
  mapCapacityToManagementCapacityItem,
  mapCapacityToManagementCapacityResponseItem,
} from '../../utils/mappers.ts';

@ApiHeader({
  name: 'x-trace-id',
  required: true,
  description: 'set a custom request id for the request',
  schema: { type: 'string' },
})
@ApiHeader({
  name: ' x-api-key',
  required: true,
  description: 'the capacity service management api key',
  schema: { type: 'string' },
})
@ApiTags('Admin')
@Controller('/management/v1/capacity')
export class CapacityV1Controller {
  constructor(
    @Inject(CapacityService)
    private readonly capacityService: CapacityService
  ) {}

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ManagementCapacityListResponse),
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
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'page number of the result (default 0)',
    schema: { type: 'number', default: 0 },
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'items number on a page (default 50)',
    schema: { type: 'number', default: 50 },
  })
  @ApiQuery({
    name: 'orderBy',
    required: true,
    description: 'order by (default id)',
    schema: { type: 'string', default: 'id' },
  })
  @ApiQuery({
    name: 'orderDirection',
    required: true,
    description: 'ASC or DESC (default ASC)',
    enum: OrderDirection,
  })
  @ApiQuery({
    name: 'filters',
    description: 'capacity filters',
    required: false,
    schema: { $ref: getSchemaPath(ManagementCapacityFilters) },
  })
  @ApiOperation({ summary: 'Get list of capacities' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    })
  )
  @UseFilters(ValidationFilter)
  @Get('/')
  async getCapacityList(
    @Query('filters') filters?: ManagementCapacityFilters,
    @Query('page') page = 0,
    @Query('limit') limit = 50,
    @Query('orderBy') orderBy = 'id',
    @Query('orderDirection') orderDirection = OrderDirection.Asc
  ): Promise<ManagementCapacityListResponse> {
    return await this.capacityService.getCapacities({
      limit,
      orderBy,
      orderDirection,
      page,
      filters,
    });
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ManagementCapacityResponse),
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
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Get a capacity' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  @UseFilters(ValidationFilter)
  @Get('/:id')
  async getCapacityById(
    @Param('id') id: string
  ): Promise<ManagementCapacityResponse> {
    const item = await this.capacityService.getCapacityById(id);

    if (!item) {
      throw new NotFoundException(
        `Capacity with Id '${id}' could not be found`
      );
    }

    return {
      success: true,
      capacity: mapCapacityToManagementCapacityResponseItem(item),
    };
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ManagementCapacityResponse),
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
  @ApiOperation({ summary: 'Create a capacity' })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    })
  )
  @UseFilters(ValidationFilter)
  @Post('/')
  async createCapacity(
    @Body() body: ManagementCapacityPayload
  ): Promise<ManagementCapacityResponse> {
    const item = await this.capacityService.createCapacity({
      ...body.capacity,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    });

    return {
      success: true,
      capacity: mapCapacityToManagementCapacityItem(item),
    };
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ManagementCapacityResponse),
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
  @ApiOperation({ summary: 'Update a capacity' })
  @ApiParam({ name: 'id', type: String })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    })
  )
  @UseFilters(ValidationFilter)
  @Put('/:id')
  async updateCapacity(
    @Body() body: ManagementCapacityPayload
  ): Promise<ManagementCapacityResponse> {
    return await this.capacityService.updateCapacity({
      ...body.capacity,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    });
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(GenericDeleteResponse),
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
  @ApiOperation({ summary: 'Delete a capacity' })
  @ApiParam({ name: 'id', type: String })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  @UseFilters(ValidationFilter)
  @Delete('/:id')
  async deleteCapacity(
    @Param('id') id: string
  ): Promise<GenericDeleteResponse> {
    return await this.capacityService.deleteCapacity(id);
  }
}
