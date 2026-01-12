// 서버 사이드 API 클라이언트: httpOnly 쿠키에서 토큰을 자동으로 추출하여 API 요청에 포함
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { API_CONFIG } from '@/app/lib/constants/api';
import { WebApiResponse, TokenInfo } from '@/app/lib/api/auth';
import { setupInterceptors } from '@/app/lib/api/client';

/**
 * 토큰 갱신 함수: refresh token을 사용하여 새로운 access token 발급
 * 
 * API 응답 구조:
 * {
 *   "success": true,
 *   "status": 0,
 *   "message": "string",
 *   "errorCode": "string",
 *   "data": {
 *     "accessToken": "string",
 *     "refreshToken": "string",
 *     "tokenType": "string",
 *     "expiresIn": 0
 *   }
 * }
 */
async function refreshAccessToken(refreshToken: string): Promise<TokenInfo | null> {
  try {
    const response = await axios.post<WebApiResponse<{
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      expiresIn: number;
    }>>(
      `${API_CONFIG.WEB_BASE_URL}/api/auth/token/refresh`,
      null,
      {
        headers: {
          'X-Refresh-Token': refreshToken,
          'Content-Type': 'application/json',
        },
        timeout: API_CONFIG.TIMEOUT,
      }
    );

    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken: newRefreshToken, tokenType, expiresIn } = response.data.data;
      return {
        accessToken,
        refreshToken: newRefreshToken,
        tokenType,
        expiresIn,
      };
    }
    return null;
  } catch (error) {
    console.error('[refreshAccessToken] 토큰 갱신 실패:', error);
    return null;
  }
}

/**
 * 서버 사이드에서 사용할 API 클라이언트를 생성합니다.
 * httpOnly 쿠키에서 accessToken을 자동으로 추출하여 Authorization 헤더에 추가합니다.
 * access token 만료 시 자동으로 refresh token으로 갱신합니다.
 */
