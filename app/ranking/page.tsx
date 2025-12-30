// 랭킹 페이지: 릴스 랭킹 서비스 - Supabase에서 실시간 랭킹 데이터를 가져와 표시
'use client';

import { useState, useEffect } from 'react';
import { Category, CATEGORY_NAMES } from '@/app/types/ranking';
import { useRankingData } from '@/app/hooks/useRankingData';
import { useTodayCreator } from '@/app/hooks/useTodayCreator';
import InstagramEmbed from '@/app/components/ui/InstagramEmbed';
import { Crown, Eye, Instagram, Loader2 } from 'lucide-react';
import TodayCreatorSection from '@/app/components/features/TodayCreatorSection';

type TabType = 'trend' | 'creator';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('trend');
  const [selectedCategory, setSelectedCategory] = useState<Category>('trend');
  
  // 오늘의 크리에이터 데이터 페칭
  const { data: todayCreatorData, isLoading: isTodayCreatorLoading, error: todayCreatorError } = useTodayCreator();
  
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

  // Instagram embed 미리 처리: 페이지 로드 시 모든 URL을 숨겨진 컨테이너에 미리 생성하고 처리
  // 이벤트 기반으로 스크립트 로드 완료 감지 (setInterval 제거)
  useEffect(() => {
    // 모든 카테고리의 URL 수집
    const allUrls = [
      ...trendData.map(item => item.instagramUrl),
      ...(todayCreatorData ? [
        todayCreatorData.analysisReel.url,
        ...todayCreatorData.topVideos.map(v => v.url)
      ] : []),
      ...knowledgeData.map(item => item.instagramUrl),
      ...reviewData.map(item => item.instagramUrl),
      
    ].filter(Boolean);

    if (allUrls.length === 0) return;

    // Instagram 스크립트가 로드되면 모든 embed 미리 처리
    const preloadEmbeds = () => {
      if (typeof window === 'undefined' || !(window as any).instgrm) {
        return false;
      }

      // 숨겨진 컨테이너 생성
      let preloadContainer = document.getElementById('instagram-preload-container');
      if (!preloadContainer) {
        preloadContainer = document.createElement('div');
        preloadContainer.id = 'instagram-preload-container';
        preloadContainer.style.position = 'absolute';
        preloadContainer.style.left = '-9999px';
        preloadContainer.style.top = '-9999px';
        preloadContainer.style.width = '1px';
        preloadContainer.style.height = '1px';
        preloadContainer.style.overflow = 'hidden';
        preloadContainer.style.visibility = 'hidden';
        preloadContainer.style.pointerEvents = 'none';
        document.body.appendChild(preloadContainer);
      }

      // 모든 URL에 대해 blockquote 생성 (병렬 처리 최적화: DocumentFragment 사용)
      const fragment = document.createDocumentFragment();
      const newBlockquotes: HTMLElement[] = [];
      
      allUrls.forEach((url) => {
        const existingBlockquote = preloadContainer?.querySelector(`[data-preload-url="${url}"]`);
        if (existingBlockquote) return; // 이미 생성됨

        const blockquote = document.createElement('blockquote');
        blockquote.className = 'instagram-media';
        blockquote.setAttribute('data-instgrm-permalink', url);
        blockquote.setAttribute('data-instgrm-version', '14');
        blockquote.setAttribute('data-preload-url', url);
        blockquote.style.display = 'none';
        
        fragment.appendChild(blockquote);
        newBlockquotes.push(blockquote);
      });

      // DocumentFragment를 한 번에 DOM에 추가 (성능 최적화)
      if (preloadContainer && newBlockquotes.length > 0) {
        preloadContainer.appendChild(fragment);
      }

      // Instagram 스크립트로 모든 embed 병렬 처리
      // Instagram 스크립트가 내부적으로 모든 blockquote를 병렬로 처리합니다
      if (newBlockquotes.length > 0) {
        try {
          (window as any).instgrm.Embeds.process();
        } catch (error) {
          // 에러 무시 (이미 처리되었을 수 있음)
        }
      }

      return true;
    };

    // 스크립트가 이미 로드되었으면 즉시 처리
    if ((window as any).__instagramScriptLoaded || (window as any).instgrm) {
      preloadEmbeds();
      return;
    }

    // 스크립트 로드 이벤트 리스너 (이벤트 기반 - setInterval 제거)
    const handleScriptLoad = () => {
      preloadEmbeds();
    };

    window.addEventListener('instagram-script-loaded', handleScriptLoad);

    // 폴백: 이벤트가 누락될 경우를 대비한 짧은 체크 (1회)
    const fallbackTimeout = setTimeout(() => {
      if ((window as any).instgrm) {
        preloadEmbeds();
      }
    }, 500);

    return () => {
      window.removeEventListener('instagram-script-loaded', handleScriptLoad);
      clearTimeout(fallbackTimeout);
    };
  }, [trendData, knowledgeData, reviewData, todayCreatorData]);

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
            {/* 로딩 상태 */}
            {isTodayCreatorLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            )}

            {/* 에러 상태 */}
            {todayCreatorError && (
              <div className="px-4 sm:px-6 lg:px-8 py-12 text-center">
                <p className="text-red-500">오늘의 크리에이터 데이터를 불러오는 중 오류가 발생했습니다.</p>
              </div>
            )}

            {/* 데이터 없음 */}
            {!isTodayCreatorLoading && !todayCreatorError && !todayCreatorData && (
              <div className="px-4 sm:px-6 lg:px-8 py-12 text-center">
                <p className="text-gray-500">오늘의 크리에이터 데이터가 없습니다.</p>
              </div>
            )}

            {/* 데이터 표시 */}
            {!isTodayCreatorLoading && !todayCreatorError && todayCreatorData && (
              <TodayCreatorSection
                analysisReel={todayCreatorData.analysisReel}
                topVideos={todayCreatorData.topVideos}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
