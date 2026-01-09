// 빌링 시작 API: 내부 API 서버로 빌링 정보 전송
import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/app/lib/constants/api';
import axios from 'axios';

/**
 * 빌링 시작 API
 * PayApp에서 받은 빌링 정보를 내부 API 서버로 전송합니다.
 * 
 * 요청 바디:
 * - userId: 사용자 ID
 * - billingKey: PayApp 정기결제 등록번호 (rebill_no)
 * - planCode: 플랜 코드 (basic, pro, master)
 * - orderId: 주문 ID (mul_no)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 요청 바디 파싱
    const body = await request.json();
    const { userId, billingKey, planCode, orderId } = body;

    // 2. 필수 필드 검증
    if (!userId || !billingKey || !planCode || !orderId) {
      return NextResponse.json(
        {
          success: false,
          message: '필수 필드가 누락되었습니다. (userId, billingKey, planCode, orderId)',
        },
        { status: 400 }
      );
    }

    // 3. 환경변수 확인
    const internalSecret = process.env.X_INTERNAL_SECRET;
    if (!internalSecret) {
      console.error('[Billing Start Error] X_INTERNAL_SECRET 환경변수가 설정되지 않았습니다.');
      return NextResponse.json(
        {
          success: false,
          message: '서버 설정 오류가 발생했습니다.',
        },
        { status: 500 }
      );
    }

    // 4. 내부 API 서버로 요청 전송
    const response = await axios.post(
      `${API_CONFIG.WEB_BASE_URL}/api/billing/start`,
      {
        userId: Number(userId),
        billingKey,
        planCode,
        orderId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Secret': internalSecret,
        },
        timeout: API_CONFIG.TIMEOUT,
      }
    );

    // 5. 성공 응답 반환
    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error('[Billing Start API Error]', error);

    // Axios 에러 처리
    if (error.response) {
      // 내부 API 서버에서 에러 응답을 받은 경우
      return NextResponse.json(
        {
          success: false,
          message: error.response.data?.message || '빌링 시작 처리 중 오류가 발생했습니다.',
          error: error.response.data,
        },
        { status: error.response.status || 500 }
      );
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      return NextResponse.json(
        {
          success: false,
          message: '내부 API 서버와 통신 중 오류가 발생했습니다.',
        },
        { status: 500 }
      );
    } else {
      // 요청 설정 중 오류가 발생한 경우
      return NextResponse.json(
        {
          success: false,
          message: '빌링 시작 요청 처리 중 오류가 발생했습니다.',
        },
        { status: 500 }
      );
    }
  }
}
