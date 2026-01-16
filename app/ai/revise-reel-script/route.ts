// AI 챗봇 대화 프록시 API: 완성된 대본에 대해 챗봇으로 대화하기 위한 프록시
// 실제 대본 업데이트는 별도 API를 사용해야 함
import { NextRequest, NextResponse } from 'next/server';
import { getServerAiApiClient } from '@/app/lib/api/server-client';
import { AxiosError } from 'axios';

export async function POST(request: NextRequest) {
  try {
    // 1. 클라이언트로부터 전송된 JSON body 파싱
    const body = await request.json();
    
    // 2. 필수 필드 검증
    const { sessionId, editRequest } = body;
    
    if (!sessionId || !editRequest) {
      return NextResponse.json(
        { message: 'sessionId와 editRequest는 필수입니다.' },
        { status: 400 }
      );
    }
    
    // 3. 외부 AI API 서버로 챗봇 대화 요청 전달 (Axios 사용)
    // getServerAiApiClient()를 사용하여 쿠키의 accessToken을 헤더에 포함
    const aiApiClient = await getServerAiApiClient();
    const response = await aiApiClient.post('/ai/revise-reel-script', {
      sessionId,
      editRequest,
    });

    // 4. 외부 서버의 응답을 클라이언트에 그대로 전달
    return NextResponse.json(response.data, { status: 200 });

  } catch (error) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status || 500;
    const errorData = axiosError.response?.data;

    console.error('[Proxy API Error]', {
      status: statusCode,
      data: errorData,
      message: axiosError.message,
      url: axiosError.config?.url,
      baseURL: axiosError.config?.baseURL,
      headers: axiosError.config?.headers,
    });

    // 422 Validation Error의 경우 상세 내용 출력
    if (statusCode === 422 && errorData && typeof errorData === 'object' && 'detail' in errorData) {
      console.error('[Validation Error Details]', JSON.stringify(errorData.detail, null, 2));
    }

    // 500 Internal Server Error의 경우 더 자세한 로깅
    if (statusCode === 500) {
      console.error('[500 Internal Server Error]', {
        errorMessage: axiosError.message,
        responseData: errorData,
        requestUrl: axiosError.config?.url,
        requestMethod: axiosError.config?.method,
        requestHeaders: axiosError.config?.headers,
      });
    }

    // 외부 서버에서 보낸 에러 메시지나 Validation Error(422)를 그대로 전달
    // 500 에러의 경우 사용자 친화적인 메시지 제공
    const errorMessage = statusCode === 500 
      ? { message: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' }
      : errorData || { message: '챗봇 대화 중 서버 오류가 발생했습니다.' };

    return NextResponse.json(
      errorMessage,
      { status: statusCode }
    );
  }
}

