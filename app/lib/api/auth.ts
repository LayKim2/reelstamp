import { webApiClient } from '@/app/lib/api/client';

export interface LoginRequest {
  accessToken: string;
  provider: 'KAKAO' | 'NAVER';
}

// Web API 실제 응답 구조
export interface WebApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserInfo {
  id: number;
  provider: 'KAKAO' | 'NAVER';
  providerUserId: string;
  email: string;
  nickname: string;
  socialNickname: string;
  profileImageUrl: string;
  role: string;
}

export interface LoginResponseData {
  tokenInfo: TokenInfo;
  userInfo: UserInfo;
}

export interface SubscriptionData {
  status: string;
  active: boolean;
  currentPeriodStart: string;
  nextBillingDate: string;
  validUntil: string;
  canceledAt?: string;
  billingKey?: string; // 추가
  orderId?: string;    // 추가
}

export interface SubscriptionStatusResponse {
  subscription: SubscriptionData;
  subscriptionPlan: {
    plan: string;
    name: string;
    description: string;
    textEnabled: boolean;
    videoEnabled: boolean;
    textSessionLimit: number;
    videoSessionLimit: number;
    revisionLimit: number;
    price: {
      fakePrice: number;
      regularPrice: number;
      openPrice: number;
    };
  };
  videoSessionUsage: {
    limit: number;
    used: number;
    remaining: number;
    unlimited: boolean;
  };
  textSessionUsage: {
    limit: number;
    used: number;
    remaining: number;
    unlimited: boolean;
  };
  revisionUsage: {
    limit: number;
    used: number;
    remaining: number;
    unlimited: boolean;
  };
}

export interface RefreshTokenResponse {
  tokenInfo: TokenInfo;
}

// 하위 호환성을 위한 간단한 인터페이스
export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
}

/**
 * 서버 사이드에서 현재 로그인한 유저 정보를 조회합니다.
 * httpOnly 쿠키의 accessToken을 사용하여 Spring API를 호출합니다.
 * access token 만료 시 getServerApiClient()에서 자동으로 refresh token으로 갱신합니다.
 */
export async function getCurrentUser(): Promise<UserInfo | null> {
  try {
    // 쿠키 확인
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    
    // access token이 없으면 null 반환
    if (!accessToken) {
      // refresh token은 있지만 access token이 없는 경우는 토큰 갱신 시도 가능
      // 하지만 여기서는 일단 null 반환 (getServerApiClient에서 처리)
      return null;
    }

    const { getServerApiClient } = await import('@/app/lib/api/server-client');
    const apiClient = await getServerApiClient();
    const response = await apiClient.get<WebApiResponse<UserInfo>>('/api/user/me');
    
    // 응답 구조 확인
    let userData: UserInfo | null = null;
    if (response.data && response.data.success && response.data.data) {
      userData = response.data.data;
    } else if (response.data && (response.data as any).data) {
      userData = (response.data as any).data;
    }
    
    
    return userData;
  } catch (error: any) {
    // 에러 로깅 (개발 환경에서 더 상세하게)
    const statusCode = error.response?.status;
    const errorMessage = error.message;
    
    // refresh token 갱신 실패로 인한 401 에러인 경우
    if (statusCode === 401) {
      console.warn('[getCurrentUser] 인증 실패 (토큰 만료 또는 refresh token 갱신 실패):', {
        message: errorMessage,
        status: statusCode,
        // refresh token 갱신 실패 시 쿠키가 이미 삭제되었을 수 있음
      });
    } else {
      // 다른 에러 (네트워크 오류 등)
      console.error('[getCurrentUser] API 호출 실패:', {
        message: errorMessage,
        status: statusCode,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }
    
    // 토큰이 없거나 만료된 경우 null 반환
    // getServerApiClient에서 refresh token 갱신을 시도했지만 실패한 경우도 포함
    return null;
  }
}

/**
 * [DEPRECATED] 카카오 액세스 토큰으로 Web API에 로그인을 요청합니다.
 * 
 * ⚠️ 보안 강화를 위해 이 함수 대신 Server Action을 사용하세요:
 * - 클라이언트: `loginWithKakaoAction` (app/actions/auth.ts)
 * - httpOnly 쿠키에 토큰이 자동으로 저장됩니다.
 * 
 * @deprecated Server Action 사용 권장
 * @param accessToken 카카오에서 발급받은 액세스 토큰
 */
export const loginWithKakao = async (accessToken: string): Promise<WebApiResponse<LoginResponseData>> => {
  const response = await webApiClient.post<WebApiResponse<LoginResponseData>>('/api/auth/login', {
    accessToken,
    provider: 'KAKAO',
  });
  return response.data;
};

