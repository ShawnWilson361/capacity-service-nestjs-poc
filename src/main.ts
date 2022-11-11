/* eslint-disable @typescript-eslint/no-floating-promises */
import { AsyncContext } from '@nestjs-steroids/async-context';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as chalk from 'chalk';
import * as config from 'config';
import { SwaggerTheme } from 'swagger-themes';

import { AppModule } from './app.module';
import { ApplicationErrorFilter } from './filters/applicationError.filter';
import { AsyncContextInterceptor } from './interceptors/async-context.interceptor';
import { EntitySourceModule } from './modules/entitySource.module';
import { InfrastructureModule } from './modules/infrastructure.module';
import { ManagementModule } from './modules/management.module';
import { PublicModule } from './modules/public.module';
import * as QueryParamsDtos from './types/queryParams';
import * as ResponseDtos from './types/responses';
import * as SharedDtos from './types/shared';

const logger = new Logger();

const responseDtos = Object.values(ResponseDtos || {});
const queryParamsDtos = Object.values(QueryParamsDtos || {});
const sharedDtos = Object.values(SharedDtos || {});

const createPublicEndpointsSwagger = (app: INestApplication): void => {
  const endpointsConfig = new DocumentBuilder()
    .setTitle('Haven Activities Capacity Service Public endpoints')
    .setVersion('2.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, endpointsConfig, {
    include: [PublicModule],
    extraModels: [...responseDtos, ...queryParamsDtos, ...sharedDtos],
  });

  const theme = new SwaggerTheme('v3');
  const options: SwaggerCustomOptions = {
    explorer: true,
    customCss: theme.getBuffer('dark'),
    customSiteTitle:
      'Haven Activities Capacity Service Management Public Documentation',
  };

  SwaggerModule.setup('/public/api', app, document, options);
};

const createManagementEndpointsSwagger = (app: INestApplication): void => {
  const endpointsConfig = new DocumentBuilder()
    .setTitle('Haven Activities Capacity Service Management endpoints')
    .setVersion('2.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, endpointsConfig, {
    include: [ManagementModule],
    extraModels: [...responseDtos, ...queryParamsDtos, ...sharedDtos],
  });

  const theme = new SwaggerTheme('v3');
  const options: SwaggerCustomOptions = {
    explorer: true,
    customCss: theme.getBuffer('dark'),
    customSiteTitle:
      'Haven Activities Capacity Service Management OpenAPI Documentation',
  };

  SwaggerModule.setup('/management/api', app, document, options);
};

const createEntitySourceEndpointsSwagger = (app: INestApplication): void => {
  const endpointsConfig = new DocumentBuilder()
    .setTitle('Haven Activities Capacity Service Entity Source endpoints')
    .setVersion('2.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, endpointsConfig, {
    include: [EntitySourceModule],
    extraModels: [...responseDtos, ...queryParamsDtos, ...sharedDtos],
  });

  const theme = new SwaggerTheme('v3');
  const options: SwaggerCustomOptions = {
    explorer: true,
    customCss: theme.getBuffer('dark'),
    customSiteTitle:
      'Haven Activities Capacity Service Management Entity Source Documentation',
  };

  SwaggerModule.setup('/entitySource/api', app, document, options);
};

const createInfrastructureEndpointsSwagger = (app: INestApplication): void => {
  const endpointsConfig = new DocumentBuilder()
    .setTitle('Haven Activities Capacity Service Infrastructure endpoints')
    .setVersion('2.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, endpointsConfig, {
    include: [InfrastructureModule],
    extraModels: [...responseDtos, ...queryParamsDtos, ...sharedDtos],
  });

  const theme = new SwaggerTheme('v3');
  const options: SwaggerCustomOptions = {
    explorer: true,
    customCss: theme.getBuffer('dark'),
    customSiteTitle:
      'Haven Activities Capacity Service Infrastructure OpenAPI Documentation',
  };

  SwaggerModule.setup('/infrastructure/api', app, document, options);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  createPublicEndpointsSwagger(app);
  createManagementEndpointsSwagger(app);
  createEntitySourceEndpointsSwagger(app);
  createInfrastructureEndpointsSwagger(app);

  const port = config.get<number>('server.port');

  const asyncContext = await app.resolve<AsyncContext<string, any>>(
    AsyncContext
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalInterceptors(new AsyncContextInterceptor(asyncContext));

  app.useGlobalFilters(new ApplicationErrorFilter(logger));

  await app.listen(port);

  logger.log(
    `🚀 ${chalk.blue('Capacity service')} is now listening on port ${port} 🚀`
  );
}

bootstrap();
