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
    title: '',
    instagramId: 'IDazzeogo',
    views: '1.7M',
    category: 'trend',
    subHashtags: ['#댄스 챌린지', '#상황극', '#패러디', '#음악'],
  },
  {
    rank: 2,
    instagramUrl: INSTAGRAM_REELS[1],
    title: '',
    instagramId: 'IDazzeogo',
    views: '1.7M',
    category: 'trend',
    subHashtags: ['#댄스 챌린지', '#상황극', '#패러디', '#음악'],
  },
  {
    rank: 3,
    instagramUrl: INSTAGRAM_REELS[2],
    title: '',
    instagramId: 'IDazzeogo',
    views: '1.7M',
    category: 'trend',
    subHashtags: ['#댄스 챌린지', '#상황극', '#패러디', '#음악'],
  },
  {
    rank: 4,
    instagramUrl: INSTAGRAM_REELS[3],
    title: '',
    instagramId: 'IDazzeogo',
    views: '1.7M',
    category: 'trend',
    subHashtags: ['#댄스 챌린지', '#상황극', '#패러디', '#음악'],
  },
  {
    rank: 5,
    instagramUrl: INSTAGRAM_REELS[4],
    title: '',
    instagramId: 'IDazzeogo',
    views: '1.7M',
    category: 'trend',
    subHashtags: ['#댄스 챌린지', '#상황극', '#패러디', '#음악'],
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
    subHashtags: ['#팁', '#정보', '#노하우'],
  },
  {
    rank: 2,
    instagramUrl: INSTAGRAM_REELS[1],
    title: '지식 정보 제목 2',
    instagramId: 'knowledge_user2',
    views: '820K',
    category: 'knowledge',
    subHashtags: ['#팁', '#정보', '#노하우'],
  },
  {
    rank: 3,
    instagramUrl: INSTAGRAM_REELS[2],
    title: '지식 정보 제목 3',
    instagramId: 'knowledge_user3',
    views: '750K',
    category: 'knowledge',
    subHashtags: ['#팁', '#정보', '#노하우'],
  },
  {
    rank: 4,
    instagramUrl: INSTAGRAM_REELS[3],
    title: '지식 정보 제목 4',
    instagramId: 'knowledge_user4',
    views: '680K',
    category: 'knowledge',
    subHashtags: ['#팁', '#정보', '#노하우'],
  },
  {
    rank: 5,
    instagramUrl: INSTAGRAM_REELS[4],
    title: '지식 정보 제목 5',
    instagramId: 'knowledge_user5',
    views: '590K',
    category: 'knowledge',
    subHashtags: ['#팁', '#정보', '#노하우'],
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
    subHashtags: ['#리뷰', '#추천', '#후기'],
  },
  {
    rank: 2,
    instagramUrl: INSTAGRAM_REELS[1],
    title: '리뷰 추천 제목 2',
    instagramId: 'review_user2',
    views: '1.3M',
    category: 'review',
    subHashtags: ['#리뷰', '#추천', '#후기'],
  },
  {
    rank: 3,
    instagramUrl: INSTAGRAM_REELS[2],
    title: '리뷰 추천 제목 3',
    instagramId: 'review_user3',
    views: '1.1M',
    category: 'review',
    subHashtags: ['#리뷰', '#추천', '#후기'],
  },
  {
    rank: 4,
    instagramUrl: INSTAGRAM_REELS[3],
    title: '리뷰 추천 제목 4',
    instagramId: 'review_user4',
    views: '990K',
    category: 'review',
    subHashtags: ['#리뷰', '#추천', '#후기'],
  },
  {
    rank: 5,
    instagramUrl: INSTAGRAM_REELS[4],
    title: '리뷰 추천 제목 5',
    instagramId: 'review_user5',
    views: '880K',
    category: 'review',
    subHashtags: ['#리뷰', '#추천', '#후기'],
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

