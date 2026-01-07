// API 클라이언트: Axios 인스턴스 생성 및 설정 - 외부 API 서버와 통신하기 위한 HTTP 클라이언트
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/app/lib/constants/api';

/**
 * 공통 인터셉터 설정 함수
 * 모든 Axios 인스턴스에 대해 요청/응답 로깅 및 공통 처리를 수행합니다.
 */
export const setupInterceptors = (client: AxiosInstance, clientName: string) => {
  // 요청 인터셉터: 요청 전 로깅 및 헤더 설정
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // FormData인 경우 Content-Type을 자동으로 설정하도록 제거
      // Axios가 자동으로 multipart/form-data와 boundary를 설정함
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      
      const timestamp = new Date().toISOString();
      console.log(`[${clientName} Request] ${timestamp}`, {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        headers: config.headers,
        hasFormData: config.data instanceof FormData,
      });
      return config;
    },
    (error) => {
      console.error(`[${clientName} Request Error]`, error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터: 응답 후 로깅 및 에러 처리
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const timestamp = new Date().toISOString();
      console.log(`[${clientName} Response] ${timestamp}`, {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
        dataStringified: JSON.stringify(response.data, null, 2),
      });
      return response;
    },
    (error) => {
      const timestamp = new Date().toISOString();
      console.error(`[${clientName} Response Error] ${timestamp}`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
      });
      return Promise.reject(error);
    }
  );
};

/**
 * Web API 클라이언트 - 8082 포트
 * 로그인, 로그아웃 등 인증 토큰이 아직 없거나 특수 헤더(Refresh Token)를 사용하는 경우에 사용합니다.
 * 인증된 요청은 getServerApiClient()를 사용해야 합니다.
 */
export const webApiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.WEB_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 설정
setupInterceptors(webApiClient, 'Web API');
