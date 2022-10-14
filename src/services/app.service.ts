import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntitySourceRepository } from '../repositories';
import { GetServiceInfoResponse } from '../types/responses';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(EntitySourceRepository)
    private readonly entitySourceRepository: EntitySourceRepository,
    private logger: Logger
  ) {}

  async getServiceInfo(): Promise<GetServiceInfoResponse> {
    let success = true;
    let dbConnection = true;
    const now = Date.now();

    try {
      await this.entitySourceRepository.find({ take: 1 });
    } catch (error) {
      this.logger.warn(`dbConnection error`, { error });
      success = false;
      dbConnection = false;
    }

    return {
      version: process.env.npm_package_version,
      date: new Date().toISOString(),
      age: Date.now() - now,
      started: new Date(now).toISOString(),
      success,
      dbConnection,
    };
  }
}
