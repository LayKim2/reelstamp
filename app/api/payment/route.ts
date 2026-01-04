// 페이앱 결제 웹훅 수신 API: 결제 완료 시 페이앱에서 호출하는 엔드포인트
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 페이앱에서 전송한 웹훅 데이터 파싱
    const body = await request.json();
    
    console.log('[Payment Webhook] Received:', {
      timestamp: new Date().toISOString(),
      data: body,
    });

    // TODO: 페이앱 시그니처 검증 (페이앱 문서 확인 필요)
    // const signature = request.headers.get('x-payapp-signature');
    // if (!verifySignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    // 결제 정보 추출 (페이앱이 보내는 실제 필드명은 문서 확인 필요)
    const {
      paymentId,
      orderId,
      amount,
      status,
      userId,
      productId,
      timestamp,
      // ... 기타 페이앱이 전송하는 필드들
    } = body;

    // 결제 성공 처리
    if (status === 'success' || status === 'paid' || status === 'completed') {
      // TODO: 결제 정보를 DB에 저장
      // await savePaymentToDatabase({
      //   paymentId,
      //   orderId,
      //   amount,
      //   userId,
      //   productId,
      //   timestamp,
      // });

      // TODO: 결제 성공 시 비즈니스 로직 처리
      // 예: 사용자에게 서비스 제공, 알림 발송 등
      // await processPaymentSuccess(paymentId, userId);

      console.log('[Payment Webhook] Payment successful:', {
        paymentId,
        orderId,
        amount,
        userId,
      });
    } else {
      console.warn('[Payment Webhook] Payment failed or pending:', {
        paymentId,
        status,
      });
    }

    // 페이앱에 성공 응답 반환 (200 OK)
    return NextResponse.json(
      { success: true, message: 'Webhook received' },
      { status: 200 }
    );

  } catch (error) {
    console.error('[Payment Webhook] Error:', error);
    
    // 에러 발생 시에도 200 응답 (페이앱이 재시도하지 않도록)
    // 또는 500 응답으로 재시도 유도 (페이앱 정책에 따라)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 200 }
    );
  }
}

// GET 요청도 처리 (웹훅 URL 검증용)
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Payment webhook endpoint is active' },
    { status: 200 }
  );
}

