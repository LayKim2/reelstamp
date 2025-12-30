// 랭킹 페이지: 릴스 랭킹 서비스 - Supabase에서 실시간 랭킹 데이터를 가져와 표시
'use client';

import { useState } from 'react';
import { Category, CATEGORY_NAMES } from '@/app/types/ranking';
import { useRankingData } from '@/app/hooks/useRankingData';
import InstagramEmbed from '@/app/components/ui/InstagramEmbed';
import { Crown, Eye, Instagram, Loader2 } from 'lucide-react';
import TodayCreatorSection from '@/app/components/features/TodayCreatorSection';

type TabType = 'trend' | 'creator';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('trend');
  const [selectedCategory, setSelectedCategory] = useState<Category>('trend');
  
  // 모든 카테고리의 데이터를 미리 가져오기 (DOM 유지를 위해)
  const { data: trendData = [], isLoading: trendLoading, error: trendError } = useRankingData('trend');
  const { data: knowledgeData = [], isLoading: knowledgeLoading, error: knowledgeError } = useRankingData('knowledge');
  const { data: reviewData = [], isLoading: reviewLoading, error: reviewError } = useRankingData('review');

  // 선택된 카테고리에 맞는 데이터와 로딩/에러 상태 가져오기
  const getCategoryData = (category: Category) => {
    switch (category) {
      case 'trend':
        return { data: trendData, isLoading: trendLoading, error: trendError };
      case 'knowledge':
        return { data: knowledgeData, isLoading: knowledgeLoading, error: knowledgeError };
      case 'review':
        return { data: reviewData, isLoading: reviewLoading, error: reviewError };
    }
  };

  // 랭킹 배지 스타일 함수 (이미지 기준: 1위 핑크/로즈골드, 2위 실버, 3위 브론즈, 4-5위 다크 그레이)
  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-[#FF69B4] via-[#FFA500] to-[#FFD700] text-white';
      case 2:
        return 'bg-gradient-to-br from-[#C0C0C0] to-[#A0A0A0] text-black';
      case 3:
        return 'bg-gradient-to-br from-[#CD7F32] to-[#A0522D] text-white';
      default:
        return 'bg-gray-700 text-white';
    }
  };

  // 랭킹 배지 텍스트
  const getRankText = (rank: number) => {
    return `${rank}위`;
  };

  // 카드 렌더링 함수 (모바일)
  const renderMobileCard = (item: any, category: Category) => (
    <div
      key={`${category}-${item.rank}`}
      className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-2xl hover:scale-[1.02] hover:border-gray-300 transition-all duration-300 ease-out relative h-[580px] overflow-hidden flex flex-col cursor-pointer"
    >
      {/* 랭킹 배지 */}
      <div
        className={`absolute top-18 left-5 z-10 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-md ${getRankBadgeStyle(
          item.rank
        )}`}
      >
        {(item.rank === 1 || item.rank === 2 || item.rank === 3) && <Crown className="w-4 h-4" />}
        {getRankText(item.rank)}
      </div>

      {/* 비디오 영역 - flex-1 min-h-0으로 남은 공간 차지 */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <InstagramEmbed url={item.instagramUrl} className="w-full h-full" />
        </div>
        {/* 조회수 - 영상 오른쪽 아래 */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-black/70 via-black/60 to-black/50 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
          <Eye className="w-4 h-4 text-white" />
          <span className="text-sm font-bold text-white tracking-tight">{item.views}</span>
        </div>
      </div>

      {/* 하단 정보 영역 - shrink-0로 고정 */}
      <div className="shrink-0 px-4 pt-3 pb-4 bg-gradient-to-b from-white via-gray-50/50 to-gray-50/30 flex flex-col gap-3 border-t border-gray-200/50">
        {/* 제목 - 항상 한 줄 공간 차지 */}
        <p className="text-sm text-gray-800 leading-relaxed line-clamp-1 font-medium min-h-[1.5rem]">
          {item.title || '\u00A0'}
        </p>

        {/* Instagram 버튼 */}
        <a
          href={item.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#EB48B1] to-[#F59A39] text-white text-sm font-semibold rounded-lg hover:from-[#D93D9F] hover:to-[#E6892F] transition-all shadow-sm hover:shadow-md"
        >
          <Instagram className="w-4 h-4" />
          <span>Instagram</span>
        </a>
      </div>
    </div>
  );

  // 카드 렌더링 함수 (PC)
  const renderPCCard = (item: any, category: Category) => (
    <div
      key={`${category}-${item.rank}`}
      className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-2xl hover:scale-[1.02] hover:border-gray-300 transition-all duration-300 ease-out relative h-[650px] overflow-hidden flex flex-col cursor-pointer"
    >
      {/* 랭킹 배지 */}
      <div
        className={`absolute top-18 left-5 z-10 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-md ${getRankBadgeStyle(
          item.rank
        )}`}
      >
        {(item.rank === 1 || item.rank === 2 || item.rank === 3) && <Crown className="w-4 h-4" />}
        {getRankText(item.rank)}
      </div>

      {/* 비디오 영역 - flex-1 min-h-0으로 남은 공간 차지 */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <InstagramEmbed url={item.instagramUrl} className="w-full h-full" />
        </div>
        {/* 조회수 - 영상 오른쪽 아래 */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-black/70 via-black/60 to-black/50 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
          <Eye className="w-4 h-4 text-white" />
          <span className="text-sm font-bold text-white tracking-tight">{item.views}</span>
        </div>
      </div>

      {/* 하단 정보 영역 - shrink-0로 고정 */}
      <div className="shrink-0 p-4 bg-gradient-to-b from-white via-gray-50/50 to-gray-50/30 flex flex-col gap-3 border-t border-gray-200/50">
        {/* 제목 - 항상 한 줄 공간 차지 */}
        <p className="text-sm text-gray-800 leading-relaxed line-clamp-1 font-medium min-h-[1.5rem]">
          {item.title || '\u00A0'}
        </p>

        {/* Instagram 버튼 */}
        <a
          href={item.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#EB48B1] to-[#F59A39] text-white text-sm font-semibold rounded-lg hover:from-[#D93D9F] hover:to-[#E6892F] transition-all shadow-sm hover:shadow-md"
        >
          <Instagram className="w-4 h-4" />
          <span>Instagram</span>
        </a>
      </div>
    </div>
  );


  return (
    <div className="bg-gradient-to-br from-pink-50/30 via-white to-orange-50/30 min-h-screen">
      <div className="w-full pt-8 sm:pt-12 pb-4">
        {/* HOT REELSTAMP RANKING 섹션 */}
        <section className="mb-16">
          {/* 폴더 스타일 탭 */}
          <div className="px-4 sm:px-6 lg:px-8 mb-6">
            <div className="flex border-b-2 border-pink-200/60 bg-gradient-to-r from-pink-50/40 via-orange-50/30 to-pink-50/40">
              <button
                onClick={() => setActiveTab('trend')}
                className={`px-4 sm:px-6 md:px-8 py-4 text-sm sm:text-base font-bold transition-all relative rounded-t-xl whitespace-nowrap ${
                  activeTab === 'trend'
                    ? 'text-gray-900 bg-white shadow-lg border-b-2 border-b-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-pink-50/60 hover:to-orange-50/40'
                }`}
                style={activeTab === 'trend' ? { marginBottom: '-2px', zIndex: 10 } : { zIndex: 1 }}
              >
                오늘의 트랜드
              </button>
              <button
                onClick={() => setActiveTab('creator')}
                className={`px-4 sm:px-6 md:px-8 py-4 text-sm sm:text-base font-bold transition-all relative rounded-t-xl whitespace-nowrap ${
                  activeTab === 'creator'
                    ? 'text-gray-900 bg-white shadow-lg border-b-2 border-b-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-pink-50/60 hover:to-orange-50/40'
                }`}
                style={activeTab === 'creator' ? { marginBottom: '-2px', zIndex: 10 } : { zIndex: 1 }}
              >
                오늘의 크리에이터
              </button>
            </div>
          </div>

          {/* 탭 콘텐츠 - 모두 렌더링하여 리로드 방지 */}
          <div className={activeTab === 'trend' ? 'block' : 'hidden'}>
            {/* 카테고리 필터 */}
            <div className="flex flex-nowrap gap-2 sm:gap-3 mb-4 px-4 sm:px-6 lg:px-8 overflow-x-auto">
            {Object.entries(CATEGORY_NAMES).map(([key, name]) => {
              const category = key as Category;
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#EB48B1] to-[#F59A39] text-white shadow-md'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {/* 각 카테고리별로 DOM 유지 (display로 토글) */}
          {(['trend', 'knowledge', 'review'] as Category[]).map((category) => {
            const { data: categoryData = [], isLoading: categoryLoading, error: categoryError } = getCategoryData(category);
            const isSelected = selectedCategory === category;

            return (
              <div
                key={category}
                className={isSelected ? 'block' : 'hidden'}
              >
                {/* 로딩 상태 */}
                {categoryLoading && (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                    <span className="ml-3 text-gray-600">랭킹 데이터를 불러오는 중...</span>
                  </div>
                )}

                {/* 에러 상태 */}
                {categoryError && (
                  <div className="px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <p className="text-red-500 mb-2">랭킹 데이터를 불러오는 중 오류가 발생했습니다.</p>
                    <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
                  </div>
                )}

                {/* 데이터가 없을 때 */}
                {!categoryLoading && !categoryError && categoryData.length === 0 && (
                  <div className="px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <p className="text-gray-500">아직 랭킹 데이터가 없습니다.</p>
                  </div>
                )}

                {/* 모바일: 기존 세로 패널 레이아웃 */}
                {!categoryLoading && !categoryError && categoryData.length > 0 && (
                  <div className="md:hidden grid grid-cols-1 gap-4">
                    {categoryData.map((item) => renderMobileCard(item, category))}
                  </div>
                )}

                {/* PC: 전체 너비 카드 레이아웃 */}
                {!categoryLoading && !categoryError && categoryData.length > 0 && (
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4 sm:px-6 lg:px-8">
                    {categoryData.map((item) => renderPCCard(item, category))}
                  </div>
                )}
              </div>
            );
          })}
          </div>

          <div className={activeTab === 'creator' ? 'block' : 'hidden'}>
            {/* PC 버전: 오늘의 크리에이터 레이아웃 */}
            <TodayCreatorSection
              analysisReel={{
                url: 'https://www.instagram.com/p/DSPhk8CEd7V/',
                title: '뚝딱이형',
                instagramId: '1mincook',
                views: '1.7M',
                followers: '1.2M',
              }}
              topVideos={[
                {
                  url: 'https://www.instagram.com/p/DSPhk8CEd7V/',
                  views: '972.8만',
                  title: '제목 어쩌고 저쩌고',
                  instagramId: 'IDazzeogo',
                  viewCount: '1.7M',
                },
                {
                  url: 'https://www.instagram.com/p/DSPhk8CEd7V/',
                  views: '972.8만',
                  title: '제목 어쩌고 저쩌고',
                  instagramId: 'IDazzeogo',
                  viewCount: '1.7M',
                },
                {
                  url: 'https://www.instagram.com/p/DSPhk8CEd7V/',
                  views: '972.8만',
                  title: '제목 어쩌고 저쩌고',
                  instagramId: 'IDazzeogo',
                  viewCount: '1.7M',
                },
              ]}
            />

            {/* 모바일 버전: 임시 메시지 */}
            <div className="lg:hidden px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">오늘의 크리에이터 콘텐츠가 곧 추가됩니다.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