export async function getServerApiClient(): Promise<AxiosInstance> {
  const client = axios.create({
    baseURL: API_CONFIG.WEB_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;
        
        // 모든 쿠키 목록 확인
        const allCookies = cookieStore.getAll().map(c => c.name);
        
        console.log('[getServerApiClient] 요청 인터셉터 - 쿠키 확인', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          accessTokenLength: accessToken?.length,
          refreshTokenLength: refreshToken?.length,
          allCookies: allCookies,
          url: config.url
        });

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          console.warn('[getServerApiClient] Access token이 쿠키에 없음', {
            hasRefreshToken: !!refreshToken,
            allCookies: allCookies,
            url: config.url
          });
        }
      } catch (error) {
        // 토큰 추출 실패 시 무시하고 진행
        console.error('[getServerApiClient] 쿠키 읽기 실패', error);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터: 401 에러 시 토큰 갱신
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // 401 Unauthorized 에러이고, 아직 재시도하지 않은 요청인 경우
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // 이미 토큰 갱신 중이면 대기
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return client(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const cookieStore = await cookies();
          const accessToken = cookieStore.get('accessToken')?.value;
          const refreshToken = cookieStore.get('refreshToken')?.value;
          
          // 모든 쿠키 목록 확인
          const allCookies = cookieStore.getAll().map(c => c.name);

          console.log('[getServerApiClient] 토큰 갱신 시도', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            accessTokenLength: accessToken?.length,
            refreshTokenLength: refreshToken?.length,
            allCookies: allCookies
          });

          if (!refreshToken) {
            console.error('[getServerApiClient] Refresh token이 쿠키에 없음', {
              allCookies: allCookies,
              url: originalRequest.url
            });
            throw new Error('Refresh token이 없습니다.');
          }

          // 토큰 갱신 요청
          const newTokenInfo = await refreshAccessToken(refreshToken);

          if (!newTokenInfo) {
            throw new Error('토큰 갱신 실패');
          }

          // 새 토큰을 쿠키에 저장
          // HTTPS인 경우에만 secure: true 설정 (HTTP에서도 작동하도록)
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
          const isSecure = baseUrl.startsWith('https://');
          
          console.log('[getServerApiClient] 토큰 갱신 후 쿠키 저장', {
            hasNewToken: !!newTokenInfo.accessToken,
            hasNewRefreshToken: !!newTokenInfo.refreshToken,
            baseUrl: baseUrl,
            isSecure: isSecure
          });
          
          cookieStore.set('accessToken', newTokenInfo.accessToken, {
            httpOnly: true,
            secure: isSecure,
            sameSite: 'lax',
            maxAge: newTokenInfo.expiresIn,
            path: '/',
          });

          if (newTokenInfo.refreshToken) {
            cookieStore.set('refreshToken', newTokenInfo.refreshToken, {
              httpOnly: true,
              secure: isSecure,
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7,
              path: '/',
            });
          }
          
          // 쿠키 저장 후 확인
          const savedAccessToken = cookieStore.get('accessToken')?.value;
          const savedRefreshToken = cookieStore.get('refreshToken')?.value;
          
          console.log('[getServerApiClient] 쿠키 저장 완료 확인', {
            hasSavedAccessToken: !!savedAccessToken,
            hasSavedRefreshToken: !!savedRefreshToken,
            savedAccessTokenLength: savedAccessToken?.length,
            savedRefreshTokenLength: savedRefreshToken?.length
          });

          // 대기 중인 요청들 처리
          processQueue(null, newTokenInfo.accessToken);

          // 원래 요청 재시도
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokenInfo.accessToken}`;
          }
          return client(originalRequest);
        } catch (refreshError) {
          // 토큰 갱신 실패: 로그아웃 처리
          processQueue(refreshError, null);
          
          // 쿠키 삭제
          try {
            const cookieStore = await cookies();
            cookieStore.delete('accessToken');
            cookieStore.delete('refreshToken');
          } catch (e) {
            // 쿠키 삭제 실패 무시
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * 서버 사이드에서 사용할 AI API 클라이언트를 생성합니다. (8083 포트)
 * httpOnly 쿠키에서 accessToken을 자동으로 추출하여 Authorization 헤더에 추가합니다.
 * access token 만료 시 자동으로 refresh token으로 갱신합니다.
 */
export async function getServerAiApiClient(): Promise<AxiosInstance> {
  const client = axios.create({
    baseURL: API_CONFIG.AI_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
  });

  // 공통 인터셉터 설정 (로깅 등)
  setupInterceptors(client, 'Server AI API');

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        // 토큰 추출 실패 시 무시하고 진행
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터: 401 에러 시 토큰 갱신
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // 401 Unauthorized 에러이고, 아직 재시도하지 않은 요청인 경우
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // 이미 토큰 갱신 중이면 대기
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return client(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const cookieStore = await cookies();
          const refreshToken = cookieStore.get('refreshToken')?.value;

          if (!refreshToken) {
            throw new Error('Refresh token이 없습니다.');
          }

          // 토큰 갱신 요청
          const newTokenInfo = await refreshAccessToken(refreshToken);

          if (!newTokenInfo) {
            throw new Error('토큰 갱신 실패');
          }

          // 새 토큰을 쿠키에 저장
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
          const isSecure = baseUrl.startsWith('https://');

          cookieStore.set('accessToken', newTokenInfo.accessToken, {
            httpOnly: true,
            secure: isSecure,
            sameSite: 'lax',
            maxAge: newTokenInfo.expiresIn,
            path: '/',
          });

          if (newTokenInfo.refreshToken) {
            cookieStore.set('refreshToken', newTokenInfo.refreshToken, {
              httpOnly: true,
              secure: isSecure,
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7,
              path: '/',
            });
          }

          // 대기 중인 요청들 처리
          processQueue(null, newTokenInfo.accessToken);

          // 원래 요청 재시도
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokenInfo.accessToken}`;
          }
          return client(originalRequest);
        } catch (refreshError) {
          // 토큰 갱신 실패: 로그아웃 처리
          processQueue(refreshError, null);

          // 쿠키 삭제
          try {
            const cookieStore = await cookies();
            cookieStore.delete('accessToken');
            cookieStore.delete('refreshToken');
          } catch (e) {
            // 쿠키 삭제 실패 무시
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

