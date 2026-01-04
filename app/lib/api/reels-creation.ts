// 릴스 제작 관련 클라이언트 사이드 API 호출 유틸리티
import { ReelScriptRequest, ReelScriptResponse } from '@/app/types/reels-creation';
import { ValidationErrorResponse } from '@/app/types/api';

/**
 * ReelScriptRequest를 FormData로 변환
 * @param request 대본 생성 요청 데이터
 */
export const createReelScriptFormData = (request: ReelScriptRequest): FormData => {
  const formData = new FormData();
  
  formData.append('reel_type', request.reel_type);
  formData.append('reel_topic', request.reel_topic);
  formData.append('user_request', request.user_request);
  
  if (request.reel_length !== null && request.reel_length !== undefined) {
    formData.append('reel_length', String(request.reel_length));
  }
  
  if (request.extra_request) {
    formData.append('extra_request', request.extra_request);
  }
  
  // 모든 비디오 파일 전송 (배열로 전송)
  if (request.video && request.video.length > 0) {
    request.video.forEach((file) => {
      formData.append('video', file);
    });
  }
  
  return formData;
};

/**
 * AI 대본 생성 API 호출 (Next.js 프록시 라우트 경유)
 * @param request 대본 생성 요청 데이터
 */
export const generateReelScript = async (request: ReelScriptRequest): Promise<ReelScriptResponse> => {
  const formData = createReelScriptFormData(request);
  // Next.js 프록시 라우트로 요청 (CORS 문제 해결)
  const response = await fetch('/api/reels-creation/generate-script', {
    method: 'POST',
    body: formData, // FormData는 Content-Type을 자동으로 설정하므로 헤더에 명시하지 않음
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Validation Error (422) 처리
    if (response.status === 422) {
      const validationError = errorData as ValidationErrorResponse;
      throw {
        response: {
          status: 422,
          data: validationError,
        },
        message: '입력 정보가 올바르지 않습니다.',
      };
    }
    
    throw {
      response: {
        status: response.status,
        data: errorData,
      },
      message: errorData.message || '대본 생성 중 오류가 발생했습니다.',
    };
  }

  const data: ReelScriptResponse = await response.json();
  return data;
};

