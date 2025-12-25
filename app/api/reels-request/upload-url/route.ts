// GCS 업로드용 presigned URL 생성 API: 클라이언트에서 직접 파일을 업로드할 수 있도록 presigned URL 제공
import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { normalizePrivateKey } from '@/app/lib/google/utils';

const BUCKET_NAME = process.env.GCS_BUCKET_NAME;
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;

// Google Cloud Storage 클라이언트 초기화
function getStorageClient() {
  if (!PROJECT_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google Cloud Storage 환경 변수가 설정되지 않았습니다.');
  }

  const storage = new Storage({
    projectId: PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY),
    },
  });

  return storage;
}

export async function POST(request: NextRequest) {
  try {
    // 환경 변수 확인
    if (!BUCKET_NAME || !PROJECT_ID) {
      console.error('환경 변수 누락:', {
        BUCKET_NAME: !!BUCKET_NAME,
        PROJECT_ID: !!PROJECT_ID,
        SERVICE_ACCOUNT_EMAIL: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      });
      return NextResponse.json(
        {
          success: false,
          error: {
            message: '서버 설정 오류가 발생했습니다. 관리자에게 문의해주세요.',
            code: 'SERVER_CONFIG_ERROR',
          },
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { fileName, fileSize, contentType } = body;

    if (!fileName || !fileSize || !contentType) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: '파일 정보가 누락되었습니다.',
            code: 'MISSING_FILE_INFO',
          },
        },
        { status: 400 }
      );
    }

    // 파일 경로 생성
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `reels-requests/${timestamp}_${sanitizedFileName}`;

    // Storage 클라이언트 초기화 (에러 처리 포함)
    let storage;
    try {
      storage = getStorageClient();
    } catch (error) {
      console.error('Storage 클라이언트 초기화 실패:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            message: '서버 설정 오류가 발생했습니다. 관리자에게 문의해주세요.',
            code: 'STORAGE_CLIENT_INIT_FAILED',
          },
        },
        { status: 500 }
      );
    }

    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(filePath);

    // 업로드용 presigned URL 생성 (15분 유효)
    let signedUrl: string;
    let downloadUrl: string;
    
    try {
      [signedUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15분
        contentType,
      });

      // 다운로드용 presigned URL도 생성 (1년 유효)
      [downloadUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1년
      });
    } catch (error) {
      console.error('Presigned URL 생성 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `업로드 URL 생성에 실패했습니다: ${errorMessage}`,
            code: 'SIGNED_URL_GENERATION_FAILED',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        uploadUrl: signedUrl,
        downloadUrl,
        filePath,
        fileName: fileName,
      },
    });
  } catch (error) {
    console.error('Presigned URL 생성 실패:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      {
        success: false,
        error: {
          message: `업로드 URL 생성에 실패했습니다: ${errorMessage}`,
          code: 'UPLOAD_URL_GENERATION_FAILED',
        },
      },
      { status: 500 }
    );
  }
}

