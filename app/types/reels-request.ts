// 릴스 기획·대본 이벤트 신청 관련 타입 정의

// 폼 데이터 타입
export interface ReelsRequestFormData {
  topic: string;
  content: string;
  instagramId: string;
  videoLength?: string;
  additionalContent?: string;
  videoFile?: File;
}

// API 요청 타입
export interface ReelsRequestPayload {
  topic: string;
  content: string;
  instagramId: string;
  additionalContent?: string;
  fileName?: string;
  fileUrl?: string;
}

// API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

// Spreadsheet 행 데이터 타입
export interface SpreadsheetRow {
  timestamp: string;
  topic: string;
  content: string;
  instagramId: string;
  additionalContent: string;
  fileName: string;
  fileUrl?: string;
}

