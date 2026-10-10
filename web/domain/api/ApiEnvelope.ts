export interface ApiDataResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
}

export interface ApiAuthResponse<T> {
  status: { code: number; message: string };
  data: T;
}

export interface ApiErrorResponse {
  errors: string[];
}
