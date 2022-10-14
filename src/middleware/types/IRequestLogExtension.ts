import { ILogConfiguration } from './ILogConfiguration';

export interface IRequestLogExtension {
  ['_requestLogConfiguration']: ILogConfiguration;
}
