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

