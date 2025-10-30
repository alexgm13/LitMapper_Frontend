export interface Meta {
  pagination?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  meta?: Meta;
  status_code: number;
}
