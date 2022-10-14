export const HttpErrorStatusCodeToCodeMap: { [key: number]: string } = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHORIZED',
  404: 'NOT_FOUND',
  405: 'METHOD_NOT_ALLOWED',
  500: null,
};
