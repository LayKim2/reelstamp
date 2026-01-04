// API 관련 상수 정의: 외부 API 서버 엔드포인트 및 설정
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://140.245.70.80:8082',
  TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000', 10),
} as const;

