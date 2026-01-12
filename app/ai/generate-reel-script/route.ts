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
    const response = await aiApiClient.post('/ai/generate-reel-script', formData);

    // 3. 외부 서버의 응답을 클라이언트에 그대로 전달
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

    // 외부 서버에서 보낸 에러 메시지를 그대로 전달
    // 403 에러의 경우 detail.message를 추출
    if (statusCode === 403 && errorData && typeof errorData === 'object' && 'detail' in errorData) {
      const detail = (errorData as any).detail;
      if (detail && typeof detail === 'object' && 'message' in detail) {
        return NextResponse.json(
          { message: detail.message },
          { status: statusCode }
        );
      }
    }

    // 다른 에러의 경우 errorData를 그대로 전달 (에러 메시지가 있으면 포함)
    return NextResponse.json(
      errorData || { message: axiosError.message || '대본 생성 중 서버 오류가 발생했습니다.' },
      { status: statusCode }
    );
  }
}

