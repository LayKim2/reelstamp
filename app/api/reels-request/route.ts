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
    // FormData 파싱
    const formData = await request.formData();

    // 필수 필드 검증
    const topic = formData.get('topic') as string;
    const content = formData.get('content') as string;
    const instagramId = formData.get('instagramId') as string;
    const additionalContent = formData.get('additionalContent') as string | null;
    // 여러 파일 가져오기
    const videoFiles = formData.getAll('videoFiles') as File[];

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

    // 파일 검증 및 업로드 (파일이 있는 경우)
    let fileName: string = '';
    let fileUrl: string = '';

    // 유효한 파일만 필터링 (크기가 0보다 큰 파일)
    const validFiles = videoFiles.filter((file) => file.size > 0);

    // 파일 업로드와 Spreadsheet 헤더 초기화를 병렬로 처리 (최적화)
    if (validFiles.length > 0) {
      // 모든 파일 타입 검증
      for (const file of validFiles) {
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
          return NextResponse.json<ApiResponse>(
            {
              success: false,
              error: {
                message: `지원하지 않는 파일 형식입니다: ${file.name}`,
                code: 'INVALID_FILE_TYPE',
              },
            },
            { status: 400 }
          );
        }
      }

      // 파일 업로드와 헤더 초기화를 병렬로 처리
      const { initializeSheetHeaders } = await import('@/app/lib/google/sheets');
      
      try {
        // 모든 파일을 병렬로 업로드
        const uploadPromises = validFiles.map((file) =>
          uploadFileToGCS(file, 'reels-requests')
        );

        const [uploadResults] = await Promise.all([
          // 모든 파일 업로드
          Promise.all(uploadPromises),
          // Spreadsheet 헤더 초기화 (파일과 무관하므로 병렬 처리)
          initializeSheetHeaders().catch((error) => {
            // 헤더 초기화 실패는 무시 (이미 헤더가 있을 수 있음)
            console.warn('헤더 초기화 경고:', error);
          }),
        ]);

        // 파일명과 URL을 쉼표로 구분하여 저장
        fileName = uploadResults.map((result) => result.fileName).join(', ');
        fileUrl = uploadResults.map((result) => result.fileUrl).join(', ');
      } catch (error) {
        console.error('파일 업로드 실패:', error);
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: {
              message: `파일 업로드에 실패했습니다: ${errorMessage}`,
              code: 'FILE_UPLOAD_FAILED',
            },
          },
          { status: 500 }
        );
      }
    } else {
      // 파일이 없으면 헤더만 초기화
      const { initializeSheetHeaders } = await import('@/app/lib/google/sheets');
      await initializeSheetHeaders().catch((error) => {
        console.warn('헤더 초기화 경고:', error);
      });
    }

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

