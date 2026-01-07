// AI 대본 생성 프록시 API: 클라이언트의 요청을 외부 AI 서버로 전달
import { NextRequest, NextResponse } from 'next/server';
import { getServerAiApiClient } from '@/app/lib/api/server-client';
import { AxiosError } from 'axios';

export async function POST(request: NextRequest) {
  try {
    // 1. 클라이언트로부터 전송된 FormData 파싱
    const formData = await request.formData();
    
    
    // 2. 외부 AI API 서버로 요청 전달 (Axios 사용)
    // getServerAiApiClient()를 사용하여 쿠키의 accessToken을 헤더에 포함
    const aiApiClient = await getServerAiApiClient();
    
    console.log('[Proxy API Request]', {
      url: '/ai/generate-reel-script',
      baseURL: aiApiClient.defaults.baseURL,
      formDataFields: Array.from(formData.keys()),
    });

    const response = await aiApiClient.post('/ai/generate-reel-script', formData);

    // 3. 외부 서버의 응답을 클라이언트에 그대로 전달
    return NextResponse.json(response.data, { status: 200 });

  } catch (error) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status || 500;
    const errorData = axiosError.response?.data;
    const errorCode = axiosError.code;

    console.error('[Proxy API Error Detailed]', {
      status: statusCode,
      errorCode: errorCode,
      message: axiosError.message,
      url: axiosError.config?.url,
      baseURL: axiosError.config?.baseURL,
      data: errorData,
    });

    // 네트워크 에러 (타임아웃, 연결 거부 등) 처리
    if (!axiosError.response) {
      return NextResponse.json(
        { 
          message: 'AI 서버에 연결할 수 없습니다. 서버가 점검 중이거나 응답 시간이 초과되었습니다.',
          details: axiosError.message,
          code: errorCode
        },
        { status: 504 } // Gateway Timeout or Service Unavailable
      );
    }

    // 422 Validation Error의 경우 상세 내용 출력
    if (statusCode === 422 && errorData && typeof errorData === 'object' && 'detail' in errorData) {
      console.error('[Validation Error Details]', JSON.stringify(errorData.detail, null, 2));
    }

    // 외부 서버에서 보낸 에러 메시지나 Validation Error(422)를 그대로 전달
    // 500 에러의 경우 사용자 친화적인 메시지 제공
    const errorMessage = statusCode === 500 
      ? { 
          message: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          error: axiosError.message,
          data: errorData
        }
      : errorData || { message: '대본 생성 중 서버 오류가 발생했습니다.' };

    return NextResponse.json(
      errorMessage,
      { status: statusCode }
    );
  }
}

