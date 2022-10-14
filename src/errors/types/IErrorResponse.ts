export interface IErrorResponse {
  success: false;
  message: string;
  errors?: {
    path?: string;
    message: string;
    errorCode?: string;
  }[];
  status: number;
  code: string;
}
