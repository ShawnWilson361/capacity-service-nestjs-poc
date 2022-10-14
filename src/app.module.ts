import { PromModule } from '@digikare/nestjs-prom';
import { AsyncContextModule } from '@nestjs-steroids/async-context';
import {
  Logger,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService as NestJsConfigService,
} from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from './config';
import { HealthController } from './controllers/health.controller';
import { CapacityV1Controller as ManagementCapacityV1Controller } from './controllers/management/capacity.v1.controller';
import { EntitySourceV1Controller } from './controllers/management/entitySource.v1.controller';
import { ServiceInfoController } from './controllers/serviceInfo.controller';
import * as Entities from './entities';
import { Capacity, CapacityChange, EntitySource } from './entities';
import { AsyncContextInterceptor } from './interceptors/async-context.interceptor';
import { AdminApiKeyCheckMiddleware } from './middleware/adminApiKeyCheck.middleware';
import { ApmCaptureErrorHandlerMiddleware } from './middleware/apmCaptureErrorHandler.middleware';
import { ApmRequestHandlerMiddleware } from './middleware/apmRequestHandler.middleware';
import { EntitySourceApiKeyCheckMiddleware } from './middleware/entitySourceApiKeyCheck.middleware';
import { RequestLoggingMiddleware } from './middleware/requestLogging.middleware';
import { ServiceInfoApiKeyCheckMiddleware } from './middleware/serviceInfoApiKeyCheck.middleware';
import { EntitySourceModule } from './modules/entitySource.module';
import { InfrastructureModule } from './modules/infrastructure.module';
import { ManagementModule } from './modules/management.module';
import { PublicModule } from './modules/public.module';
import {
  CapacityChangeRepository,
  CapacityRepository,
  EntitySourceRepository,
} from './repositories';
import { AppService } from './services/app.service';
import { ConfigService } from './services/config.service';
import { EntitySourceService } from './services/entitySource.service';
import { isLocal } from './utils/isLocal';
import { provideCustomRepository } from './utils/provideCustomRepository';

const logger = new Logger();

if (isLocal) {
  logger.log(`[AppModule] - Running in local mode...`);
}

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TypeOrmModule.forFeature(Object.values(Entities), 'default'),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [NestJsConfigService],
      useFactory: async (configService: NestJsConfigService) =>
        configService.get('database_connection') || {},
    }),
    AsyncContextModule.forRoot({ isGlobal: true }),
    PromModule.forRoot({
      metricsPath: '/metrics',
      withDefaultsMetrics: true,
      withDefaultController: true,
      withHttpMiddleware: {
        enable: true,
        pathNormalizationExtraMasks: [new RegExp('[a-zA-Z]{2}[0-9]{5,}')],
      },
    }),
    InfrastructureModule,
    EntitySourceModule,
    ManagementModule,
    PublicModule,
  ],
  controllers: [],
  providers: [
    ConfigService,
    NestJsConfigService,
    EntitySourceService,
    AppService,
    Logger,
    provideCustomRepository(Capacity, CapacityRepository),
    provideCustomRepository(CapacityChange, CapacityChangeRepository),
    provideCustomRepository(EntitySource, EntitySourceRepository),
    {
      provide: APP_INTERCEPTOR,
      useClass: AsyncContextInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApmCaptureErrorHandlerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(ApmRequestHandlerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(RequestLoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(EntitySourceApiKeyCheckMiddleware)
      .forRoutes({ path: 'public/*', method: RequestMethod.ALL });
    consumer
      .apply(ServiceInfoApiKeyCheckMiddleware)
      .forRoutes(ServiceInfoController);

    consumer
      .apply(ServiceInfoApiKeyCheckMiddleware)
      .forRoutes(ServiceInfoController);
    consumer.apply(AdminApiKeyCheckMiddleware).forRoutes(ServiceInfoController);
    consumer.apply(AdminApiKeyCheckMiddleware).forRoutes(HealthController);
    consumer
      .apply(AdminApiKeyCheckMiddleware)
      .forRoutes(EntitySourceV1Controller);
    consumer
      .apply(AdminApiKeyCheckMiddleware)
      .forRoutes(ManagementCapacityV1Controller);
  }
}
