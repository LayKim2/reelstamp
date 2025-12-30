// Supabase 데이터베이스 타입 정의: reels_exports 테이블 타입
export interface ReelsExport {
  id: string; // UUID
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
  account: string; // 인스타그램 계정
  category: string; // 카테고리 (trend, knowledge, review)
  shortcode: string; // 릴스 shortcode
  url: string; // Instagram URL
  views: number; // 조회수 (bigint)
  title: string | null; // 제목 (nullable)
}

// creators 테이블 타입
export interface Creator {
  id: string; // UUID
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
  name: string; // 크리에이터 이름
  instagram_id: string; // 인스타그램 ID
  analysis_reel_shortcode: string; // 분석 영상 shortcode
  followers: string | null; // 팔로워 수 (nullable)
}

// creator_reels 테이블 타입
export interface CreatorReel {
  id: string; // UUID
  creator_id: string; // UUID (creators.id 참조)
  shortcode: string; // Instagram shortcode
  views: string; // 조회수 숫자 (문자열, 예: "4500000") - 표시 시 K/M으로 포맷팅
  title: string | null; // 영상 제목 (nullable)
  instagram_id: string; // 인스타그램 ID
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
}

