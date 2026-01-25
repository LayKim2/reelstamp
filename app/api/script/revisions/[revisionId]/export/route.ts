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
    let errorMessage = '대본 ZIP 내보내기 중 오류가 발생했습니다.';
    let errorCode = 'SCRIPT_EXPORT_ERROR';
    
    if (error.response?.data) {
      try {
        let errorData = error.response.data;
        if (Buffer.isBuffer(errorData)) {
          const errorString = errorData.toString('utf-8');
          errorData = JSON.parse(errorString);
        }
        
        if (typeof errorData === 'object' && errorData !== null) {
          errorMessage = errorData.message || errorMessage;
          errorCode = errorData.errorCode || errorCode;
        }
      } catch (parseError) {
        if (Buffer.isBuffer(error.response.data)) {
          errorMessage = error.response.data.toString('utf-8');
        }
      }
    }

    console.error('[ScriptExport API Error]', {
      message: error.message,
      status: error.response?.status,
      errorMessage,
      errorCode,
    });

    const status = error.response?.status || 500;

    return NextResponse.json(
      {
        success: false,
        status,
        message: errorMessage,
        errorCode,
        data: null,
      },
      { status }
    );
  }
}

