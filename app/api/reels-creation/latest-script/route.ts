// 최신 대본 정보 조회 프록시 API
import { NextRequest, NextResponse } from 'next/server';
import { getServerAiApiClient } from '@/app/lib/api/server-client';
import { AxiosError } from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { message: 'sessionId가 필요합니다.' },
        { status: 400 }
      );
    }

    // 외부 AI API 서버로 요청 전달 (GET /ai/latest-reel-script)
    // getServerAiApiClient()를 사용하여 쿠키의 accessToken을 헤더에 포함
    const aiApiClient = await getServerAiApiClient();
    const response = await aiApiClient.get('/ai/latest-reel-script', {
      params: { sessionId }
    });

    return NextResponse.json(response.data, { status: 200 });

  } catch (error) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status || 500;
    const errorData = axiosError.response?.data;

    console.error('[Proxy API Error - Latest Script]', {
      status: statusCode,
      data: errorData,
      message: axiosError.message,
    });

    return NextResponse.json(
      errorData || { message: '대본 정보를 가져오는 중 서버 오류가 발생했습니다.' },
      { status: statusCode }
    );
  }
}

