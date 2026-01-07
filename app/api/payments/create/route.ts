import { NextRequest, NextResponse } from 'next/server';
import { createPayAppPaymentLink } from '@/app/lib/api/payapp';
import { getCurrentUser } from '@/app/lib/api/auth';

/**
 * PayApp 결제 요청 생성 API
 * 사용자가 선택한 플랜에 따른 결제 링크를 생성합니다.
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    
    // 5. PayApp 결제 링크 생성 요청
    const payappResponse = await createPayAppPaymentLink({
      userid: merchantId,
      linkkey: apiKey,
      goodname: `Reelstamp ${planName} Plan`,
      price: price,
      returnurl: `${baseUrl}/pricing/success`,
      feedbackurl: `${baseUrl}/api/payment`, // 변경된 Webhook 주소
      var1: String(user.id), // 사용자 식별자
      var2: planId,           // 플랜 식별자
    });

    if (payappResponse.state === '1' && payappResponse.payurl) {
      return NextResponse.json({
        success: true,
        payurl: payappResponse.payurl,
        mul_no: payappResponse.mul_no,
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: payappResponse.errorMessage || '결제 링크 생성에 실패했습니다.' 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[Payment Create API Error]', error);
    return NextResponse.json(
      { success: false, message: '결제 요청 처리 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

