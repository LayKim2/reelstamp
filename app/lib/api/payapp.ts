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

/**
 * PayApp 정기결제(Recurring) 등록 요청 파라미터
 * cmd = rebillRegist
 * 참고: https://www.payapp.kr/dev_center/dev_center01.html
 */
export interface PayAppRecurringRequest {
  userid: string;           // 판매자 아이디 (필수)
  linkkey: string;          // API 연동 키 (필수)
  goodname: string;         // 상품명 (필수)
  goodprice: number;        // 정기결제 금액 (필수)
  recvphone?: string;        // 고객 휴대폰 번호 (선택적)
  recvemail?: string;        // 수신자 이메일 (구매자 이메일, 선택적)
  rebillCycleType: 'Month' | 'Week' | 'Day'; // 결제 주기 타입 (필수)
  rebillCycleMonth?: string; // 월 주기인 경우: 매월 결제일 (1~31)
  rebillCycleWeek?: string;  // 주 주기인 경우: 요일
  rebillExpire?: string;     // 정기결제 만료일 (yyyy-mm-dd)
  feedbackurl: string;       // 웹훅(결과 통보) URL (필수)
  returnurl: string;         // 성공 후 리다이렉트 URL (필수)
  var1?: string;             // 임의값 1 (주로 userId)
  var2?: string;             // 임의값 2 (planId 등)
  var3?: string;             // 임의값 3 (orderId 등)
}

export interface PayAppPaymentResponse {
  state: string;       // 요청 결과 (1:성공, 0:실패)
  errorMessage?: string;
  mul_no?: string;      // 결제 고유번호 (orderId)
  payurl?: string;      // 결제 페이지 URL
  /**
   * TODO: 정기 결제 도입 시 PayApp에서 내려주는 billing key 필드 매핑
   * - PayApp 정기결제 API를 사용할 때 응답에 빌링키가 포함된다면
   *   그 필드를 파싱해서 여기에 넣고, DB의 subscription/order와 함께 저장한다.
   */
  billingKey?: string;
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
    // recvphone은 선택적 파라미터 (값이 있을 때만 전송)
    if (params.recvphone) {
      formData.append('recvphone', params.recvphone);
    }
    if (params.memo) {
      formData.append('memo', params.memo);
    }
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
      mul_no: result.get('mul_no') || '', // order id
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

/**
 * PayApp 정기결제(Recurring) 등록 요청
 *
 * cmd = rebillRegist
 * - 최초 1회 결제 승인 + 정기결제 등록번호(rebill_no) 발급
 * - 응답으로 payurl(결제창 URL)과 rebill_no(정기결제 등록번호)를 반환
 */
export async function createPayAppRecurringLink(
  params: PayAppRecurringRequest,
): Promise<PayAppPaymentResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append('cmd', 'rebillRegist');
    formData.append('userid', params.userid);
    formData.append('linkkey', params.linkkey); // 필수: API 연동 키
    formData.append('goodname', params.goodname);
    formData.append('goodprice', String(params.goodprice));
    // recvphone은 선택적 파라미터 (값이 있을 때만 전송)
    if (params.recvphone) {
      formData.append('recvphone', params.recvphone);
    }
    // recvemail: 수신자 이메일 (구매자 이메일)
    if (params.recvemail) {
      formData.append('recvemail', params.recvemail);
    }
    formData.append('rebillCycleType', params.rebillCycleType);

    if (params.rebillCycleMonth) {
      formData.append('rebillCycleMonth', params.rebillCycleMonth);
    }
    if (params.rebillCycleWeek) {
      formData.append('rebillCycleWeek', params.rebillCycleWeek);
    }
    if (params.rebillExpire) {
      formData.append('rebillExpire', params.rebillExpire);
    }

    formData.append('feedbackurl', params.feedbackurl);
    formData.append('returnurl', params.returnurl);
    formData.append('var1', params.var1 || '');
    formData.append('var2', params.var2 || '');
    formData.append('var3', params.var3 || '');

    // 디버깅: 실제 전송되는 파라메터 확인 (민감 정보는 마스킹)
    const formDataString = formData.toString();
    const recvphoneMatch = formDataString.match(/recvphone=([^&]*)/);
    const recvemailMatch = formDataString.match(/recvemail=([^&]*)/);
    const linkkeyMatch = formDataString.match(/linkkey=([^&]*)/);
    console.log('[PayApp 정기결제 요청]', {
      cmd: 'rebillRegist',
      userid: params.userid,
      hasLinkkey: !!linkkeyMatch,
      goodname: params.goodname,
      goodprice: params.goodprice,
      rebillCycleType: params.rebillCycleType,
      rebillCycleMonth: params.rebillCycleMonth,
      rebillExpire: params.rebillExpire,
      recvphone: recvphoneMatch ? decodeURIComponent(recvphoneMatch[1]) : 'not sent',
      recvemail: recvemailMatch ? decodeURIComponent(recvemailMatch[1]) : 'not sent',
      feedbackurl: params.feedbackurl,
      returnurl: params.returnurl,
    });

    const apiUrl = 'https://api.payapp.kr/oapi/apiLoad.html';

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const text = await response.text();

    console.log('[PayApp 정기결제 응답]', {
      status: response.status,
      statusText: response.statusText,
      responseText: text.substring(0, 500), // 처음 500자만 로깅
    });

    // 응답 형식 예시: state=1&errorMessage=&rebill_no=...&payurl=...
    const result = new URLSearchParams(text);

    const payappResult = {
      state: result.get('state') || '0',
      errorMessage: result.get('errorMessage') || '',
      mul_no: result.get('mul_no') || '',
      payurl: result.get('payurl') || '',
      billingKey: result.get('rebill_no') || '',
    };

    console.log('[PayApp 정기결제 파싱 결과]', {
      state: payappResult.state,
      hasPayurl: !!payappResult.payurl,
      hasBillingKey: !!payappResult.billingKey,
      errorMessage: payappResult.errorMessage,
    });

    return payappResult;
  } catch (error) {
    console.error('[PayApp Recurring Utility Error]', error);
    return {
      state: '0',
      errorMessage: 'PayApp 정기결제 등록 중 오류가 발생했습니다.',
    };
  }
}

/**
 * PayApp 정기결제 해지 요청 (다음 결제부터 중단)
 * cmd = rebillCancel
 */
export async function cancelPayAppRecurring(params: {
  userid: string;
  linkkey: string;
  rebill_no: string;
}): Promise<{ state: string; errorMessage?: string }> {
  try {
    const formData = new URLSearchParams();
    formData.append('cmd', 'rebillCancel');
    formData.append('userid', params.userid);
    formData.append('linkkey', params.linkkey);
    formData.append('rebill_no', params.rebill_no);

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
    const result = new URLSearchParams(text);

    return {
      state: result.get('state') || '0',
      errorMessage: result.get('errorMessage') || '',
    };
  } catch (error) {
    console.error('[PayApp Recurring Cancel Error]', error);
    return { state: '0', errorMessage: '해지 요청 중 오류가 발생했습니다.' };
  }
}
