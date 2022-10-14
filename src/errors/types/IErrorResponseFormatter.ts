import { ApplicationErrorLevel } from './ApplicationErrorLevel';
import { IErrorResponse } from './IErrorResponse';

export interface IErrorResponseFormatter {
  errorLevel: ApplicationErrorLevel;
  errorResponse: IErrorResponse;
}
