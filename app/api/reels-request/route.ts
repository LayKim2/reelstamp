// 릴스 기획·대본 이벤트 신청 API 라우트: 폼 데이터를 Google Sheets에 저장 (파일은 이미 클라이언트에서 presigned URL로 업로드됨)
import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/app/lib/google/sheets';
import { ApiResponse, ReelsRequestPayload } from '@/app/types/reels-request';

export async function POST(request: NextRequest) {
  try {
    // JSON body 파싱
    const body = await request.json();

    // 필수 필드 검증
    const topic = body.topic as string;
    const content = body.content as string;
    const instagramId = body.instagramId as string;
    const additionalContent = body.additionalContent as string | null;
    const videoLength = body.videoLength as string | null;
    const agreedToPrivacyPolicy = body.agreedToPrivacyPolicy as boolean;
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

    // 개인정보 동의 확인
    if (!agreedToPrivacyPolicy) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            message: '개인정보 수집 및 이용에 동의해주세요.',
            code: 'PRIVACY_POLICY_NOT_AGREED',
          },
        },
        { status: 400 }
      );
    }

    // 타임스탬프 생성
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
      fileUrl = files.map((f) => f.fileUrl).join(', '); // presigned URL 저장
    }

    // Spreadsheet 헤더 초기화와 데이터 추가를 병렬 처리 (성능 최적화)
    const { initializeSheetHeaders } = await import('@/app/lib/google/sheets');
    
    try {
      // 헤더 초기화와 데이터 추가를 병렬로 실행
      await Promise.all([
        initializeSheetHeaders().catch((error) => {
          console.warn('헤더 초기화 경고:', error);
        }),
        appendToSheet({
          timestamp,
          topic,
          content,
          instagramId,
          additionalContent: additionalContent || '',
          fileName,
          fileUrl,
          videoLength: videoLength || '',
        }),
      ]);
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

