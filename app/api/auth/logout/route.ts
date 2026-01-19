// 로그아웃 Route Handler: Spring API 호출 후 httpOnly 쿠키에서 토큰 제거
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { webApiClient } from '@/app/lib/api/client';

export async function POST(request: NextRequest) {
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
    cookieStore.delete('providerAccessToken');

    return NextResponse.json({
      success: true,
      message: '로그아웃 완료',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: '로그아웃 처리 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

