export interface ServiceResponse<T = unknown> {
  message: string;
  result?: T;
}
