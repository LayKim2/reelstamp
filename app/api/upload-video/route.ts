// 영상 파일 업로드를 위한 클라이언트 업로드 핸들러
// Vercel Blob의 handleUpload를 사용하여 클라이언트에서 직접 업로드 처리
import { NextRequest, NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';
import { getCurrentUser } from '@/app/lib/api/auth';

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // 사용자 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // handleUpload를 사용하여 클라이언트 업로드 처리
    // 이 방식은 클라이언트에서 직접 업로드하되, 서버에서 인증 및 파일명 생성 등을 처리
    const body = await request.json();
    
    console.log('[handleUpload 호출]', {
      bodyType: typeof body,
      bodyKeys: body ? Object.keys(body) : 'null',
    });
    
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        console.log('[onBeforeGenerateToken]', { pathname, userId: user.id });
        // 파일명에 userId 포함
        const filename = `videos/${user.id}/${Date.now()}-${pathname}`;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500MB 제한
          tokenPayload: JSON.stringify({
            userId: user.id,
            originalFilename: pathname,
          }),
          callbackUrl: `${baseUrl}/api/upload-video`, // callbackUrl 추가
          addRandomSuffix: true, // 고유한 파일명을 위해 랜덤 접미사 추가
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }: { blob: any; tokenPayload?: string | null }) => {
        // 업로드 완료 후 처리 (필요시)
        console.log('[Upload Completed]', {
          url: blob.url,
          pathname: blob.pathname,
          tokenPayload,
        });
      },
    });

    console.log('[handleUpload 응답]', {
      responseType: typeof response,
      responseKeys: response ? Object.keys(response) : 'null',
      response: response,
    });

    // handleUpload는 일반 객체를 반환하므로 Response로 변환
    if (response && typeof response === 'object' && 'type' in response) {
      // response가 객체인 경우 JSON으로 변환하여 Response 반환
      return NextResponse.json(response);
    }

    // 이미 Response인 경우 그대로 반환
    return response as Response;
  } catch (error: any) {
    console.error('[Upload Handler Error]', {
      message: error?.message,
      stack: error?.stack,
      error: error,
    });
    return NextResponse.json(
      { 
        error: '영상 업로드 중 오류가 발생했습니다.',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
