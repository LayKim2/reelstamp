// 인증 관련 Server Actions: 서버 사이드에서 실행되는 인증 로직
'use server';

import { cookies } from 'next/headers';
import { webApiClient } from '@/app/lib/api/client';
import { WebApiResponse, LoginResponseData } from '@/app/lib/api/auth';

/**
 * 소셜 액세스 토큰으로 로그인하고 httpOnly 쿠키에 토큰을 저장합니다.
 * @param accessToken 소셜 서비스(카카오/네이버)에서 발급받은 액세스 토큰
 * @param provider 소셜 서비스 제공자 ('KAKAO' | 'NAVER')
 */
export async function loginWithSocialAction(
  accessToken: string,
  provider: 'KAKAO' | 'NAVER'
): Promise<{ success: boolean; message: string; userInfo?: any }> {
  try {
    const response = await webApiClient.post<WebApiResponse<LoginResponseData>>(
      '/api/auth/login',
      {
        accessToken: accessToken,
        provider: provider,
      }
    );

    const { tokenInfo, userInfo } = response.data.data;
    const cookieStore = await cookies();

    cookieStore.set('accessToken', tokenInfo.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenInfo.expiresIn,
      path: '/',
    });

    cookieStore.set('refreshToken', tokenInfo.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return {
      success: true,
      message: '로그인 성공',
      userInfo: userInfo,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      '로그인 처리 중 오류가 발생했습니다.';

    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * [DEPRECATED] 카카오 액세스 토큰으로 로그인합니다.
 * loginWithSocialAction(token, 'KAKAO') 사용을 권장합니다.
 */
export async function loginWithKakaoAction(
  kakaoAccessToken: string
): Promise<{ success: boolean; message: string; userInfo?: any }> {
  return loginWithSocialAction(kakaoAccessToken, 'KAKAO');
}

/**
 * 로그아웃 처리: Spring API 호출 후 쿠키에서 토큰 제거
 */
export async function logoutAction(): Promise<{ success: boolean; message: string }> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // Spring API에 로그아웃 요청
    if (refreshToken) {
      try {
        await webApiClient.post('/api/auth/logout', null, {
          headers: {
            'X-Refresh-Token': refreshToken,
          },
        });
      } catch (error) {
        // API 호출 실패해도 쿠키는 삭제
      }
    }

    // 쿠키에서 토큰 제거
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    
    return { success: true, message: '로그아웃 완료' };
  } catch (error) {
    return { success: false, message: '로그아웃 처리 중 오류가 발생했습니다.' };
  }
}

/**
 * 회원탈퇴: 현재 사용자 계정을 삭제합니다.
 */
export async function deleteAccountAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { getServerApiClient } = await import('@/app/lib/api/server-client');
    const apiClient = await getServerApiClient();
    
    await apiClient.delete('/api/user/me');
    
    // 계정 삭제 성공 시 쿠키에서 토큰 제거
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    
    return {
      success: true,
      message: '계정이 삭제되었습니다.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '계정 삭제 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 구독 상태 조회: 현재 사용자의 구독 정보를 가져옵니다.
 */
export async function getSubscriptionStatusAction(): Promise<{
  success: boolean;
  data?: {
    status: string;
    active: boolean;
    currentPeriodStart: string;
    nextBillingDate: string;
    validUntil: string;
    canceledAt?: string;
  };
  message?: string;
}> {
  try {
    console.log('[getSubscriptionStatusAction] 구독 상태 조회 시작');
    const { getServerApiClient } = await import('@/app/lib/api/server-client');
    const apiClient = await getServerApiClient();
    
    console.log('[getSubscriptionStatusAction] API 클라이언트 생성 완료, 요청 전송 중...');
    const response = await apiClient.get<WebApiResponse<{
      status: string;
      active: boolean;
      currentPeriodStart: string;
      nextBillingDate: string;
      validUntil: string;
      canceledAt?: string;
    }>>('/api/subscription/status');

    console.log('[getSubscriptionStatusAction] API 응답:', {
      success: response.data.success,
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
    });

    if (response.data.success && response.data.data) {
      console.log('[getSubscriptionStatusAction] 구독 상태 조회 성공:', {
        active: response.data.data.active,
        status: response.data.data.status,
        validUntil: response.data.data.validUntil,
      });
      return {
        success: true,
        data: response.data.data,
      };
    }

    console.log('[getSubscriptionStatusAction] 구독 정보를 가져올 수 없음');
    return {
      success: false,
      message: '구독 정보를 가져올 수 없습니다.',
    };
  } catch (error: any) {
    console.error('[getSubscriptionStatusAction] 에러 발생:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    return {
      success: false,
      message: error.response?.data?.message || '구독 정보 조회 중 오류가 발생했습니다.',
    };
  }
}

