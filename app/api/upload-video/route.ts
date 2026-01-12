// 영상 파일을 Vercel Blob에 업로드하는 API
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getCurrentUser } from '@/app/lib/api/auth';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 사용자 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('video') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: '영상 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 모든 영상 파일을 Vercel Blob에 업로드
    // put 함수는 자동으로 BLOB_READ_WRITE_TOKEN 환경 변수를 읽어옴
    const uploadPromises = files.map(async (file) => {
      const filename = `videos/${user.id}/${Date.now()}-${file.name}`;
      const blob = await put(filename, file, {
        access: 'public',
        contentType: file.type,
      });
      return blob;
    });

    const blobs = await Promise.all(uploadPromises);
    const urls = blobs.map((blob) => blob.url);

    return NextResponse.json({ urls }, { status: 200 });
  } catch (error) {
    console.error('[Video Upload Error]', error);
    return NextResponse.json(
      { error: '영상 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
