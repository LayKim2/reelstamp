// API 관련 타입 정의: 요청/응답 타입 및 에러 타입
import { AxiosError } from 'axios';

// Validation Error 응답 타입 (422 등)
export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ValidationErrorResponse {
  detail: ValidationErrorDetail[];
}

// API 에러 타입 (일반 에러)
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

// Axios 에러를 처리하기 위한 헬퍼 타입
export type ApiErrorResponse = AxiosError<ValidationErrorResponse | ApiError>;
