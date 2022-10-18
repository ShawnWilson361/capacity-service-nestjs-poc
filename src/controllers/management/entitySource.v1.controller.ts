import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
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

import { EntitySourceService } from '../../services/entitySource.service';
import { OrderDirection } from '../../types/enums';
import { ManagementEntitySourceFilters } from '../../types/queryParams';
import { ManagementEntitySourcePayload } from '../../types/requestBody';
import {
  ErrorResponse,
  GenericDeleteResponse,
  ManagementEntitySourceListResponse,
  ManagementEntitySourceResponse,
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
  description: 'the capacity service management api key',
  schema: { type: 'string' },
})
@ApiTags('EntitySource')
@Controller('/management/v1/entitySource')
export class EntitySourceV1Controller {
  constructor(
    @Inject(EntitySourceService)
    private entitySourceService: EntitySourceService
  ) {}

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ManagementEntitySourceListResponse),
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
    description: 'entity source filters',
    required: false,
    schema: { $ref: getSchemaPath(ManagementEntitySourceFilters) },
  })
  @ApiOperation({ summary: 'Get list of entity sources' })
  @Get('/')
  async getEntitySources(
    @Query('filters') filters?: ManagementEntitySourceFilters,
    @Query('page') page = 0,
    @Query('limit') limit = 50,
    @Query('orderBy') orderBy = 'id',
    @Query('orderDirection') orderDirection = OrderDirection.Asc
  ): Promise<ManagementEntitySourceListResponse> {
    return await this.entitySourceService.getEntitySources({
      limit,
      orderBy,
      orderDirection,
      page,
      filters,
    });
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ManagementEntitySourceResponse),
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
  @ApiOperation({ summary: 'Get an entity source' })
  @Get('/:id')
  async getEntitySourceById(
    @Param('id') id: string
  ): Promise<ManagementEntitySourceResponse> {
    return await this.entitySourceService.getEntitySourceById(id);
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ManagementEntitySourceResponse),
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
  @ApiOperation({ summary: 'Create an entity source' })
  @Post('/')
  async createEntitySource(
    @Body() body: ManagementEntitySourcePayload
  ): Promise<ManagementEntitySourceResponse> {
    return await this.entitySourceService.createEntitySource({
      ...body.entitySource,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    });
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(ManagementEntitySourceResponse),
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
  @ApiOperation({ summary: 'Update an entity source' })
  @ApiParam({ name: 'id', type: String })
  @Put('/:id')
  async updateEntitySource(
    @Param('id') id: string,
    @Body() body: ManagementEntitySourcePayload
  ): Promise<ManagementEntitySourceResponse> {
    return await this.entitySourceService.updateEntitySource({
      ...body.entitySource,
      id,
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
  @ApiOperation({ summary: 'Delete an entity source' })
  @ApiParam({ name: 'id', type: String })
  @Delete('/:id')
  async deleteEntitySource(
    @Param('id') id: string
  ): Promise<GenericDeleteResponse> {
    return await this.entitySourceService.deleteEntitySource(id);
  }
}
