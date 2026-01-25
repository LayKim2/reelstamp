// 릴스 제작 관련 타입 정의
import { ValidationErrorResponse } from './api';

// 대본 생성 요청 타입
export interface ReelScriptRequest {
  reel_type: 'information' | 'review' | 'vlog' | 'other';
  reel_topic: string;
  user_request: string;
  user_id: number; 
  reel_length?: number | null;
  extra_request?: string | null;
  video_urls?: string[] | null; // Vercel Blob URL
  video_source_mode?: 'uploaded_only' | 'uploaded_plus_new' | 'no_video';
}

// 대본 생성 Job 요청 타입
export interface ReelScriptJobRequest {
  reelType: string;
  reelTopic: string;
  userRequest: string;
  reelLength: number;
  extraRequest: string;
  videoSourceMode: 'uploaded_only' | 'uploaded_plus_new' | 'no_video';
  videoUrls: string[];
}

// 대본 세그먼트 타입
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
  sessionId?: string; // 세션 ID (챗봇 대화 API에 필요)
  revisionId?: string; // 리비전 ID (챗봇 대화 API에 필요)
  selectedStructureId?: string; // 선택된 구조 ID
  selectedStructureName?: string; // 선택된 구조 이름
  inputSummary?: {
    reelTopic: string;
    userRequest: string;
    extraRequest: string;
    videoSourceMode: string;
  }; // 입력 요약 정보 (백엔드 API 응답에 포함될 수 있음)
}

// 대본 생성 Job 응답 타입 
export interface ReelScriptJobResponse {
  jobId: string;
  status: string;
  progressPercentage: number;
}

// 챗봇 대화 요청 타입: 완성된 대본에 대해 챗봇으로 대화하기 위한 요청
export interface ChatReelScriptRequest {
  sessionId: string; // POST /ai/generate-reel-script의 response로 받은 sessionId
  editRequest: string; // 사용자 메시지 (대본에 대한 질문이나 수정 요청)
}

// 대본 수정 적용 요청 타입 (전체 대본 업데이트)
export interface ApplyReelScriptRequest {
  sessionId: string;
  parentRevisionId: string;
  suggestedChange: string;
}

// 비디오 소스 맵 타입
export interface VideoSourceMap {
  label: string;
  filename: string;
}

// 챗봇 대화 응답 타입: AI 챗봇의 대화 응답 (대본 데이터는 컨텍스트용, 실제 업데이트는 별도 API 사용)
export interface ChatReelScriptResponse {
  reelType: string;
  reelLength: string;
  finalLengthSeconds: number;
  lengthReason: string;
  sessionId: string;
  revisionId: string;
  groundingMetadata?: Record<string, unknown>;
  groundingUsed: boolean;
  videoSourceMap: VideoSourceMap[];
  revisionStatus: string;
  applyRequired: boolean;
  templates: string[];
  script: string;
  segments?: ScriptSegment[]; // 타임라인별 세그먼트 (선택적)
  revisionMode?: string; // "suggestion" 또는 기타
  applyPromptType?: string;
  suggestedChange?: string;
}

