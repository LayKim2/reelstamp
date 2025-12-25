// GCS 업로드용 presigned URL 생성 API: 클라이언트에서 직접 파일을 업로드할 수 있도록 presigned URL 제공
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

    const storage = getStorageClient();
    const bucket = storage.bucket(BUCKET_NAME!);
    const file = bucket.file(filePath);

    // 업로드용 presigned URL 생성 (15분 유효)
    const [uploadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15분
      contentType,
    });

    // Storage URL 생성 (업로드 후 객체를 public으로 설정하면 접근 가능)
    const storageUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${filePath}`;

    return NextResponse.json({
      success: true,
      data: {
        uploadUrl,
        storageUrl, // Storage URL (업로드 후 public으로 설정)
        filePath,
        fileName: fileName,
      },
    });
  } catch (error) {
    console.error('업로드 URL 생성 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: '업로드 URL 생성에 실패했습니다.',
          code: 'UPLOAD_URL_GENERATION_FAILED',
        },
      },
      { status: 500 }
    );
  }
}

