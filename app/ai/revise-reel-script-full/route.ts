// AI 대본 수정 전체 적용 프록시 API
import { NextRequest, NextResponse } from 'next/server';
import { getServerAiApiClient } from '@/app/lib/api/server-client';
import { AxiosError } from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, parentRevisionId, suggestedChange } = body;

    if (!sessionId || !parentRevisionId || !suggestedChange) {
      return NextResponse.json(
        { message: 'sessionId, parentRevisionId, suggestedChange는 필수입니다.' },
        { status: 400 }
      );
    }

    // 외부 AI API 서버로 요청 전달 (POST /ai/revise-reel-script-full)
    // getServerAiApiClient()를 사용하여 쿠키의 accessToken을 헤더에 포함
    const aiApiClient = await getServerAiApiClient();
    const response = await aiApiClient.post('/ai/revise-reel-script-full', {
      sessionId,
      parentRevisionId,
      suggestedChange
    });

    return NextResponse.json(response.data, { status: 200 });

  } catch (error) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status || 500;
    const errorData = axiosError.response?.data;

    console.error('[Proxy API Error - Revise Script Full]', {
      status: statusCode,
      data: errorData,
      message: axiosError.message,
    });

    return NextResponse.json(
      errorData || { message: '대본 수정 적용 중 서버 오류가 발생했습니다.' },
      { status: statusCode }
    );
  }
}

