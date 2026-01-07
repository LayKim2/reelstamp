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
     * - var2: 결제 요청 시 넣었던 플랜 ID (플랜 식별용)
     * - var3: 결제 요청 시 넣었던 주문 ID (우리 시스템 주문번호)
     * - rebill_no: 정기결제 등록번호 (billingKey)
     */
    const {
      userid,
      state,
      mul_no,
      price,
      var1: userId,
      var2: planId,
      var3: internalOrderId,
      rebill_no,
    } = payload;

    console.log('[PayApp Webhook Key Data]', {
      userId,
      planId,
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

    const orderId = String(mul_no);

    /**
     * TODO: 주문 상태 검증/업데이트 API 연동
     *
     * 요구사항:
     * 2) 결제 완료 후 API 처리
     *   0) access token 사용 X
     *   1) X-Internal-Secret 사용
     *   2) order id, status 체크
     *
     * 구현 아이디어:
     * - Web API 서버(8082)에 내부용 엔드포인트 예: /internal/orders/payapp-callback
     * - 헤더에 X-Internal-Secret 포함 (access token 사용 X)
     * - body 예시:
     *   {
     *     orderId: string;        // mul_no
     *     state: string;          // PayApp state (1: 성공 등)
     *     amount: number;         // price
     *     userId: string;         // var1
     *     planId: string;         // var2
     *   }
     *
     * 내부 API에서 할 일:
     * - orderId 로 주문 레코드 조회
     * - 현재 status 가 PENDING 인지 확인
     * - state === '1' 이면 PAID 로 업데이트, 아니면 FAILED 등으로 처리
     * - 필요 시 구독 활성화까지 같이 처리하거나,
     *   아래의 /api/subscription/subscribe 호출을 내부에서 수행해도 됨
     */
    // 예시 코드 (실제 엔드포인트 구현 후 사용)
    // try {
    //   const internalSecret = process.env.INTERNAL_API_SECRET;
    //   if (!internalSecret) {
    //     console.error('[PayApp Webhook] INTERNAL_API_SECRET이 설정되지 않았습니다.');
    //   } else {
    //     await axios.post(
    //       `${API_CONFIG.WEB_BASE_URL}/internal/orders/payapp-callback`,
    //       {
    //         orderId,
    //         state,
    //         amount: price,
    //         userId,
    //         planId,
    //       },
    //       {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'X-Internal-Secret': internalSecret,
    //         },
    //         timeout: 10000,
    //       }
    //     );
    //   }
    // } catch (orderError: any) {
    //   console.error('[PayApp Webhook] 주문 상태 업데이트 실패:', {
    //     orderId,
    //     error: orderError.message,
    //     status: orderError.response?.status,
    //     data: orderError.response?.data,
    //   });
    //   // 주문 업데이트 실패 시에도 PayApp에는 OK를 반환해야
    //   // 중복 청구를 막을 수 있으므로 여기서는 로그만 남긴다.
    // }

    // 3. 결제 성공(state === '1') 처리
    if (state === '1') {
      console.log(
        `[Payment Success] User: ${userId}, Plan: ${planId}, Amount: ${price}, Transaction(orderId): ${orderId}`
      );

      // 구독 활성화 API 호출 (access token 사용 X, X-Internal-Secret 사용)
      try {
        console.log('[PayApp Webhook Test] 구독 활성화 시뮬레이션:', {
          userId,
          planCode: planId,
          orderId: internalOrderId,
          payappOrderId: mul_no,
          billingKey: rebill_no,
        });
        /*
        const internalSecret = process.env.INTERNAL_API_SECRET;
        if (!internalSecret) {
          console.error(
            '[PayApp Webhook] INTERNAL_API_SECRET이 설정되지 않았습니다.'
          );
          // 환경변수 누락은 내부 오류이지만, 페이앱에는 OK를 반환하여 중복 호출을 막는다.
        } else {
          const subscribeResponse = await axios.post(
            `${API_CONFIG.WEB_BASE_URL}/api/subscription/subscribe`,
            {
              userId: userId, // var1
              planCode: planId, // var2
              orderId: internalOrderId, // var3 (우리 시스템 주문번호)
              payappOrderId: mul_no, // 페이앱 영수증 번호 (환불 등 관리용)
              billingKey: rebill_no, // 정기결제 등록번호
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-Internal-Secret': internalSecret,
              },
              timeout: 10000,
            }
          );

          if (subscribeResponse.data?.success) {
            console.log('[PayApp Webhook] 구독 활성화 성공:', {
              userId,
              planCode: planId,
              subscriptionData: subscribeResponse.data.data,
            });
          } else {
            console.warn('[PayApp Webhook] 구독 활성화 실패:', {
              userId,
              planCode: planId,
              response: subscribeResponse.data,
            });
          }
        }
        */
      } catch (subscribeError: any) {
        // 구독 활성화 실패는 로그만 남기고 페이앱에는 OK 반환 (재시도/중복 결제 방지를 위함)
        console.error('[PayApp Webhook] 구독 활성화 API 호출 실패:', {
          userId,
          planCode: planId,
          error: subscribeError.message,
          status: subscribeError.response?.status,
          data: subscribeError.response?.data,
        });
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
