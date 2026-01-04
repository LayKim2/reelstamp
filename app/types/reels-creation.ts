// 릴스 제작 관련 타입 정의
import { ValidationErrorResponse } from './api';

// 대본 생성 요청 타입
export interface ReelScriptRequest {
  reel_type: 'information' | 'review' | 'vlog' | 'promo';
  reel_topic: string;
  user_request: string;
  reel_length?: number | null;
  extra_request?: string | null;
  video?: File[] | null;
}

// 대본 세그먼트 타입 (타임라인별 구분)
export interface ScriptSegment {
  id: string;
  section: string; // 후킹, 문제, 해결책 등
  timeline: string; // "0-2", "3-5" 등
  script: string; // 대본 내용
  screenDesign: {
    screen: string; // 화면 설명
    subtitle?: string; // 자막 내용
  };
}

// 대본 생성 응답 타입
export interface ReelScriptResponse {
  reelType: string;
  reelLength: string;
  finalLengthSeconds: number;
  lengthReason: string;
  templates: string[];
  script: string; // 전체 대본 (하위 호환성)
  segments?: ScriptSegment[]; // 타임라인별 세그먼트 (새 구조)
}

