// 랭킹 페이지: 릴스 랭킹 서비스 - Supabase에서 실시간 랭킹 데이터를 가져와 표시
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Category, CATEGORY_NAMES } from '@/app/types/ranking';
import { useRankingData } from '@/app/hooks/useRankingData';
import { useTodayCreator } from '@/app/hooks/useTodayCreator';
import RankingCard from '@/app/components/ui/RankingCard';
import { Loader2 } from 'lucide-react';

// 지연 로드: "오늘의 크리에이터" 탭을 열 때만 필요
const TodayCreatorSection = dynamic(() => import('@/app/components/features/TodayCreatorSection'), {
  ssr: false,
});

type TabType = 'trend' | 'creator';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('trend');
  const [selectedCategory, setSelectedCategory] = useState<Category>('trend');

  // 오늘의 크리에이터 데이터 페칭 (탭이 'creator'일 때만 활성화)
  const { data: todayCreatorData, isLoading: isTodayCreatorLoading, error: todayCreatorError } = useTodayCreator();
  
  // 초기 로드 최적화: 선택된 카테고리만 먼저 로드, 나머지는 백그라운드에서 로드
  const { data: trendData = [], isLoading: trendLoading, error: trendError } = useRankingData('trend');
  const { data: knowledgeData = [], isLoading: knowledgeLoading, error: knowledgeError } = useRankingData('knowledge', {
    enabled: selectedCategory === 'knowledge' || (!trendLoading && trendData.length > 0), // 선택된 카테고리이거나 trend 로드 완료 후
  });
  const { data: reviewData = [], isLoading: reviewLoading, error: reviewError } = useRankingData('review', {
    enabled: selectedCategory === 'review' || (!trendLoading && trendData.length > 0), // 선택된 카테고리이거나 trend 로드 완료 후
  });

  // 지연 로딩을 위한 상태 (카테고리별로 관리)
  const [visibleCount, setVisibleCount] = useState<Record<Category, number>>({
    trend: 4,
    knowledge: 4,
    review: 4
  });
  // 카테고리별 스크롤 상태: 각 카테고리에서 사용자가 스크롤을 시작했는지 추적
  const [hasScrolledByCategory, setHasScrolledByCategory] = useState<Record<Category, boolean>>({
    trend: false,
    knowledge: false,
    review: false
  });

  // 스크롤 감지를 위한 Ref (카테고리별로 관리)
  const loaderRefs = useRef<{ [key in Category]?: HTMLDivElement | null }>({});

  // 선택된 카테고리에 맞는 데이터와 로딩/에러 상태 가져오기 (메모이제이션)
  const getCategoryData = useMemo(() => {
    const dataMap = {
      trend: { data: trendData, isLoading: trendLoading, error: trendError },
      knowledge: { data: knowledgeData, isLoading: knowledgeLoading, error: knowledgeError },
      review: { data: reviewData, isLoading: reviewLoading, error: reviewError },
    };
    return (category: Category) => dataMap[category];
  }, [trendData, trendLoading, trendError, knowledgeData, knowledgeLoading, knowledgeError, reviewData, reviewLoading, reviewError]);

  // 지연 로딩 핸들러 (메모이제이션)
  const handleLoadMore = useCallback((category: Category) => {
    // 5~8위까지 즉시 리스트에 추가 (각 카드의 InstagramEmbed가 자체 로딩을 시작함)
    setVisibleCount(prev => {
      if (prev[category] < 8) {
        return { ...prev, [category]: 8 };
      }
      return prev;
    });
  }, []);

  // 선택된 카테고리의 로딩 상태 가져오기
  const selectedCategoryData = getCategoryData(selectedCategory);
  const selectedCategoryLoading = selectedCategoryData.isLoading;

  // Intersection Observer 인스턴스 저장 (카테고리별로 관리)
  const observerRefs = useRef<{ [key in Category]?: IntersectionObserver | null }>({});

  // 스크롤 감지: 선택된 카테고리에서 사용자가 스크롤을 시작했는지 확인
  useEffect(() => {
    if (hasScrolledByCategory[selectedCategory]) return; // 이미 스크롤했으면 리스너 불필요
    
    const handleScroll = () => {
      setHasScrolledByCategory(prev => {
        if (prev[selectedCategory]) return prev; // 이미 true면 업데이트 불필요
        return { ...prev, [selectedCategory]: true };
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedCategory, hasScrolledByCategory]);

  // Intersection Observer 설정: 스크롤이 하단에 도달하면 추가 데이터 로드 (최적화)
  useEffect(() => {
    // "오늘의 트렌드" 탭이 아니거나 이미 모두 로드되었으면 Observer 정리만 수행
    if (activeTab !== 'trend' || visibleCount[selectedCategory] >= 8) {
      // 기존 Observer 정리
      const existingObserver = observerRefs.current[selectedCategory];
      if (existingObserver) {
        const currentLoader = loaderRefs.current[selectedCategory];
        if (currentLoader) {
          existingObserver.unobserve(currentLoader);
        }
        observerRefs.current[selectedCategory] = null;
      }
      return;
    }

    // 로딩 중이거나 데이터가 없으면 Observer 설정하지 않음
    if (selectedCategoryLoading || selectedCategoryData.data.length === 0) {
      return;
    }

    // 해당 카테고리에서 사용자가 스크롤을 시작하지 않았으면 Observer 설정하지 않음 (초기 로딩 시 8개 모두 로드 방지)
    if (!hasScrolledByCategory[selectedCategory]) {
      return;
    }

    // 기존 Observer가 있으면 정리
    const existingObserver = observerRefs.current[selectedCategory];
    if (existingObserver) {
      const currentLoader = loaderRefs.current[selectedCategory];
      if (currentLoader) {
        existingObserver.unobserve(currentLoader);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && visibleCount[selectedCategory] < 8) {
          handleLoadMore(selectedCategory);
        }
      },
      { threshold: 0.1 } // rootMargin 제거: 스크롤이 실제로 loaderRef에 도달했을 때만 감지
    );

    observerRefs.current[selectedCategory] = observer;

    // ref가 이미 설정되어 있으면 즉시 Observer 설정
    const currentLoader = loaderRefs.current[selectedCategory];
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      const currentLoader = loaderRefs.current[selectedCategory];
      if (currentLoader && observer) {
        observer.unobserve(currentLoader);
      }
      observerRefs.current[selectedCategory] = null;
    };
  }, [selectedCategory, visibleCount, activeTab, handleLoadMore, selectedCategoryLoading, selectedCategoryData.data.length, hasScrolledByCategory]);

  // 랭킹 배지 스타일 함수 (메모이제이션 - 컴포넌트 외부로 이동 가능하지만 현재 구조 유지)
  const getRankBadgeStyle = useCallback((rank: number) => {
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
  }, []);

  // 랭킹 배지 텍스트 (메모이제이션)
  const getRankText = useCallback((rank: number) => `${rank}위`, []);

  // 탭 전환 핸들러 (메모이제이션)
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  // 카테고리 변경 핸들러 (메모이제이션)
  const handleCategoryChange = useCallback((category: Category) => {
    setSelectedCategory(category);
  }, []);


  return (
    <div className="bg-gradient-to-b from-white to-pink-50/30 min-h-screen">
      <div className="w-full pt-8 sm:pt-12 pb-4">
        {/* HOT REELSTAMP RANKING 섹션 */}
        <section className="mb-16">
          {/* 폴더 스타일 탭 */}
          <div className="px-4 sm:px-6 lg:px-8 mb-6">
            <div className="flex border-b-2 border-pink-200/60 bg-gradient-to-r from-pink-50/40 via-orange-50/30 to-pink-50/40">
              <button
                onClick={() => handleTabChange('trend')}
                className={`px-4 sm:px-6 md:px-8 py-4 text-base sm:text-lg font-bold transition-all relative rounded-t-xl whitespace-nowrap ${
                  activeTab === 'trend'
                    ? 'text-gray-900 bg-white shadow-lg border-b-2 border-b-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-pink-50/60 hover:to-orange-50/40'
                }`}
                style={activeTab === 'trend' ? { marginBottom: '-2px', zIndex: 10 } : { zIndex: 1 }}
              >
                오늘의 트렌드
              </button>
              <button
                onClick={() => handleTabChange('creator')}
                className={`px-4 sm:px-6 md:px-8 py-4 text-base sm:text-lg font-bold transition-all relative rounded-t-xl whitespace-nowrap ${
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
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#FF6B8A] text-white shadow-md'
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
                {/* 에러 상태 */}
                {categoryError && (
                  <div className="px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <p className="text-red-500 mb-2">랭킹 데이터를 불러오는 중 오류가 발생했습니다.</p>
                    <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
                  </div>
                )}

                {/* 데이터가 없을 때 (로딩 중이 아닐 때) */}
                {!categoryLoading && !categoryError && categoryData.length === 0 && (
                  <div className="px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <p className="text-gray-500">아직 랭킹 데이터가 없습니다.</p>
                  </div>
                )}

                {/* 로딩 중이거나 데이터가 있을 때 카드 표시 */}
                {(categoryLoading || categoryData.length > 0) && (
                  <>
                    {/* 모바일: 기존 세로 패널 레이아웃 */}
                    <div className="md:hidden flex flex-col gap-4 px-4">
                      {categoryLoading 
                        ? [1, 2, 3, 4].map(rank => (
                            <div key={`loading-mobile-${rank}`} className="w-full pb-[133.33%] bg-gray-100 rounded-2xl animate-pulse relative overflow-hidden">
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                              </div>
                            </div>
                          ))
                        : categoryData.slice(0, visibleCount[category]).map((item) => (
                            <RankingCard
                              key={`${category}-${item.rank}`}
                              item={item}
                              category={category}
                              isMobile={true}
                              getRankBadgeStyle={getRankBadgeStyle}
                              getRankText={getRankText}
                            />
                          ))
                      }
                    </div>

                    {/* PC: 전체 너비 카드 레이아웃 */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4 sm:px-6 lg:px-8">
                      {categoryLoading
                        ? [1, 2, 3, 4].map(rank => (
                            <div key={`loading-pc-${rank}`} className="w-full pb-[133.33%] bg-gray-100 rounded-2xl animate-pulse relative overflow-hidden">
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                              </div>
                            </div>
                          ))
                        : categoryData.slice(0, visibleCount[category]).map((item) => (
                            <RankingCard
                              key={`${category}-${item.rank}`}
                              item={item}
                              category={category}
                              isMobile={false}
                              getRankBadgeStyle={getRankBadgeStyle}
                              getRankText={getRankText}
                            />
                          ))
                      }
                    </div>
                  </>
                )}

                {/* 지연 로딩 감지용 엘리먼트 (카테고리별 Ref 적용) */}
                {visibleCount[category] < 8 && !categoryLoading && categoryData.length > 0 && (
                  <div 
                    ref={(el) => { 
                      loaderRefs.current[category] = el;
                      // ref가 설정되면 즉시 Observer 연결
                      if (el && category === selectedCategory && activeTab === 'trend') {
                        const observer = observerRefs.current[category];
                        if (observer) {
                          // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 Observer 설정
                          setTimeout(() => {
                            if (loaderRefs.current[category] === el) {
                              observer.observe(el);
                            }
                          }, 0);
                        }
                      }
                    }}
                    className="h-10 w-full" 
                  />
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
