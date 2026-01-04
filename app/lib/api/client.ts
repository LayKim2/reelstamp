// API 클라이언트: Axios 인스턴스 생성 및 설정 - 외부 API 서버와 통신하기 위한 HTTP 클라이언트
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/app/lib/constants/api';

// 공통 인터셉터 설정 함수
const setupInterceptors = (client: AxiosInstance, clientName: string) => {
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

// AI API 클라이언트 (대본 생성 등) - 8083 포트
export const aiApiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.AI_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Web API 클라이언트 - 8082 포트
export const webApiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.WEB_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 설정
setupInterceptors(aiApiClient, 'AI API');
setupInterceptors(webApiClient, 'Web API');

// 하위 호환성을 위한 기본 export (AI API 클라이언트)
export default aiApiClient;

// AI API 편의 함수
export const aiApiGet = <T = unknown>(url: string, config?: AxiosRequestConfig) => {
  return aiApiClient.get<T>(url, config);
};

export const aiApiPost = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
  return aiApiClient.post<T>(url, data, config);
};

export const aiApiPut = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
  return aiApiClient.put<T>(url, data, config);
};

export const aiApiDelete = <T = unknown>(url: string, config?: AxiosRequestConfig) => {
  return aiApiClient.delete<T>(url, config);
};

// Web API 편의 함수
export const webApiGet = <T = unknown>(url: string, config?: AxiosRequestConfig) => {
  return webApiClient.get<T>(url, config);
};

export const webApiPost = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
  return webApiClient.post<T>(url, data, config);
};

export const webApiPut = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
  return webApiClient.put<T>(url, data, config);
};

export const webApiDelete = <T = unknown>(url: string, config?: AxiosRequestConfig) => {
  return webApiClient.delete<T>(url, config);
};

// 하위 호환성을 위한 기존 함수들 (AI API 사용)
export const apiGet = aiApiGet;
export const apiPost = aiApiPost;
export const apiPut = aiApiPut;
export const apiDelete = aiApiDelete;
