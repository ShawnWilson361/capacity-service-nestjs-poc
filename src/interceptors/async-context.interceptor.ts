import { AsyncContext } from '@nestjs-steroids/async-context';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AsyncContextInterceptor implements NestInterceptor {
  constructor(private readonly ac: AsyncContext<string, any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.ac.register(); // Important to call .register or .registerCallback (good for middleware)
    this.ac.set('traceId', uuid()); // Setting default value traceId
    return next.handle();
  }
}
