import { NextRequest, NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';
import { getCurrentUser } from '@/app/lib/api/auth';
import { sanitizeFilename } from '@/app/lib/utils/filename';

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        const sanitizedPathname = sanitizeFilename(pathname);
        const filename = `videos/${user.id}/${Date.now()}-${sanitizedPathname}`;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
          maximumSizeInBytes: 400 * 1024 * 1024,
          tokenPayload: JSON.stringify({
            userId: user.id,
            originalFilename: pathname,
          }),
          callbackUrl: `${baseUrl}/api/upload-video`,
          addRandomSuffix: true,
          filename,
        };
      },
    });

    if (response && typeof response === 'object' && 'type' in response) {
      return NextResponse.json(response);
    }

    return response as Response;
  } catch (error: any) {
    console.error('[Upload Handler Error]', error?.message);
    return NextResponse.json(
      { 
        error: '영상 업로드 중 오류가 발생했습니다.',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
