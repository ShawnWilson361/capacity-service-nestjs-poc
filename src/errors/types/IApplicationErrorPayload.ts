import { ErrorItem } from './ErrorItem';

export interface IApplicationErrorPayload {
  success: boolean;
  message: string;
  status: number;
  code: string;
  errors?: ErrorItem[];
}
