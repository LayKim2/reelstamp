// 랭킹 페이지 관련 타입 정의

// 카테고리 타입
export type Category = 'trend' | 'knowledge' | 'review';

// 카테고리 한글 이름 매핑
export const CATEGORY_NAMES: Record<Category, string> = {
  trend: '#트렌드·일상',
  knowledge: '#지식·정보',
  review: '#리뷰·추천',
};

// 서브 해시태그 타입
export interface SubHashtag {
  text: string;
  category: Category;
}

// 랭킹 아이템 타입
export interface RankingItem {
  rank: number; // 순위 (1-5)
  instagramUrl: string; // Instagram 릴스 URL
  title: string; // 제목
  instagramId: string; // 인스타그램 ID
  views: string; // 조회수 (예: "1.7M", "52K")
  category: Category; // 카테고리
  subHashtags?: string[]; // 서브 해시태그 배열 (선택)
}

// TODAY'S REELSTAMPER 아이템 타입
export interface TodayReelstamper {
  instagramUrl: string; // Instagram 릴스 URL
  title: string; // 제목
  instagramId: string; // 인스타그램 ID
  views: string; // 조회수
  isFeatured?: boolean; // featured 여부
  viewsRank?: number; // VIEWS 순위 (#1, #2, #3)
}

