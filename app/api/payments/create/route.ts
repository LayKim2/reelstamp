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
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${request.nextUrl.protocol}//${request.nextUrl.host}`;

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
      // 3. 상품명에 핵심 정보(매월 결제, 취소 가능)를 명시
      goodname: `릴스탬프 ${planName} (매월 ₩${price.toLocaleString()} / 언제든 취소 가능)`,
      goodprice: price,
      // TODO: 실제 고객 휴대폰 번호 사용
      // - 현재는 테스트용 기본 번호 사용 중
      recvphone: '01059601017', // TO DO 
      rebillCycleType: 'Month',
      rebillCycleMonth: String(dayOfMonth),
      rebillExpire: rebillExpire, // 1년 뒤 날짜 명시
      returnurl: `${baseUrl}/pricing/success`, // 결제 완료 후 브라우저가 돌아갈 페이지
      feedbackurl: `${baseUrl}/api/payment`, // 결제 완료 통보용 웹훅
      var1: String(user.id), // 임의값 1: 사용자 ID (userId)
      var2: planId, // 임의값 2: 플랜 코드 (planId)
      var3: internalOrderId, // 임의값 3: 우리 시스템 주문번호 (orderId)
    });

    console.log('[PayApp Recurring Link Response]', {
      state: payappResponse.state,
      mul_no: payappResponse.mul_no,
      billingKey: payappResponse.billingKey,
      payurl: payappResponse.payurl,
      errorMessage: payappResponse.errorMessage
    });

    if (payappResponse.state === '1' && payappResponse.payurl) {
      // rebillRegist 성공 시:
      // - payurl: 최초 결제/승인용 결제창 URL
      // - billingKey: PayApp 정기결제 등록번호 (rebill_no)
      const orderId = payappResponse.mul_no; // 일부 케이스에서 내려올 수 있는 거래/주문 ID (없을 수도 있음)
      const billingKey = payappResponse.billingKey; // 정기결제용 등록번호(rebill_no)

      /**
       * TODO: 주문 레코드 생성 API 연동
       *
       * 요구사항:
       * 1. 결제 버튼을 눌렀을 때 정기결제 등록/구독 정보 저장
       * 2. rebillRegist 응답에서 받은 billingKey(rebill_no)를 구독 엔티티에 저장
       * 3. 저장 필드 예시:
       *    - subscriptionId: string
       *    - userId: string (user.id)
       *    - planId: string (planId)
       *    - amount: number (price)
       *    - billingKey: string | null (payappResponse.billingKey)
       *    - status: 'ACTIVE' | 'PENDING'
       *    - currentPeriodStart: Date
       *    - nextBillingDate: Date
       *
       * 구현 방식 제안:
       * - Web API 서버(8082)에 /api/subscription/subscribe (또는 /api/subscriptions) 엔드포인트를 두고,
       *   여기서는 getServerApiClient() + access token 으로 호출
       * - 이 라우트에서는 아직 해당 API가 없으므로 실제 호출은 나중에 구현
       */
      // 예시 코드 (실제 API 구현 후 주석 제거 예정)
      // const { getServerApiClient } = await import('@/app/lib/api/server-client');
      // const apiClient = await getServerApiClient();
      // await apiClient.post('/api/subscription/subscribe', {
      //   userId: user.id,
      //   planCode: planId,
      //   amount: price,
      //   billingKey,
      // });

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
  } catch (error) {
    console.error('[Payment Create API Error]', error);
    return NextResponse.json(
      {
        success: false,
        message: '결제 요청 처리 중 서버 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
