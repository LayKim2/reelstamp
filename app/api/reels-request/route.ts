// 릴스 기획·대본 이벤트 신청 API 라우트: 폼 데이터를 Google Sheets에 저장하고 파일을 Google Cloud Storage에 업로드
import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/app/lib/google/sheets';
import { uploadFileToGCS } from '@/app/lib/google/storage';
import { ApiResponse, ReelsRequestPayload } from '@/app/types/reels-request';

// 영상 길이 제한: 25분 (1500초)
const MAX_VIDEO_DURATION = 25 * 60; // 25분 = 1500초

// 허용된 비디오 파일 타입
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/3gpp',
];

export async function POST(request: NextRequest) {
  try {
    // JSON body 파싱
    const body = await request.json();

    // 필수 필드 검증
    const topic = body.topic as string;
    const content = body.content as string;
    const instagramId = body.instagramId as string;
    const additionalContent = body.additionalContent as string | null;
    // 업로드된 파일 정보 (이미 GCS에 업로드됨)
    const files = body.files as Array<{ fileName: string; fileUrl: string }> || [];

    if (!topic || !content || !instagramId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            message: '필수 필드가 누락되었습니다.',
            code: 'MISSING_REQUIRED_FIELDS',
          },
        },
        { status: 400 }
      );
    }

    // 타임스탬프 생성 (파일 업로드와 병렬 처리 가능)
    const timestamp = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // 파일 정보 처리 (이미 클라이언트에서 GCS에 업로드됨)
    let fileName: string = '';
    let fileUrl: string = '';

    if (files.length > 0) {
      // 파일명과 URL을 쉼표로 구분하여 저장
      fileName = files.map((f) => f.fileName).join(', ');
      fileUrl = files.map((f) => f.fileUrl).join(', ');
    }

    // Spreadsheet 헤더 초기화
    const { initializeSheetHeaders } = await import('@/app/lib/google/sheets');
    await initializeSheetHeaders().catch((error) => {
      console.warn('헤더 초기화 경고:', error);
    });

    // Spreadsheet에 데이터 추가
    try {
      await appendToSheet({
        timestamp,
        topic,
        content,
        instagramId,
        additionalContent: additionalContent || '',
        fileName,
        fileUrl,
      });
    } catch (error) {
      console.error('Spreadsheet 저장 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            message: `데이터 저장에 실패했습니다: ${errorMessage}`,
            code: 'SPREADSHEET_SAVE_FAILED',
          },
        },
        { status: 500 }
      );
    }

    // 성공 응답
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          message: '신청이 완료되었습니다.',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API 에러:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          message: '서버 오류가 발생했습니다.',
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
      { status: 500 }
    );
  }
}

