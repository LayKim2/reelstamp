// AI 대본 재생성 프록시 API: 기존 리비전 기반으로 대본 재생성 요청을 외부 AI 서버로 전달
import { NextRequest, NextResponse } from 'next/server';
import { getServerAiApiClient } from '@/app/lib/api/server-client';
import { AxiosError } from 'axios';

interface RouteParams {
  params: Promise<{
    revision_id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { revision_id } = await params;

  if (!revision_id) {
    return NextResponse.json(
      { message: 'revision_id는 필수입니다.' },
      { status: 400 }
    );
  }

  try {
    const aiApiClient = await getServerAiApiClient();

    // 이 엔드포인트는 path param만 사용하고 body는 없으므로 빈 객체 전달
    const response = await aiApiClient.post(
      `/ai/regenerate-reel-script/${revision_id}`,
      {}
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status || 500;
    const errorData = axiosError.response?.data;

    console.error('[RegenerateReelScript Proxy Error]', {
      status: statusCode,
      data: errorData,
      message: axiosError.message,
      url: axiosError.config?.url,
      baseURL: axiosError.config?.baseURL,
      headers: axiosError.config?.headers,
    });

    // 422 Validation Error의 경우 상세 내용 출력
    if (
      statusCode === 422 &&
      errorData &&
      typeof errorData === 'object' &&
      'detail' in errorData
    ) {
      console.error(
        '[Regenerate Validation Error Details]',
        JSON.stringify((errorData as any).detail, null, 2)
      );
    }

    // 500 Internal Server Error의 경우 더 자세한 로깅
    if (statusCode === 500) {
      console.error('[Regenerate 500 Internal Server Error]', {
        errorMessage: axiosError.message,
        responseData: errorData,
        requestUrl: axiosError.config?.url,
        requestMethod: axiosError.config?.method,
        requestHeaders: axiosError.config?.headers,
      });
    }

    // 외부 서버에서 보낸 에러 메시지 또는 기본 메시지 전달
    if (errorData && typeof errorData === 'object' && 'message' in errorData) {
      return NextResponse.json(
        { message: (errorData as any).message },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      {
        message:
          axiosError.message ||
          '대본 재생성 중 서버 오류가 발생했습니다.',
      },
      { status: statusCode }
    );
  }
}

