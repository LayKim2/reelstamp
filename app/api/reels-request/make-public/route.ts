// GCS 객체를 public으로 설정하는 API: 업로드된 파일을 누구나 접근 가능하도록 설정
import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

const BUCKET_NAME = process.env.GCS_BUCKET_NAME;
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;

// Google Cloud Storage 클라이언트 초기화
function getStorageClient() {
  const storage = new Storage({
    projectId: PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
  });

  return storage;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filePath } = body;

    if (!filePath) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: '파일 경로가 누락되었습니다.',
            code: 'MISSING_FILE_PATH',
          },
        },
        { status: 400 }
      );
    }

    if (!BUCKET_NAME) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'GCS_BUCKET_NAME 환경 변수가 설정되지 않았습니다.',
            code: 'MISSING_BUCKET_NAME',
          },
        },
        { status: 500 }
      );
    }

    const storage = getStorageClient();
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(filePath);

    // 객체를 public으로 설정
    await file.makePublic();

    return NextResponse.json({
      success: true,
      data: {
        message: '객체가 public으로 설정되었습니다.',
      },
    });
  } catch (error) {
    console.error('객체 public 설정 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: '객체를 public으로 설정하는데 실패했습니다.',
          code: 'MAKE_PUBLIC_FAILED',
        },
      },
      { status: 500 }
    );
  }
}

