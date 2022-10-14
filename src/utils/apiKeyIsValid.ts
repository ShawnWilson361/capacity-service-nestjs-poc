import { Request } from 'express';

export const DEFAULT_HEADER_PATH = 'x-api-key';

export const apiKeyIsValid = (
  apiKey: string,
  req: Request,
  headerPath: string = DEFAULT_HEADER_PATH
): boolean => apiKey === req.headers[headerPath];
