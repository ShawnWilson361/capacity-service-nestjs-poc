import {
  AsyncContext,
  AsyncContextModule,
} from '@nestjs-steroids/async-context';
import { Logger } from '@nestjs/common';
import { ConfigService as NestJsConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { AsyncContextInterceptor } from '../../../src/interceptors/async-context.interceptor';

export default ({
  getFromAsyncContextOverride,
}: {
  getFromAsyncContextOverride?: jest.Func;
}) =>
  Test.createTestingModule({
    imports: [AsyncContextModule.forRoot(), AppModule],
    providers: [
      NestJsConfigService,
      {
        provide: APP_INTERCEPTOR,
        useClass: AsyncContextInterceptor,
      },
    ],
  })
    .overrideProvider(Logger)
    .useValue({
      log: jest.fn().mockImplementation(() => {
        return;
      }),
      warn: jest.fn().mockImplementation(() => {
        return;
      }),
      error: jest.fn().mockImplementation(() => {
        return;
      }),
    })
    .overrideProvider(AsyncContext)
    .useValue({
      set: jest.fn(),
      register: jest.fn(),
      get:
        getFromAsyncContextOverride ||
        jest.fn().mockReturnValue('537573c0-6755-460a-b55d-26c6a8412d65'),
    });
