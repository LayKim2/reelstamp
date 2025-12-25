// Google API 클라이언트 설정: 서비스 계정을 사용하여 Google Sheets API 클라이언트 초기화
import { google } from 'googleapis';

// Google Sheets API 클라이언트 초기화
export function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  return google.sheets({ version: 'v4', auth });
}

