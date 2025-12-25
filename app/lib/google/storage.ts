// Google Cloud Storage 헬퍼 함수: 파일 업로드 기능 제공
import { Storage } from '@google-cloud/storage';
import { normalizePrivateKey } from './utils';

const BUCKET_NAME = process.env.GCS_BUCKET_NAME;
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;

// Google Cloud Storage 클라이언트 초기화
function getStorageClient() {
  if (!PROJECT_ID) {
    throw new Error('GOOGLE_CLOUD_PROJECT_ID 환경 변수가 설정되지 않았습니다.');
  }

  // 서비스 계정 인증 정보 사용
  const storage = new Storage({
    projectId: PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY),
    },
  });

  return storage;
}

// 파일을 Google Cloud Storage에 업로드
export async function uploadFileToGCS(
  file: File,
  folderPath?: string
): Promise<{ fileName: string; fileUrl: string; publicUrl?: string }> {
  if (!BUCKET_NAME) {
    throw new Error('GCS_BUCKET_NAME 환경 변수가 설정되지 않았습니다.');
  }

  const storage = getStorageClient();
  const bucket = storage.bucket(BUCKET_NAME);

  try {
    // 파일을 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 파일 경로 생성 (폴더 경로가 있으면 포함)
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = folderPath
      ? `${folderPath}/${timestamp}_${sanitizedFileName}`
      : `${timestamp}_${sanitizedFileName}`;

    // 파일 업로드
    console.log('GCS 파일 업로드 시작:', {
      fileName: file.name,
      filePath,
      fileSize: file.size,
      mimeType: file.type,
      bucketName: BUCKET_NAME,
    });

    const fileUpload = bucket.file(filePath);
    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // 파일을 공개로 설정 (선택사항)
    // await fileUpload.makePublic();

    // 파일 URL 생성
    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${filePath}`;
    
    // 서명된 URL 생성 (만료 시간: 1년)
    const [signedUrl] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1년
    });

    console.log('GCS 파일 업로드 성공:', {
      fileName: file.name,
      filePath,
      publicUrl,
      signedUrl,
    });

    return {
      fileName: file.name,
      fileUrl: signedUrl, // 서명된 URL 사용 (더 안전)
      publicUrl, // 공개 URL (선택사항)
    };
  } catch (error: any) {
    console.error('GCS 파일 업로드 실패:', error);
    console.error('에러 코드:', error?.code);
    console.error('에러 메시지:', error?.message);

    // 권한 에러인 경우
    if (error?.code === 403 || error?.message?.includes('permission')) {
      throw new Error(
        `GCS 버킷 접근 권한이 없습니다. 서비스 계정(${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL})이 버킷(${BUCKET_NAME})에 접근 권한이 있는지 확인해주세요.`
      );
    }
    // 버킷을 찾을 수 없는 경우
    if (error?.code === 404) {
      throw new Error(`GCS 버킷을 찾을 수 없습니다. 버킷 이름(${BUCKET_NAME})을 확인해주세요.`);
    }

    const errorMessage = error?.message || '알 수 없는 오류';
    const errorCode = error?.code ? ` (코드: ${error.code})` : '';
    throw new Error(`파일 업로드 실패: ${errorMessage}${errorCode}`);
  }
}

// 파일 삭제 (필요시)
export async function deleteFileFromGCS(filePath: string): Promise<void> {
  if (!BUCKET_NAME) {
    throw new Error('GCS_BUCKET_NAME 환경 변수가 설정되지 않았습니다.');
  }

  const storage = getStorageClient();
  const bucket = storage.bucket(BUCKET_NAME);

  try {
    await bucket.file(filePath).delete();
    console.log('GCS 파일 삭제 성공:', filePath);
  } catch (error: any) {
    console.error('GCS 파일 삭제 실패:', error);
    throw error;
  }
}

