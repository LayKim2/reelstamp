// Google Sheets 헬퍼 함수: Spreadsheet 생성, 데이터 추가, 헤더 설정 기능 제공
import { getSheetsClient } from './client';
import { SpreadsheetRow } from '@/app/types/reels-request';

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
// 시트 이름: 기본 시트 이름(Sheet1) 사용
const SHEET_NAME = 'list';

// Spreadsheet 헤더 설정 (첫 번째 행에 컬럼명 추가)
export async function initializeSheetHeaders() {
  if (!SPREADSHEET_ID) {
    throw new Error('GOOGLE_SPREADSHEET_ID 환경 변수가 설정되지 않았습니다.');
  }

  const sheets = getSheetsClient();

  try {
    // 기존 데이터 확인
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:G1`,
    });

    // 헤더가 이미 있으면 스킵
    if (response.data.values && response.data.values.length > 0) {
      return;
    }

    // 헤더 추가 (insta를 맨 앞으로, 신청일을 맨 마지막 컬럼으로)
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:G1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          [
            'insta',
            '주제',
            '내용',
            '추가 내용',
            '파일명',
            '파일 URL',
            '신청일',
          ],
        ],
      },
    });
  } catch (error: any) {
    console.error('헤더 설정 실패:', error);
    // 권한 에러인 경우 더 명확한 메시지 제공
    if (error?.code === 403 || error?.message?.includes('permission')) {
      throw new Error('Spreadsheet 접근 권한이 없습니다. 서비스 계정 이메일을 Spreadsheet에 공유해주세요.');
    }
    throw error;
  }
}

// Spreadsheet에 데이터 추가
export async function appendToSheet(data: SpreadsheetRow) {
  if (!SPREADSHEET_ID) {
    throw new Error('GOOGLE_SPREADSHEET_ID 환경 변수가 설정되지 않았습니다.');
  }

  const sheets = getSheetsClient();

  try {
    // 헤더는 API 라우트에서 이미 초기화됨 (병렬 처리 최적화)

    // 데이터 추가 (insta를 맨 앞으로, 신청일을 맨 마지막 컬럼으로)
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:G`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          [
            data.instagramId, // insta를 맨 앞으로
            data.topic,
            data.content,
            data.additionalContent || '',
            data.fileName || '',
            data.fileUrl || '',
            data.timestamp, // 신청일을 맨 마지막으로
          ],
        ],
      },
    });
  } catch (error: any) {
    console.error('Spreadsheet 데이터 추가 실패:', error);
    // 권한 에러인 경우 더 명확한 메시지 제공
    if (error?.code === 403 || error?.message?.includes('permission')) {
      throw new Error('Spreadsheet 접근 권한이 없습니다. 서비스 계정 이메일을 Spreadsheet에 공유해주세요.');
    }
    // 시트가 없는 경우
    if (error?.code === 400 && error?.message?.includes('Unable to parse range')) {
      throw new Error(`시트 '${SHEET_NAME}'를 찾을 수 없습니다. Spreadsheet에 해당 시트가 있는지 확인해주세요.`);
    }
    throw error;
  }
}

// Spreadsheet 생성 (필요시)
export async function createSpreadsheet(title: string = '릴스 기획·대본 이벤트 신청') {
  const sheets = getSheetsClient();

  try {
    const response = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title,
        },
        sheets: [
          {
            properties: {
              title: SHEET_NAME,
            },
          },
        ],
      },
    });

    return response.data.spreadsheetId;
  } catch (error) {
    console.error('Spreadsheet 생성 실패:', error);
    throw error;
  }
}

