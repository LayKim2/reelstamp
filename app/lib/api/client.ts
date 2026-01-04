// API 클라이언트: Axios 인스턴스 생성 및 설정 - 외부 API 서버와 통신하기 위한 HTTP 클라이언트
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/app/lib/constants/api';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 요청 전 로깅 및 헤더 설정
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const timestamp = new Date().toISOString();
    console.log(`[API Request] ${timestamp}`, {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 응답 후 로깅 및 에러 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const timestamp = new Date().toISOString();
    console.log(`[API Response] ${timestamp}`, {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    const timestamp = new Date().toISOString();
    console.error(`[API Response Error] ${timestamp}`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// API 클라이언트 export
export default apiClient;

// 편의 함수: GET 요청
export const apiGet = <T = unknown>(url: string, config?: AxiosRequestConfig) => {
  return apiClient.get<T>(url, config);
};

// 편의 함수: POST 요청
export const apiPost = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
  return apiClient.post<T>(url, data, config);
};

// 편의 함수: PUT 요청
export const apiPut = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
  return apiClient.put<T>(url, data, config);
};

// 편의 함수: DELETE 요청
export const apiDelete = <T = unknown>(url: string, config?: AxiosRequestConfig) => {
  return apiClient.delete<T>(url, config);
};

