import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

import { HttpError } from '@havenengineering/module-shared-typedrouter';

import { ApplicationError } from '../errors/ApplicationError.error';
import { ApplicationErrorLevel } from '../errors/types/ApplicationErrorLevel';
import { IErrorResponse } from '../errors/types/IErrorResponse';
import { IErrorResponseFormatter } from '../errors/types/IErrorResponseFormatter';
import { getDefaultErrorResponse } from '../utils/getDefaultErrorResponse';
import { HttpErrorStatusCodeToCodeMap } from '../utils/httpErrorStatusCodeToCodeMap';

@Catch()
export class ApplicationErrorFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  private errorResponseFormatters = [
    {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      condition: (error: Error): boolean => true,
      formatter: (error: Error): IErrorResponseFormatter => ({
        errorLevel: ApplicationErrorLevel.error,
        errorResponse: getDefaultErrorResponse(error),
      }),
    },
    {
      condition: (error: Error): boolean => error instanceof HttpError,
      formatter: (error: HttpError): IErrorResponseFormatter => ({
        errorLevel: ApplicationErrorLevel.warn,
        errorResponse: {
          ...getDefaultErrorResponse(error),
          message: error.message,
          errors: error.errors,
          status: error.status,
          code: HttpErrorStatusCodeToCodeMap[error.status] || null,
        } as IErrorResponse,
      }),
    },
    {
      condition: (error: Error): boolean => error instanceof ApplicationError,
      formatter: (error: ApplicationError): IErrorResponseFormatter => ({
        errorLevel: error.level,
        errorResponse: {
          ...getDefaultErrorResponse(error),
          ...error.toJSON(),
        } as IErrorResponse,
      }),
    },
  ];

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponseFormatter = this.errorResponseFormatters
      .slice()
      .reverse()
      .find((f) => f.condition(exception));

    const { errorResponse, errorLevel } =
      errorResponseFormatter.formatter(exception);

    switch (errorLevel) {
      case ApplicationErrorLevel.warn:
        this.logger.warn(errorResponse.message, {
          exception,
          stackTrace: exception.stack,
        });
        break;
      default:
        this.logger.error(errorResponse.message, {
          exception,
          stackTrace: exception.stack,
        });
        break;
    }

    response.status(errorResponse.status || 500);
    response.json(errorResponse);
  }
}
