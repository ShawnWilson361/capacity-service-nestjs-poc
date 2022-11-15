import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

@Catch()
export class ValidationFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof BadRequestException) {
      response.status(422).json(exception.getResponse());
      return;
    }

    response.status((exception as any)?.getStatus?.() || 500).json({
      code: (exception as any)?.code || null,
      message: (exception as any)?.getResponse?.() || 'Something went wrong',
      status: (exception as any)?.getStatus?.() || 500,
      success: false,
      errors: (exception as any)?.errors || undefined,
    });
  }
}
