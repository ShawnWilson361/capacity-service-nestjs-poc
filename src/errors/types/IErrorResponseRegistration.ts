import { IErrorResponseFormatter } from './IErrorResponseFormatter';

export interface IErrorResponseRegistration {
  condition: (error: Error) => boolean;
  formatter: (error: Error) => IErrorResponseFormatter;
}
