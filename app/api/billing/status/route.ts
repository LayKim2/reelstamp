// 빌링 상태 저장 API: 내부 API 서버로 빌링 상태 정보 전송
import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/app/lib/constants/api';
import axios from 'axios';

/**
 * 빌링 상태 저장 API
 * PayApp 웹훅에서 받은 결제 정보를 내부 API 서버로 전송하여 DB에 저장합니다.
 *
 * 요청 바디:
 * - userId: 사용자 ID
 * - orderId: 주문 ID
 * - status: 결제 상태 (pending, active, cancelled 등)
 * - paymentNo: PG사 결제 고유번호 (PayApp의 mul_no)
 * - price: 결제 금액
 * - cardName: 카드사명 (선택)
 * - cardNumberMasked: 마스킹된 카드번호 (선택)
 * - pgStatusCode: PG사 상태 코드 (PayApp의 pay_state)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 요청 바디 파싱
    const body = await request.json();
    const { userId, orderId, status, paymentNo, price, cardName, cardNumberMasked, pgStatusCode } = body;

    // 2. 필수 필드 검증
    if (!userId || !orderId || !status || !paymentNo || price === undefined || pgStatusCode === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: '필수 필드가 누락되었습니다. (userId, orderId, status, paymentNo, price, pgStatusCode)',
        },
        { status: 400 }
      );
    }

    // 3. 환경변수 확인
    const internalSecret = process.env.X_INTERNAL_SECRET;
    if (!internalSecret) {
      console.error('[Billing Status Error] X_INTERNAL_SECRET 환경변수가 설정되지 않았습니다.');
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
      `${API_CONFIG.WEB_BASE_URL}/api/billing/status`,
      {
        userId: Number(userId),
        orderId: String(orderId),
        status: String(status),
        paymentNo: String(paymentNo),
        price: Number(price),
        cardName: cardName || null,
        cardNumberMasked: cardNumberMasked || null,
        pgStatusCode: Number(pgStatusCode),
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
      status: response.data?.status || 0,
      message: response.data?.message || '빌링 상태가 성공적으로 저장되었습니다.',
      data: response.data?.data || response.data,
    });
  } catch (error: any) {
    console.error('[Billing Status API Error]', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Axios 에러 처리
    if (error.response) {
      return NextResponse.json(
        {
          success: false,
          status: error.response.data?.status || 0,
          message: error.response.data?.message || '빌링 상태 저장 중 오류가 발생했습니다.',
        },
        { status: error.response.status || 500 }
      );
    } else if (error.request) {
      return NextResponse.json(
        {
          success: false,
          status: 0,
          message: '내부 API 서버와 통신 중 오류가 발생했습니다.',
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          status: 0,
          message: '빌링 상태 저장 요청 처리 중 오류가 발생했습니다.',
        },
        { status: 500 }
      );
    }
  }
}
