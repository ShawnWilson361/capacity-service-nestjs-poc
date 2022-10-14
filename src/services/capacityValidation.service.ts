import { Injectable, Logger } from '@nestjs/common';

import { ApplicationError } from '../errors/ApplicationError.error';
import { CapacityModificationRequest } from '../types/shared';

@Injectable()
export class CapacityValidationService {
  constructor(private logger: Logger) {}

  private noChangeValidator = (
    modificationRequests: CapacityModificationRequest[]
  ): ApplicationError[] =>
    modificationRequests.length > 0
      ? []
      : [new ApplicationError(`No change`, 400, 'NO_CHANGE_REQUESTED')];

  private multipleChangeValidator = (
    modificationRequests: CapacityModificationRequest[]
  ): ApplicationError[] =>
    modificationRequests
      .map((m) => m.change.entityId)
      .filter((m, i, l) => l.indexOf(m) !== i).length <= 0
      ? []
      : [
          new ApplicationError(
            `Duplicate entityId`,
            400,
            'DUPLICATE_CHANGE_REQUESTED'
          ),
        ];

  private remainingCapacityValidator = (
    modificationRequest: CapacityModificationRequest
  ): ApplicationError[] =>
    modificationRequest.change.teamMemberBooking ||
    modificationRequest.context.capacity.usedCapacity +
      modificationRequest.change.amount <=
      modificationRequest.context.capacity.maxCapacity
      ? []
      : [
          new ApplicationError(
            'Maximum capacity exceeded',
            400,
            'MAX_CAPACITY'
          ),
        ];

  private bookedCapacityValidator = (
    modificationRequest: CapacityModificationRequest
  ): ApplicationError[] => {
    if (
      modificationRequest.context.capacity.usedCapacity -
        modificationRequest.change.amount >
      0
    ) {
      return [];
    } else {
      this.logger.warn(
        '[CapacityValidationService:bookedCapacityValidator] - Trying to decrease capacity below 0',
        {
          meta: {
            change: modificationRequest.change,
          },
        }
      );
      return [];
    }
  };

  validateGlobal(
    modificationRequests: CapacityModificationRequest[]
  ): ApplicationError[] {
    const errors: ApplicationError[] = [];
    const noChangeErrors = this.noChangeValidator(modificationRequests);
    const multipleChangeErrors =
      this.multipleChangeValidator(modificationRequests);

    errors.push(...[...noChangeErrors, ...multipleChangeErrors]);

    return errors;
  }

  validate(
    modificationRequest: CapacityModificationRequest
  ): ApplicationError[] {
    const errors: ApplicationError[] = [];
    if (modificationRequest.change.amount === 0) {
      return errors;
    }

    if (modificationRequest.change.amount > 0) {
      const remainingCapacityErrors =
        this.remainingCapacityValidator(modificationRequest);

      errors.push(...[...remainingCapacityErrors]);
    }

    if (modificationRequest.change.amount < 0) {
      const bookedCapacityErrors =
        this.bookedCapacityValidator(modificationRequest);

      errors.push(...[...bookedCapacityErrors]);
    }

    return errors;
  }
}
