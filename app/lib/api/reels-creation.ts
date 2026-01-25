// 릴스 제작 관련 클라이언트 사이드 API 호출 유틸리티
import { ReelScriptRequest, ReelScriptResponse, ReelScriptJobRequest, ReelScriptJobResponse, ChatReelScriptRequest, ChatReelScriptResponse, ApplyReelScriptRequest } from '@/app/types/reels-creation';
import { ValidationErrorResponse } from '@/app/types/api';
import { sanitizeFilename } from '@/app/lib/utils/filename';

/**
 * ReelScriptRequest를 FormData로 변환
 * @param request 대본 생성 요청 데이터
 */
export const createReelScriptFormData = (request: ReelScriptRequest): FormData => {
  const formData = new FormData();
  
  formData.append('reel_type', request.reel_type);
  formData.append('reel_topic', request.reel_topic);
  formData.append('user_request', request.user_request);
  formData.append('user_id', String(request.user_id)); 
  
  if (request.reel_length !== null && request.reel_length !== undefined) {
    formData.append('reel_length', String(request.reel_length));
  }
  
  if (request.extra_request) {
    formData.append('extra_request', request.extra_request);
  }
  
  if (request.video_source_mode) {
    formData.append('video_source_mode', request.video_source_mode);
  }
  
  // Vercel Blob URL 전송
  if (request.video_urls && request.video_urls.length > 0) {
    // Vercel Blob URL을 각각 개별적으로 전송
    request.video_urls.forEach((url) => {
      formData.append('videos_url', url);
    });
  }
  
  return formData;
};

/**
 * 영상 파일을 Vercel Blob에 직접 업로드 (클라이언트 업로드 방식)
 * 클라이언트에서 직접 업로드하여 서버 부하를 줄이고 대용량 파일(400MB+) 지원
 * @param files 업로드할 영상 파일 배열
 * @returns 업로드된 URL 배열
 */
export const uploadVideosToBlob = async (files: File[]): Promise<string[]> => {
  // @vercel/blob/client의 upload 함수를 동적으로 import
  const { upload } = await import('@vercel/blob/client');

  const uploadPromises = files.map(async (file) => {
    try {
      const sanitizedName = sanitizeFilename(file.name);
      const sanitizedFile = new File([file], sanitizedName, { type: file.type });
      
      const blob = await upload(sanitizedName, sanitizedFile, {
        access: 'public',
        handleUploadUrl: '/api/upload-video',
      });

      return blob.url;
    } catch (error: any) {
      console.error('[Video Upload Error]', error?.message);
      throw {
        response: {
          status: error.status || 500,
          data: error.data || {},
        },
        message: error.message || '영상 업로드 중 오류가 발생했습니다.',
      };
    }
  });

  const urls = await Promise.all(uploadPromises);
  return urls;
};

/**
 * AI 대본 생성 Job API 호출 (Next.js 프록시 라우트 경유)
 * @param request 대본 생성 요청 데이터
 */
export const generateReelScript = async (request: ReelScriptRequest): Promise<ReelScriptJobResponse> => {
  // ReelScriptRequest를 ReelScriptJobRequest 형식으로 변환
  const jobRequest: ReelScriptJobRequest = {
    reelType: request.reel_type,
    reelTopic: request.reel_topic,
    userRequest: request.user_request,
    reelLength: request.reel_length || 0,
    extraRequest: request.extra_request || '',
    videoSourceMode: request.video_source_mode || 'no_video',
    videoUrls: request.video_urls || [],
  };

  // Next.js 프록시 라우트로 요청 (CORS 문제 해결)
  const response = await fetch('/ai/generate-reel-script-job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobRequest),
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

  const data: ReelScriptJobResponse = await response.json();
  return data;
};

/**
 * AI 챗봇 대화 API 호출: 완성된 대본에 대해 챗봇으로 대화하기 위한 API
 * 실제 대본 업데이트는 별도 API를 사용해야 함
 * @param request 챗봇 대화 요청 데이터 (sessionId, revisionId, editRequest)
 */
export const chatReelScript = async (request: ChatReelScriptRequest): Promise<ChatReelScriptResponse> => {
  // Next.js 프록시 라우트로 요청 (CORS 문제 해결)
  const response = await fetch('/ai/revise-reel-script', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
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
      message: errorData.message || '챗봇 대화 중 오류가 발생했습니다.',
    };
  }

  const data: ChatReelScriptResponse = await response.json();
  return data;
};

/**
 * 최근 생성된 대본 정보 조회 API 호출
 * @param sessionId 세션 ID
 */
export const getLatestReelScript = async (sessionId: string): Promise<ReelScriptResponse> => {
  // Next.js 프록시 라우트로 요청
  const response = await fetch(`/ai/latest-reel-script?sessionId=${sessionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      response: {
        status: response.status,
        data: errorData,
      },
      message: errorData.message || '최신 대본 정보를 가져오는 중 오류가 발생했습니다.',
    };
  }

  const data: ReelScriptResponse = await response.json();
  return data;
};

/**
 * AI 대본 수정 제안 적용 API 호출 (전체 대본 업데이트)
 * @param request 수정 적용 요청 데이터
 */
export const applyReelScript = async (request: ApplyReelScriptRequest): Promise<ChatReelScriptResponse> => {
  const response = await fetch('/ai/revise-reel-script-full', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      response: {
        status: response.status,
        data: errorData,
      },
      message: errorData.message || '대본 수정 적용 중 오류가 발생했습니다.',
    };
  }

  const data: ChatReelScriptResponse = await response.json();
  return data;
};

