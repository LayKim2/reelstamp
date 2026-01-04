// 릴스 제작 관련 상수 정의

// 카테고리 매핑 (UI 표시명 → API 값)
export const REEL_CATEGORY_MAP: Record<string, 'information' | 'review' | 'vlog' | 'promo'> = {
  '일상': 'vlog',
  '지식·정보': 'information',
  '리뷰·추천': 'review',
  '서비스 소개': 'promo',
} as const;

// 영상 길이 매핑 (UI 표시명 → API 값)
export const REEL_LENGTH_MAP: Record<string, number> = {
  '30초 미만': 30,
  '30-40초': 40,
  '50-60초': 60,
} as const;

// 카테고리 옵션 목록 (UI에서 사용)
export const REEL_CATEGORY_OPTIONS = Object.keys(REEL_CATEGORY_MAP) as Array<keyof typeof REEL_CATEGORY_MAP>;

// 영상 길이 옵션 목록 (UI에서 사용)
export const REEL_LENGTH_OPTIONS = Object.keys(REEL_LENGTH_MAP) as Array<keyof typeof REEL_LENGTH_MAP>;

