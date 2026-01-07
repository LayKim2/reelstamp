import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/app/lib/constants/api';
import axios from 'axios';

/**
 * PayApp 결제 결과 통보 (Webhook) 처리 API
 * 경로: /api/payment (사용자가 페이앱 관리자 페이지에 등록한 URL)
 *
 * 웹훅 특성상:
 * - 브라우저/세션 정보는 없고, PayApp → 서버 간 통신만 처리
 * - 어떤 브라우저를 새로고침할지 알 수 없으므로, 여기서는
 *   순수하게 "서버 상태(주문/구독)"만 업데이트한다.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. PayApp에서 보낸 데이터 파싱 (x-www-form-urlencoded)
    // Next.js Route Handler에서는 formData()로 파싱 가능합니다.
    const formData = await request.formData();
    const payload = Object.fromEntries(formData);

    console.log('[PayApp Webhook Payload Received]', payload);

    /**
     * 페이앱 주요 파라미터:
     * - userid: 판매자 아이디
     * - state: 결제 상태 (1: 성공)
     * - mul_no: 결제 고유번호 (orderId 로 사용)
     * - price: 결제 금액
     * - var1: 결제 요청 시 넣었던 유저 ID (사용자 식별용)
     * - var2: 결제 요청 시 넣었던 주문 ID (우리 시스템 주문번호)
     * - rebill_no: 정기결제 등록번호 (billingKey)
     */
    const {
      userid,
      pay_state,
      mul_no,
      price,
      var1: userId,
      var2: internalOrderId,
      rebill_no,
    } = payload;

    const state = String(pay_state);

    console.log('[PayApp Webhook Key Data]', {
      userId,
      orderId: internalOrderId,
      payappOrderId: mul_no,
      state,
      billingKey: rebill_no,
    });

    // 2. 판매자 아이디 검증 (보안)
    if (userid !== process.env.PAYAPP_USERID) {
      console.warn('[PayApp Webhook] Unauthorized Merchant ID:', userid);
      return new NextResponse('INVALID_MERCHANT', { status: 400 });
    }

    // 3. 결제 상태 업데이트 처리
    // - 4: 결제완료 (구독 활성화)
    // - 64: 결제취소/환불 (구독 즉시 중지)
    const validStates = ['4', '64'];

    if (validStates.includes(state)) {
      const status = state === '4' ? 'ACTIVE' : 'CANCELLED';

      console.log(
        `[Payment Update] User: ${userId}, OrderId: ${internalOrderId}, Status: ${status}, Transaction(mul_no): ${mul_no}`
      );

      // 구독 상태 업데이트 API 호출 (access token 사용 X, X-Internal-Secret 사용)
      try {
        console.log('[PayApp Webhook Update] 내부 API 업데이트 시뮬레이션:', {
          userId,
          orderId: internalOrderId,
          status,
          payappOrderId: mul_no,
          billingKey: rebill_no,
        });
        /*
        const internalSecret = process.env.INTERNAL_API_SECRET;
        if (internalSecret) {
          await axios.post(
            `${API_CONFIG.WEB_BASE_URL}/api/subscription/update-status`,
            {
              userId: userId,
              orderId: internalOrderId,
              status: status,
              payappOrderId: mul_no,
              billingKey: rebill_no,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-Internal-Secret': internalSecret,
              },
              timeout: 10000,
            }
          );
        }
        */
      } catch (updateError: any) {
        console.error('[PayApp Webhook] 업데이트 API 호출 실패:', updateError.message);
      }
    }

    // 4. 페이앱 서버에 응답 (중요: 반드시 'OK' 문자열을 평문으로 반환해야 함)
    return new NextResponse('OK', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('[PayApp Webhook Error]', error);
    // 에러 발생 시 페이앱이 나중에 다시 보낼 수 있도록 500 응답
    return new NextResponse('INTERNAL_ERROR', { status: 500 });
  }
}
