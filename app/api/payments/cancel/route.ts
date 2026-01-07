import { NextRequest, NextResponse } from 'next/server';
import { cancelPayAppRecurring } from '@/app/lib/api/payapp';
import { getCurrentUser } from '@/app/lib/api/auth';
import { API_CONFIG } from '@/app/lib/constants/api';
import axios from 'axios';

/**
 * 구독 해지 요청 API
 * 사용자가 "구독 해지" 버튼을 눌렀을 때 호출됩니다.
 * 정책: 즉시 환불이 아닌, 다음 결제 주기부터 중단 (해지 예약)
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

    // 2. 요청 데이터 파싱 (해지할 빌링키와 내부 주문번호)
    const body = await request.json();
    const { billingKey, orderId } = body;

    if (!billingKey) {
      return NextResponse.json(
        { success: false, message: '해지할 구독 정보가 없습니다.' },
        { status: 400 }
      );
    }

    // 3. 페이앱 설정 로드
    const merchantId = process.env.PAYAPP_USERID;
    const apiKey = process.env.PAYAPP_LINKKEY;

    if (!merchantId || !apiKey) {
      return NextResponse.json(
        { success: false, message: '결제 시스템 설정 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 4. 페이앱에 정기결제 해지 요청 (rebillCancel)
    const payappResponse = await cancelPayAppRecurring({
      userid: merchantId,
      linkkey: apiKey,
      rebill_no: billingKey,
    });

    console.log('[Payment Cancel] PayApp Response:', payappResponse);
    
    if (payappResponse.state === '1') {
      /**
       * 5. 우리 시스템에 '해지 예약' 상태 업데이트
       * - 즉시 권한 박탈이 아니라, 만료일까지는 사용 가능하도록 상태 변경
       * - TODO: 내부 API 연동
       */
      try {
        console.log('[Payment Cancel] 구독 해지 예약 성공:', {
          userId: user.id,
          orderId,
          billingKey,
        });

        /*
        const internalSecret = process.env.INTERNAL_API_SECRET;
        if (internalSecret) {
          await axios.post(
            `${API_CONFIG.WEB_BASE_URL}/api/subscription/cancel-reservation`,
            {
              userId: user.id,
              orderId: orderId,
              canceledAt: new Date().toISOString(),
            },
            {
              headers: { 'X-Internal-Secret': internalSecret },
            }
          );
        }
        */
      } catch (dbError) {
        console.error('[Payment Cancel] DB 업데이트 실패:', dbError);
      }

      return NextResponse.json({
        success: true,
        message: '구독 해지 예약이 완료되었습니다. 이번 결제 주기 만료 시까지 서비스를 이용하실 수 있습니다.',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: payappResponse.errorMessage || '페이앱 해지 요청에 실패했습니다.',
        },
        { status: 400 }
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

