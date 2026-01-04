// AI 대본 생성 프록시 API: 클라이언트의 요청을 외부 AI 서버로 전달
import { NextRequest, NextResponse } from 'next/server';
import apiClient from '@/app/lib/api/client';
import { AxiosError } from 'axios';

export async function POST(request: NextRequest) {
  try {
    // 1. 클라이언트로부터 전송된 FormData 파싱
    const formData = await request.formData();
    
    // 2. 외부 API 서버로 요청 전달 (Axios 사용)
    const response = await apiClient.post('/ai/generate-reel-script', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

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
    });

    // 외부 서버에서 보낸 에러 메시지나 Validation Error(422)를 그대로 전달
    return NextResponse.json(
      errorData || { message: '대본 생성 중 서버 오류가 발생했습니다.' },
      { status: statusCode }
    );
  }
}

