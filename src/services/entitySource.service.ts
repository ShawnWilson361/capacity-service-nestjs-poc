import { AsyncContext } from '@nestjs-steroids/async-context';
import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService as NestJsConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

import { EntitySource } from '../entities';
import { ApplicationError } from '../errors/ApplicationError.error';
import { EntitySourceRepository } from '../repositories';
import {
  GenericDeleteResponse,
  ManagementEntitySourceListQuery,
  ManagementEntitySourceListResponse,
  ManagementEntitySourceResponse,
} from '../types/responses';
import { DEFAULT_HEADER_PATH } from '../utils/apiKeyIsValid';
import { mapEntitySourceToManagementEntitySourceItem } from '../utils/mappers.ts';

@Injectable()
export class EntitySourceService {
  private apiKeyToEntitySourceMap: Map<string, string>;

  constructor(
    @InjectRepository(EntitySourceRepository)
    private readonly entitySourceRepository: EntitySourceRepository,
    @Inject(NestJsConfigService)
    private readonly configService: NestJsConfigService,
    private readonly asyncContext: AsyncContext<string, string>,
    private readonly logger: Logger
  ) {}

  async initEntitySourceStore() {
    this.logger.log(
      '[EntitySourceApiKeyCheckMiddleware:initEntitySourceStore] - loading entity source api keys'
    );
    this.apiKeyToEntitySourceMap = new Map<string, string>();

    const entitySources = await this.entitySourceRepository.find();

    entitySources.forEach((entitySource) => {
      const apiKey: string = this.configService.get(entitySource.keyReference);

      if (!apiKey) {
        this.logger.warn(
          `[EntitySourceApiKeyCheckMiddleware:initEntitySourceStore] - no apiKey env var for "${entitySource.name}" entity, keyReference is "${entitySource.keyReference}"`
        );
      } else {
        this.apiKeyToEntitySourceMap.set(apiKey, entitySource.id);
      }
    });
  }

  async getEntitySourceIdFromRequest(
    req: Request,
    headerPath: string = DEFAULT_HEADER_PATH
  ): Promise<string | undefined> {
    const apiKey = req.headers[headerPath] as string;

    if (!this.apiKeyToEntitySourceMap) {
      await this.initEntitySourceStore();
    }

    return this.apiKeyToEntitySourceMap.has(apiKey)
      ? this.apiKeyToEntitySourceMap.get(apiKey)
      : undefined;
  }

  async getEntitySourceId(): Promise<string> {
    if (!this.apiKeyToEntitySourceMap) {
      await this.initEntitySourceStore();
    }

    const entitySourceId = this.asyncContext.get('entitySourceId');

    if (!entitySourceId) {
      throw new ApplicationError(
        'Missing entity source Id',
        400,
        'missing entity source id'
      );
    }

    return entitySourceId;
  }

  async getEntitySources(
    query: ManagementEntitySourceListQuery
  ): Promise<ManagementEntitySourceListResponse> {
    const results =
      await this.entitySourceRepository.findPaginatedEntitySources(
        {
          limit: query?.limit,
          orderBy: query?.orderBy,
          orderDirection: query?.orderDirection,
          page: query?.page,
        },
        query?.filters
      );

    return {
      success: true,
      count: results?.count || 0,
      items:
        results?.items.map((item) =>
          mapEntitySourceToManagementEntitySourceItem(item)
        ) || [],
      query,
    };
  }

  async getEntitySourceById(
    id: string
  ): Promise<ManagementEntitySourceResponse> {
    const item = await this.entitySourceRepository.findEntitySource(id);

    if (!item) {
      throw new ApplicationError('Not found!', 404, 'NOT FOUND');
    }

    return {
      success: true,
      item: mapEntitySourceToManagementEntitySourceItem(item),
    };
  }

  async createEntitySource(
    partial: Partial<EntitySource>
  ): Promise<ManagementEntitySourceResponse> {
    const item = await this.entitySourceRepository.createEntitySource(partial);

    return {
      success: true,
      item: mapEntitySourceToManagementEntitySourceItem(item),
    };
  }

  async updateEntitySource(
    partial: Partial<EntitySource>
  ): Promise<ManagementEntitySourceResponse> {
    const item = await this.entitySourceRepository.updateEntitySource(partial);

    return {
      success: true,
      item: mapEntitySourceToManagementEntitySourceItem(item),
    };
  }

  async deleteEntitySource(id: string): Promise<GenericDeleteResponse> {
    await this.entitySourceRepository.deleteEntitySource(id);

    return {
      id,
      success: true,
    };
  }
}
