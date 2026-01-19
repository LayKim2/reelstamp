import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/api/auth';
import { API_CONFIG } from '@/app/lib/constants/api';
import axios from 'axios';

/**
 * 구독 해지 요청 API
 * 사용자가 "구독 해지" 버튼을 눌렀을 때 호출됩니다.
 *
 * 현재 버전:
 * - PayApp 정기결제 해지 연동은 추후 추가
 * - 내부 구독 상태만 CANCELED 로 업데이트
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 유저 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 내부 구독 상태 업데이트 API 호출
    const internalSecret = process.env.X_INTERNAL_SECRET;

    if (!internalSecret) {
      console.error('[Payment Cancel] X_INTERNAL_SECRET 환경변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { success: false, message: '구독 해지 처리 중 설정 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    try {
      await axios.post(
        `${API_CONFIG.WEB_BASE_URL}/api/subscription/status`,
        {
          userId: Number(user.id),
          status: 'CANCELED',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Internal-Secret': internalSecret,
          },
          timeout: API_CONFIG.TIMEOUT,
        }
      );

      return NextResponse.json({
        success: true,
        message:
          '구독 해지가 정상적으로 처리되었습니다. 이번 결제 주기 만료 시까지 서비스를 이용하실 수 있습니다.',
      });
    } catch (subscriptionError: any) {
      console.error('[Payment Cancel] 구독 상태 업데이트 실패:', {
        message: subscriptionError.message,
        status: subscriptionError.response?.status,
        data: subscriptionError.response?.data,
      });

      return NextResponse.json(
        {
          success: false,
          message: '구독 해지 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Payment Cancel API Error]', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

