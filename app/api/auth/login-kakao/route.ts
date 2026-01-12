// 카카오 로그인 Route Handler: Spring API 호출 후 httpOnly 쿠키에 토큰 저장
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { webApiClient } from '@/app/lib/api/client';
import { WebApiResponse, LoginResponseData } from '@/app/lib/api/auth';

export async function POST(request: NextRequest) {
  try {
    const { kakaoAccessToken } = await request.json();

    if (!kakaoAccessToken) {
      return NextResponse.json(
        { success: false, message: '카카오 액세스 토큰이 필요합니다.' },
        { status: 400 }
      );
    }

    const response = await webApiClient.post<WebApiResponse<LoginResponseData>>(
      '/api/auth/login',
      {
        accessToken: kakaoAccessToken,
        provider: 'KAKAO',
      }
    );

    const { tokenInfo, userInfo } = response.data.data;
    const cookieStore = await cookies();

    // HTTPS인 경우에만 secure: true 설정 (HTTP에서도 작동하도록)
    const isSecure = process.env.NEXT_PUBLIC_BASE_URL?.startsWith('https://') ?? false;

    cookieStore.set('accessToken', tokenInfo.accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: tokenInfo.expiresIn,
      path: '/',
    });

    cookieStore.set('refreshToken', tokenInfo.refreshToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: '로그인 성공',
      userInfo: userInfo,
    });
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      '로그인 처리 중 오류가 발생했습니다.';

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: error.response?.status || 500 }
    );
  }
}

