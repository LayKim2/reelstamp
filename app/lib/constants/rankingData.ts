// 랭킹 페이지 더미 데이터
import { RankingItem, TodayReelstamper, Category } from '@/app/types/ranking';

// 제공된 Instagram 릴스 링크
const INSTAGRAM_REELS = [
  'https://www.instagram.com/reel/DSpNdTSEcnb/',
  'https://www.instagram.com/reel/DSkEp8ykYj4/',
  'https://www.instagram.com/reel/DSe5reakTr5/',
  'https://www.instagram.com/reel/DSZ3lQ6k0vv/',
  'https://www.instagram.com/reel/DSUuTrkEyQd/',
];

// HOT REELSTAMP RANKING 더미 데이터 (트렌드·일상)
export const TREND_RANKING_DATA: RankingItem[] = [
  {
    rank: 1,
    instagramUrl: INSTAGRAM_REELS[0],
    title: '여덟 번째 릴스탬퍼, 빵빵이의 일상 🍞✨ 매일매일 새로운 도전을 하는 빵빵이를 응원해주세요!',
    instagramId: 'IDazzeogo',
    views: '1.7M',
    category: 'trend',
  },
  {
    rank: 2,
    instagramUrl: INSTAGRAM_REELS[1],
    title: '일곱 번째 릴스탬퍼, 키크니의 하루 🌟 인스타툰 작가는 저대학 선배랑!',
    instagramId: 'IDazzeogo',
    views: '1.7M',
    category: 'trend',
  },
  {
    rank: 3,
    instagramUrl: INSTAGRAM_REELS[2],
    title: '성공 크리에이터 100명 모으기 프로젝트 🎯 함께 성장하는 우리의 이야기',
    instagramId: 'IDazzeogo',
    views: '1.7M',
    category: 'trend',
  },
  {
    rank: 4,
    instagramUrl: INSTAGRAM_REELS[3],
    title: '트렌디한 일상 공유 💫 오늘도 화이팅!',
    instagramId: 'IDazzeogo',
    views: '1.7M',
    category: 'trend',
  },
  {
    rank: 5,
    instagramUrl: INSTAGRAM_REELS[4],
    title: '일상의 소소한 행복을 기록하는 중 📸',
    instagramId: 'IDazzeogo',
    views: '1.7M',
    category: 'trend',
  },
];

// 다른 카테고리용 더미 데이터 (필터링 테스트용)
export const KNOWLEDGE_RANKING_DATA: RankingItem[] = [
  {
    rank: 1,
    instagramUrl: INSTAGRAM_REELS[0],
    title: '지식 정보 제목 1',
    instagramId: 'knowledge_user1',
    views: '950K',
    category: 'knowledge',
  },
  {
    rank: 2,
    instagramUrl: INSTAGRAM_REELS[1],
    title: '지식 정보 제목 2',
    instagramId: 'knowledge_user2',
    views: '820K',
    category: 'knowledge',
  },
  {
    rank: 3,
    instagramUrl: INSTAGRAM_REELS[2],
    title: '지식 정보 제목 3',
    instagramId: 'knowledge_user3',
    views: '750K',
    category: 'knowledge',
  },
  {
    rank: 4,
    instagramUrl: INSTAGRAM_REELS[3],
    title: '지식 정보 제목 4',
    instagramId: 'knowledge_user4',
    views: '680K',
    category: 'knowledge',
  },
  {
    rank: 5,
    instagramUrl: INSTAGRAM_REELS[4],
    title: '지식 정보 제목 5',
    instagramId: 'knowledge_user5',
    views: '590K',
    category: 'knowledge',
  },
];

export const REVIEW_RANKING_DATA: RankingItem[] = [
  {
    rank: 1,
    instagramUrl: INSTAGRAM_REELS[0],
    title: '리뷰 추천 제목 1',
    instagramId: 'review_user1',
    views: '1.5M',
    category: 'review',
  },
  {
    rank: 2,
    instagramUrl: INSTAGRAM_REELS[1],
    title: '리뷰 추천 제목 2',
    instagramId: 'review_user2',
    views: '1.3M',
    category: 'review',
  },
  {
    rank: 3,
    instagramUrl: INSTAGRAM_REELS[2],
    title: '리뷰 추천 제목 3',
    instagramId: 'review_user3',
    views: '1.1M',
    category: 'review',
  },
  {
    rank: 4,
    instagramUrl: INSTAGRAM_REELS[3],
    title: '리뷰 추천 제목 4',
    instagramId: 'review_user4',
    views: '990K',
    category: 'review',
  },
  {
    rank: 5,
    instagramUrl: INSTAGRAM_REELS[4],
    title: '리뷰 추천 제목 5',
    instagramId: 'review_user5',
    views: '880K',
    category: 'review',
  },
];

// 카테고리별 데이터 매핑
export const RANKING_DATA_BY_CATEGORY: Record<Category, RankingItem[]> = {
  trend: TREND_RANKING_DATA,
  knowledge: KNOWLEDGE_RANKING_DATA,
  review: REVIEW_RANKING_DATA,
};

// TODAY'S REELSTAMPER 더미 데이터
export const TODAY_REELSTAMPER_DATA: TodayReelstamper[] = [
  {
    instagramUrl: INSTAGRAM_REELS[0],
    title: '뚝딱이형',
    instagramId: '1mincook',
    views: '1.7M',
    isFeatured: true,
  },
  {
    instagramUrl: INSTAGRAM_REELS[1],
    title: '참치마요',
    instagramId: 'IDazzeogo',
    views: '972.8만',
    viewsRank: 1,
  },
  {
    instagramUrl: INSTAGRAM_REELS[2],
    title: '',
    instagramId: 'IDazzeogo',
    views: '1.7M',
    viewsRank: 2,
  },
  {
    instagramUrl: INSTAGRAM_REELS[3],
    title: '',
    instagramId: 'IDazzeogo',
    views: '1.7M',
    viewsRank: 3,
  },
];

