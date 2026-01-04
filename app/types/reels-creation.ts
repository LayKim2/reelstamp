// 릴스 제작 관련 타입 정의
import { ValidationErrorResponse } from './api';

// 대본 생성 요청 타입
export interface ReelScriptRequest {
  reel_type: 'information' | 'review' | 'vlog' | 'other';
  reel_topic: string;
  user_request: string;
  reel_length?: number | null;
  extra_request?: string | null;
  video?: File[] | null;
}

// 대본 세그먼트 타입 (타임라인별 구분)
export interface ScriptSegment {
  id: string;
  section: string; // 구간 (후킹, 전개 등)
  timeline: string; // 시간 (0–3s 등)
  script: string; // 대본 (나레이션 포함)
  visualSource: string; // 영상 소스 (구상 컷/촬영 제안 + 자막)
  designReason: string; // 설계 이유
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

