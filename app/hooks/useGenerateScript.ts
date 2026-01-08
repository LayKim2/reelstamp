// AI 대본 생성 로직을 캡슐화한 커스텀 훅
import { useMutation } from '@tanstack/react-query';
import { generateReelScript } from '@/app/lib/api/reels-creation';
import { ReelScriptRequest, ReelScriptResponse } from '@/app/types/reels-creation';
import { ApiErrorResponse, ValidationErrorResponse } from '@/app/types/api';

export function useGenerateScript() {
  return useMutation<ReelScriptResponse, ApiErrorResponse, ReelScriptRequest>({
    mutationFn: (request: ReelScriptRequest) => generateReelScript(request),
    onSuccess: (data) => {
      console.log('[Script Generation Success]', data);
    },
    onError: (error) => {
      const statusCode = error.response?.status;
      const errorData = error.response?.data;

      if (statusCode === 422) {
        // Validation Error 처리
        const validationErrors = errorData as ValidationErrorResponse;
        console.error('[Script Generation Validation Error]', validationErrors.detail);
      } else {
        console.error('[Script Generation Error]', error.message);
      }
    },
  });
}

