import { ErrorWithLabels } from '../errors/ErrorWithLabels.error';

export const isErrorWithLabels = (err: {
  metadata?: { labels?: unknown };
}): err is ErrorWithLabels => {
  return err.metadata !== undefined && err.metadata?.labels !== undefined;
};
