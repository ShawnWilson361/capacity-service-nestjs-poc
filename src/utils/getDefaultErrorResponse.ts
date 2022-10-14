import { IErrorResponse } from '../errors/types/IErrorResponse';

export const getDefaultErrorResponse = (error?: Error): IErrorResponse => ({
  success: false,
  message: error?.message || 'Something went wrong!',
  errors: undefined,
  status: 500,
  code: null,
});
