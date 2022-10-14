import { ApplicationError } from './ApplicationError.error';
import { ApplicationErrorLevel } from './types/ApplicationErrorLevel';
import { ErrorItem } from './types/ErrorItem';
import { IApplicationErrorPayload } from './types/IApplicationErrorPayload';

export class ApplicationErrorList extends ApplicationError {
  success = false;
  constructor(
    message: string,
    public errors: ErrorItem[],
    status = 500,
    code: string = null,
    level: ApplicationErrorLevel = ApplicationErrorLevel.error
  ) {
    super(message, status, code, level);
  }

  toJSON = (): IApplicationErrorPayload => ({
    success: this.success,
    message: this.message,
    status: this.getStatus(),
    code: this.code,
    errors: this.errors,
  });
}
