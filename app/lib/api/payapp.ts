/**
 * PayApp API 통신을 위한 유틸리티
 * 상세 명세: https://payapp.kr/developer/
 */

export interface PayAppPaymentRequest {
  userid: string;      // 판매자 아이디
  linkkey: string;     // API 연동 키
  goodname: string;    // 상품명
  price: number;       // 결제 금액
  recvphone?: string;  // 구매자 휴대폰번호 (필요시)
  memo?: string;       // 결제 메모
  returnurl: string;   // 결제 완료 후 이동할 URL (브라우저 리다이렉트)
  feedbackurl: string; // 결제 결과 통보 URL (서버 간 Webhook)
  var1?: string;       // 사용자 정의 변수 1 (예: user_id)
  var2?: string;       // 사용자 정의 변수 2 (예: plan_id)
}

export interface PayAppPaymentResponse {
  state: string;       // 요청 결과 (1:성공, 0:실패)
  errorMessage?: string;
  mul_no?: string;      // 결제 고유번호
  payurl?: string;      // 결제 페이지 URL
}

/**
 * PayApp 결제 링크 생성 요청
 */
export async function createPayAppPaymentLink(params: PayAppPaymentRequest): Promise<PayAppPaymentResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append('cmd', 'payrequest');
    formData.append('userid', params.userid);
    formData.append('linkkey', params.linkkey);
    formData.append('goodname', params.goodname);
    formData.append('price', String(params.price));
    formData.append('recvphone', params.recvphone || '01059601017'); // 휴대폰 번호가 없으면 기본값 설정 (페이앱 필수값인 경우 대응)
    formData.append('memo', params.memo || '');
    formData.append('returnurl', params.returnurl);
    formData.append('feedbackurl', params.feedbackurl);
    formData.append('var1', params.var1 || '');
    formData.append('var2', params.var2 || '');

    // 최신 페이앱 API는 apiLoad.html을 통해 모든 요청을 처리하는 경우가 많습니다.
    const apiUrl = 'https://api.payapp.kr/oapi/apiLoad.html';

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const text = await response.text();
    
    // 응답 형식: state=1&errorMessage=&mul_no=...&payurl=...
    const result = new URLSearchParams(text);
    
    return {
      state: result.get('state') || '0',
      errorMessage: result.get('errorMessage') || '',
      mul_no: result.get('mul_no') || '',
      payurl: result.get('payurl') || '',
    };
  } catch (error) {
    console.error('[PayApp Utility Error]', error);
    return {
      state: '0',
      errorMessage: 'PayApp 서버와의 통신 중 오류가 발생했습니다.',
    };
  }
}
