import { NextRequest, NextResponse } from 'next/server';

/**
 * PayApp 결제 결과 통보 (Webhook) 처리 API
 * 경로: /api/payment (사용자가 페이앱 관리자 페이지에 등록한 URL)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. PayApp에서 보낸 데이터 파싱 (x-www-form-urlencoded)
    // Next.js Route Handler에서는 formData()로 파싱 가능합니다.
    const formData = await request.formData();
    const payload = Object.fromEntries(formData);

    /**
     * 페이앱 주요 파라미터:
     * - userid: 판매자 아이디
     * - state: 결제 상태 (1: 성공)
     * - mul_no: 결제 고유번호
     * - price: 결제 금액
     * - var1: 결제 요청 시 넣었던 유저 ID (사용자 식별용)
     * - var2: 결제 요청 시 넣었던 플랜 ID (플랜 식별용)
     */
    const {
      userid,
      state,
      mul_no,
      price,
      var1: userId,
      var2: planId
    } = payload;

    // 2. 판매자 아이디 검증 (보안)
    if (userid !== process.env.PAYAPP_USERID) {
      console.warn('[PayApp Webhook] Unauthorized Merchant ID:', userid);
      return new NextResponse('INVALID_MERCHANT', { status: 400 });
    }

    // 3. 결제 성공(state === '1') 처리
    if (state === '1') {
      console.log(`[Payment Success] User: ${userId}, Plan: ${planId}, Amount: ${price}, Transaction: ${mul_no}`);
      
      // TODO: 이곳에서 실제 DB 업데이트(구독 활성화) 로직을 실행합니다.
      // 예: await activateUserSubscription(userId, planId);
    }

    // 4. 페이앱 서버에 응답 (중요: 반드시 'OK' 문자열을 평문으로 반환해야 함)
    return new NextResponse('OK', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    console.error('[PayApp Webhook Error]', error);
    // 에러 발생 시 페이앱이 나중에 다시 보낼 수 있도록 500 응답
    return new NextResponse('INTERNAL_ERROR', { status: 500 });
  }
}

