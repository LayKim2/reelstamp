// 대본 ZIP 내보내기 API Route:
// Spring API의 GET /api/script/revisions/{revisionId}/export를 프록시하여
// 클라이언트에서 /api/script/revisions/{revisionId}/export로 ZIP 파일을 다운로드할 수 있게 합니다.

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ revisionId: string }> }
) {
  const { revisionId } = await context.params;

  if (!revisionId) {
    return NextResponse.json(
      {
        success: false,
        status: 400,
        message: 'revisionId가 필요합니다.',
        errorCode: 'REVISION_ID_REQUIRED',
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const { getServerApiClient } = await import('@/app/lib/api/server-client');
    const apiClient = await getServerApiClient();

    // Spring API로 ZIP export 요청 (바이너리 데이터)
    const response = await apiClient.get(
      `/api/script/revisions/${encodeURIComponent(revisionId)}/export`,
      {
        responseType: 'arraybuffer',
      }
    );

    const contentType =
      (response.headers['content-type'] as string | undefined) ||
      'application/zip';
    const contentDisposition =
      (response.headers['content-disposition'] as string | undefined) ||
      `attachment; filename="reel-script-${revisionId}.zip"`;

    return new NextResponse(response.data as any, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });
  } catch (error: any) {
    console.error('[ScriptExport API Error]', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      '대본 ZIP 내보내기 중 오류가 발생했습니다.';

    return NextResponse.json(
      {
        success: false,
        status,
        message,
        errorCode: error.response?.data?.errorCode || 'SCRIPT_EXPORT_ERROR',
        data: null,
      },
      { status }
    );
  }
}

