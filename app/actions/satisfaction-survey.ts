// 만족도 조사 데이터를 Google Spreadsheet에 저장하는 Server Action
'use server';

interface SatisfactionSurveyData {
  rating: number;
  positives: string;
  negatives: string;
  userId?: number;
  userEmail?: string;
  page?: string;
}

/**
 * Google Apps Script Web App을 통해 Google Sheets에 만족도 조사 데이터를 추가합니다.
 * 서비스 계정 인증 없이 간단하게 사용할 수 있습니다.
 */
export async function submitSatisfactionSurvey(
  data: SatisfactionSurveyData
): Promise<{ success: boolean; message: string }> {
  try {
    // Google Apps Script Web App URL (환경 변수에서 가져오기)
    const webAppUrl = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;

    if (!webAppUrl) {
      console.error('[submitSatisfactionSurvey] GOOGLE_APPS_SCRIPT_WEB_APP_URL 환경 변수가 설정되지 않았습니다.');
      return {
        success: false,
        message: '서버 설정 오류가 발생했습니다.',
      };
    }

    // 현재 시간 (KST)
    const now = new Date();
    const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
    const timestamp = kstTime.toISOString().replace('T', ' ').substring(0, 19);

    // Google Apps Script Web App에 POST 요청 (비동기로 실행, 응답 대기 안 함)
    // 성능 향상을 위해 fire-and-forget 방식 사용
    fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp,
        rating: data.rating,
        positives: data.positives || '',
        negatives: data.negatives || '',
        userId: data.userId || '',
        userEmail: data.userEmail || '',
        page: data.page || '',
      }),
    }).catch((error) => {
      // 에러는 로그만 남기고 사용자에게는 성공으로 표시
      console.error('[submitSatisfactionSurvey] Google Apps Script 요청 실패 (백그라운드):', error);
    });

    // 즉시 성공 응답 반환 (사용자 경험 향상)
    return {
      success: true,
      message: '만족도 조사가 성공적으로 제출되었습니다.',
    };
  } catch (error: any) {
    console.error('[submitSatisfactionSurvey] 에러 발생:', error);
    return {
      success: false,
      message: error.message || '만족도 조사 제출 중 오류가 발생했습니다.',
    };
  }
}
