import { HttpException } from '@nestjs/common';

import { ApplicationErrorLevel } from './types/ApplicationErrorLevel';
import { IApplicationErrorPayload } from './types/IApplicationErrorPayload';

export class ApplicationError extends HttpException {
  success = false;

  constructor(
    message: string,
    status = 500,
    public code: string = null,
    public level: ApplicationErrorLevel = ApplicationErrorLevel.error
  ) {
    super(message, status);
  }

  toJSON = (): IApplicationErrorPayload => ({
    success: this.success,
    message: this.message,
    status: this.getStatus(),
    code: this.code,
  });
}
