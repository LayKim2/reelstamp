import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/app/lib/constants/api';
import axios from 'axios';
import { cancelPayAppRecurring } from '@/app/lib/api/payapp';

// PayApp 빌링 상태 상수
const BILLING_STATUS = {
  PAID: 'paid',
  CANCELED: 'canceled',
} as const;

// 구독 상태 상수
const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  CANCELED: 'CANCELED',
} as const;

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
    const payload: Record<string, string> = {};
    
    // formData를 안전하게 객체로 변환 (값이 문자열인지 확인)
    for (const [key, value] of formData.entries()) {
      payload[key] = typeof value === 'string' ? value : value.toString();
    }

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

    // 2. 판매자 아이디 검증 (보안)
    if (userid !== process.env.PAYAPP_USERID) {
      console.warn('[PayApp Webhook] Unauthorized Merchant ID:', userid);
      return new NextResponse('INVALID_MERCHANT', { status: 400 });
    }

    // 3. 결제 상태 업데이트 처리
    // - 4: 결제완료 (구독 활성화) -> paid
    // - 9, 64: 결제취소/환불 (구독 즉시 중지) -> canceled
    // 기타 상태 코드는 로그로 기록하여 확인
    const validStates = ['4', '9', '64'];

    if (validStates.includes(state)) {
      // PayApp 상태 코드를 내부 상태로 변환
      // 4: 결제완료 -> paid
      // 9, 64: 결제취소/환불 -> canceled
      const status = state === '4' ? BILLING_STATUS.PAID : BILLING_STATUS.CANCELED;

      // 빌링 상태 저장 API 호출 (내부 DB에 저장)
      // 내부 백엔드 API 서버로 직접 전송 (X-Internal-Secret 헤더 포함)
      try {
        // PayApp에서 추가로 제공할 수 있는 카드 정보 (있으면 사용, 없으면 null)
        const cardName = payload.card_name || payload.cardname || null;
        const cardNumberMasked = payload.card_num || payload.card_no || payload.cardnumber || null;

        // 환경변수 확인
        const internalSecret = process.env.X_INTERNAL_SECRET;
        if (!internalSecret) {
          console.error('[PayApp Webhook] X_INTERNAL_SECRET 환경변수가 설정되지 않았습니다.');
          throw new Error('X_INTERNAL_SECRET 환경변수가 설정되지 않았습니다.');
        }

        // 요청 데이터 준비
        const requestBody = {
          userId: Number(userId),
          orderId: String(internalOrderId),
          status: status,
          paymentNo: String(mul_no),
          price: Number(price),
          cardName: cardName,
          cardNumberMasked: cardNumberMasked,
          pgStatusCode: Number(state),
        };

        // 내부 API 서버로 요청 전송
        const response = await axios.post(
          `${API_CONFIG.WEB_BASE_URL}/api/billing/status`,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Internal-Secret': internalSecret,
            },
            timeout: API_CONFIG.TIMEOUT,
          }
        );

        // 구독 상태 업데이트 API 호출
        try {
          const subscriptionStatus = status === BILLING_STATUS.PAID ? SUBSCRIPTION_STATUS.ACTIVE : SUBSCRIPTION_STATUS.CANCELED;
          
          const subscriptionRequestBody: any = {
            userId: Number(userId),
            status: subscriptionStatus,
          };
          
          // ACTIVE일 때만 planCode 포함, CANCELED일 때는 빈값
          if (subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE) {
            const planCode = response.data?.data?.planCode || 'basic'; // 내부 API 응답에서 planCode 가져오기, 없으면 기본값
            subscriptionRequestBody.planCode = planCode;
          } else {
            // CANCELED일 때는 planCode를 빈값으로 설정 (또는 포함하지 않음)
            subscriptionRequestBody.planCode = '';
          }

          await axios.post(
            `${API_CONFIG.WEB_BASE_URL}/api/subscription/status`,
            subscriptionRequestBody,
            {
              headers: {
                'Content-Type': 'application/json',
                'X-Internal-Secret': internalSecret,
              },
              timeout: API_CONFIG.TIMEOUT,
            }
          );
          
          console.log('[PayApp Webhook] 구독 상태 업데이트 성공:', {
            status: subscriptionStatus,
            planCode: subscriptionRequestBody.planCode || undefined,
          });
        } catch (subscriptionError: any) {
          console.error('[PayApp Webhook] 구독 상태 업데이트 실패:', {
            message: subscriptionError.message,
            status: subscriptionError.response?.status,
            data: subscriptionError.response?.data,
          });
          // 구독 상태 업데이트 실패해도 웹훅은 성공으로 응답 (나중에 수동 처리 가능)
        }

        // 새로운 결제가 성공적으로 저장된 후, 기존 활성 구독이 있으면 자동 해지
        // 내부 API 응답에서 기존 구독 정보를 받아서 처리
        if (status === BILLING_STATUS.PAID && response.data?.data) {
          const billingData = response.data.data;
          const previousBillingKey = billingData.previousBillingKey; // 내부 API에서 기존 구독 정보 반환 가정
          const previousOrderId = billingData.previousOrderId; // 기존 구독의 orderId

          if (previousBillingKey && previousBillingKey !== rebill_no) {
            // 기존 구독이 있고 새로운 구독과 다르면 해지
            try {
              const merchantId = process.env.PAYAPP_USERID;
              const apiKey = process.env.PAYAPP_LINKKEY;

              if (merchantId && apiKey) {
                const cancelResponse = await cancelPayAppRecurring({
                  userid: merchantId,
                  linkkey: apiKey,
                  rebill_no: previousBillingKey,
                });

                if (cancelResponse.state === '1') {
                  console.log('[PayApp Webhook] 기존 구독 자동 해지 성공:', previousBillingKey);
                  
                  // PayApp 해지 성공 후 내부 API에 canceled 상태로 업데이트
                  if (previousOrderId) {
                    try {
                      await axios.post(
                        `${API_CONFIG.WEB_BASE_URL}/api/billing/status`,
                        {
                          userId: Number(userId),
                          orderId: String(previousOrderId),
                          status: BILLING_STATUS.CANCELED,
                          paymentNo: String(mul_no), // 현재 결제 번호 사용 (또는 기존 결제 번호)
                          price: 0, // 해지는 금액 없음
                          cardName: null,
                          cardNumberMasked: null,
                          pgStatusCode: 64, // PayApp 취소 상태 코드
                        },
                        {
                          headers: {
                            'Content-Type': 'application/json',
                            'X-Internal-Secret': internalSecret,
                          },
                          timeout: API_CONFIG.TIMEOUT,
                        }
                      );
                      console.log('[PayApp Webhook] 기존 구독 canceled 상태 업데이트 성공');

                      // 기존 구독 취소 시 구독 상태도 업데이트
                      try {
                        await axios.post(
                          `${API_CONFIG.WEB_BASE_URL}/api/subscription/status`,
                          {
                            userId: Number(userId),
                            status: SUBSCRIPTION_STATUS.CANCELED,
                          },
                          {
                            headers: {
                              'Content-Type': 'application/json',
                              'X-Internal-Secret': internalSecret,
                            },
                            timeout: API_CONFIG.TIMEOUT,
                          }
                        );
                        console.log('[PayApp Webhook] 기존 구독 CANCELED 상태 업데이트 성공');
                      } catch (subscriptionCancelError: any) {
                        console.error('[PayApp Webhook] 기존 구독 CANCELED 상태 업데이트 실패:', {
                          message: subscriptionCancelError.message,
                          status: subscriptionCancelError.response?.status,
                        });
                      }
                    } catch (updateError: any) {
                      console.error('[PayApp Webhook] 기존 구독 canceled 상태 업데이트 실패:', {
                        message: updateError.message,
                        status: updateError.response?.status,
                      });
                    }
                  }
                } else {
                  console.warn('[PayApp Webhook] 기존 구독 자동 해지 실패:', cancelResponse.errorMessage);
                }
              }
            } catch (cancelError: any) {
              console.error('[PayApp Webhook] 기존 구독 해지 중 오류:', cancelError.message);
              // 해지 실패해도 웹훅은 성공으로 응답 (나중에 수동 처리 가능)
            }
          }
        }
      } catch (updateError: any) {
        console.error('[PayApp Webhook] 빌링 상태 저장 API 호출 실패:', {
          message: updateError.message,
          url: updateError.config?.url,
          status: updateError.response?.status,
          data: updateError.response?.data,
        });
        // 웹훅은 실패해도 'OK'를 반환해야 PayApp이 재시도하지 않음
        // 하지만 로그는 남겨서 나중에 수동으로 처리할 수 있도록 함
      }
    } else {
      // 알 수 없는 상태 코드는 로그로 기록
      console.warn('[PayApp Webhook] 알 수 없는 결제 상태 코드:', {
        pay_state: state,
        userId,
        orderId: internalOrderId,
        payload: Object.keys(payload),
      });
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
