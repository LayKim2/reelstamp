import { NextRequest, NextResponse } from 'next/server';
import { createPayAppRecurringLink } from '@/app/lib/api/payapp';
import { getCurrentUser } from '@/app/lib/api/auth';

/**
 * PayApp 결제 요청 생성 API
 * 사용자가 선택한 플랜에 따른 결제 링크를 생성합니다.
 *
 * 결제 플로우 (프론트 기준):
 * 1) 사용자가 결제 버튼 클릭 → 이 API 호출
 * 2) PayApp 결제 링크 생성
 * 3) PayApp에서 응답으로 mul_no(주문/거래 ID) 반환
 * 4) TODO: mul_no 기준으로 내부 주문 레코드 생성 (status: PENDING)
 * 5) 프론트에 payurl 반환 → PayApp 결제 페이지로 이동
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

    // 2. 요청 바디 파싱
    const body = await request.json();
    const { planId, planName, price } = body;

    if (!planId || !planName || !price) {
      return NextResponse.json(
        { success: false, message: '플랜 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 3. PayApp 설정 로드
    const merchantId = process.env.PAYAPP_USERID;
    const apiKey = process.env.PAYAPP_LINKKEY;

    if (!merchantId || !apiKey) {
      console.error('[Payment Create Error] PayApp 설정이 누락되었습니다.');
      return NextResponse.json(
        { success: false, message: '결제 시스템 설정 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 4. 리다이렉트 URL 및 Webhook URL 설정
    // Vercel 배포 환경에서는 NEXT_PUBLIC_BASE_URL을 명시적으로 설정하는 것이 안전합니다.
    // 없으면 request에서 추출하되, 프로토콜은 https로 강제합니다.
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      const host = request.headers.get('host') || request.nextUrl.host;
      // Vercel 배포 환경에서는 항상 https를 사용
      const protocol = host.includes('vercel.app') || process.env.NODE_ENV === 'production' ? 'https' : request.nextUrl.protocol.replace(':', '');
      baseUrl = `${protocol}://${host}`;
    }
    
    console.log('[Base URL 설정]', {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      computedBaseUrl: baseUrl,
      requestHost: request.headers.get('host'),
      requestProtocol: request.nextUrl.protocol,
      nodeEnv: process.env.NODE_ENV,
    });

    // 5. PayApp 정기결제(Recurring) 등록 요청
    //    - cmd=rebillRegist 를 사용하여 최초 1회 결제 + 정기결제 등록번호(rebill_no)를 발급
    //    - 여기서는 월 구독을 가정하여 rebillCycleType='Month' 로 설정
    const today = new Date();
    const dayOfMonth = today.getDate(); // 매월 결제일 (1~31)

    // 1. 만료일 계산: 오늘로부터 1년 뒤 (예: 2027-01-07)
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    const rebillExpire = nextYear.toISOString().split('T')[0];

    // 2. 우리 시스템의 고유 주문번호 생성 (예: REEL-시간값)
    const internalOrderId = `REEL-${Date.now()}`;


    const payappResponse = await createPayAppRecurringLink({
      userid: merchantId,
      linkkey: apiKey,
      // 3. 상품명에 핵심 정보(매월 결제, 취소 가능)를 명시
      goodname: `릴스탬프 ${planName} (매월 ₩${price.toLocaleString()} / 언제든 취소 가능)`,
      goodprice: price,
      // recvphone: 구매자 휴대폰번호 (필수, 더미 값 전송, 결제창에서 구매자가 수정 가능)
      recvphone: '01000000000',
      // recvemail: 구매자 이메일 (로그인 시 받은 userInfo.email)
      recvemail: user.email,
      rebillCycleType: 'Month',
      rebillCycleMonth: String(dayOfMonth),
      rebillExpire: rebillExpire, // 1년 뒤 날짜 명시
      returnurl: `${baseUrl}/pricing/success`, // 결제 완료 후 브라우저가 돌아갈 페이지
      feedbackurl: `${baseUrl}/api/payment`, // 결제 완료 통보용 웹훅
      var1: String(user.id), // 임의값 1: 사용자 ID (userId)
      var2: internalOrderId, // 임의값 2: 우리 시스템 주문번호 (internalOrderId)
    });

    console.log('[PayApp Recurring Link Response]', {
      state: payappResponse.state,
      billingKey: payappResponse.billingKey,
      payurl: payappResponse.payurl,
      errorMessage: payappResponse.errorMessage,
    });

    if (payappResponse.state === '1' && payappResponse.payurl) {
      // rebillRegist 성공 시:
      // - payurl: 최초 결제/승인용 결제창 URL
      // - billingKey: PayApp 정기결제 등록번호 (rebill_no)
      const orderId = internalOrderId; // PayApp 주문 ID 또는 내부 주문 ID
      const billingKey = payappResponse.billingKey; // 정기결제용 등록번호(rebill_no)

      // 6. 내부 API 서버로 빌링 정보 전송
      try {
        const billingResponse = await fetch(`${baseUrl}/api/billing/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            billingKey,
            planCode: planId,
            orderId,
          }),
        });

        if (!billingResponse.ok) {
          const errorText = await billingResponse.text();
          console.error('[Billing Start Failed]', {
            status: billingResponse.status,
            body: errorText.substring(0, 500),
          });
          return NextResponse.json(
            {
              success: false,
              message: '결제 처리 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            },
            { status: 500 }
          );
        }

        const billingResult = await billingResponse.json();

        if (!billingResult.success) {
          console.error('[Billing Start Failed]', billingResult);
          return NextResponse.json(
            {
              success: false,
              message: billingResult.message || '결제 처리 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            },
            { status: 500 }
          );
        }

      } catch (billingError: any) {
        console.error('[Billing Start API Error]', billingError.message);
        return NextResponse.json(
          {
            success: false,
            message: '결제 처리 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        payurl: payappResponse.payurl,
        mul_no: orderId,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            payappResponse.errorMessage || '결제 링크 생성에 실패했습니다.',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('[Payment Create API Error]', {
      message: error?.message,
      stack: error?.stack,
      error: error,
      name: error?.name,
    });
    return NextResponse.json(
      {
        success: false,
        message: '결제 요청 처리 중 서버 오류가 발생했습니다.',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
