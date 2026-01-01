'use client';

import { useRef } from 'react';
import InstagramEmbed from '@/app/components/ui/InstagramEmbed';
import { Eye, Crown } from 'lucide-react';

interface TodayCreatorSectionProps {
  // 분석 릴스 영상 정보 (내가 분석한 크리에이터)
  analysisReel: {
    url: string;
    title: string;
    instagramId: string;
    views: string;
    followers?: string;
  };
  // 크리에이터의 Top 3 조회수 영상
  topVideos: Array<{
    url: string;
    views: string;
    title: string;
    instagramId: string;
    viewCount: string;
  }>;
}

export default function TodayCreatorSection({ analysisReel, topVideos }: TodayCreatorSectionProps) {
  // 모바일 가로 스크롤 컨테이너 ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // embed 영역에서 터치 이벤트 처리하여 스크롤 제어
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // 가로 이동이 세로 이동보다 크면 스크롤 처리
      if (Math.abs(deltaX) > Math.abs(deltaY) && scrollContainerRef.current) {
        e.preventDefault();
        scrollContainerRef.current.scrollLeft = scrollLeft - deltaX;
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <>
      {/* 모바일 버전: 세로 레이아웃 */}
      <div className="lg:hidden py-6">
        <div className="w-full px-4 sm:px-6">
          {/* 메인 크리에이터 소개 영상 카드 */}
          <div className="mb-8">
            <div className="relative">
              <div className="bg-gradient-to-br from-white via-red-50/20 to-red-50/15 rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden flex flex-col group cursor-pointer hover:border-red-600 transition-all duration-300">
                {/* 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/3 pointer-events-none z-0"></div>
                
                {/* 상단 섹션: 오늘의 크리에이터 정보 */}
                <div className="px-5 pt-5 pb-4 shrink-0 relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">오늘의 크리에이터</p>
                      <p className="text-xl font-extrabold text-gray-900 leading-tight truncate">{analysisReel.title}</p>
                    </div>
                    {analysisReel.followers && (
                      <div className="shrink-0 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/60 shadow-sm">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-0.5">팔로워</p>
                          <p className="text-sm font-bold text-gray-900">{analysisReel.followers}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 영상 영역 - 높이 계산식 적용 */}
                <div className="flex-1 min-h-0 relative overflow-hidden mx-4 mb-5 rounded-2xl shadow-inner border border-red-300/40">
                  <div className="relative w-full overflow-hidden" style={{ paddingBottom: '120%', height: 0 }}>
                    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ top: '-60px', height: 'calc(100% + 60px)' }}>
                      <InstagramEmbed 
                        url={analysisReel.url} 
                        className="w-full h-full" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 섹션 구분선 및 헤더 */}
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-bold text-gray-900">조회수 Top 3</h3>
                <p className="text-xs text-gray-500">이 크리에이터의 인기 영상</p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
          </div>

          {/* Top 3 영상 가로 스크롤 (peek 효과) */}
          <div className="overflow-hidden -mx-4 sm:-mx-6 px-4 sm:px-6">
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
              style={{ 
                scrollbarWidth: 'thin',
                WebkitOverflowScrolling: 'touch', // iOS에서 부드러운 스크롤
              }}
            >
              {topVideos.map((video, index) => {
                const rank = index + 1;
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
                return (
                  <div 
                    key={index} 
                    className="relative flex-shrink-0"
                    style={{ 
                      width: '85vw',
                      maxWidth: '320px',
                    }}
                  >
                    <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-2xl hover:scale-[1.02] hover:border-gray-300 transition-all duration-300 ease-out overflow-hidden flex flex-col cursor-pointer">
                      {/* 영상 영역 - 9:16 비율로 제한하여 하단 UI 숨김 */}
                      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '120%', height: 0 }}>
                        {/* 랭킹 배지와 제목 - 비디오 영역 위에 오버레이 */}
                        <div className="absolute top-4 left-5 z-30 flex items-center gap-3 max-w-[calc(100%-2.5rem)]">
                          <div
                            className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-md flex-shrink-0 ${getRankBadgeStyle(rank)}`}
                          >
                            <Crown className="w-4 h-4" />
                            {`${rank}위`}
                          </div>
                          {video.title && (
                            <p className="text-base font-medium text-white truncate drop-shadow-lg">
                              {video.title}
                            </p>
                          )}
                        </div>
                        <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ top: '-60px', height: 'calc(100% + 60px)' }}>
                          <InstagramEmbed 
                            url={video.url} 
                            className="w-full h-full" 
                          />
                        </div>
                        {/* 조회수 - 영상 오른쪽 아래 */}
                        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-black/70 via-black/60 to-black/50 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
                          <Eye className="w-4 h-4 text-white" />
                          <span className="text-sm font-bold text-white tracking-tight">{video.views || video.viewCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* PC 버전: 가로 레이아웃 */}
      <div className="hidden lg:block py-6">
        <div className="flex gap-10 w-full px-4 sm:px-6 lg:px-8">
          {/* 왼쪽: 분석한 크리에이터 설명 카드 (강조) */}
          <div className="flex-[1.3] min-w-0">
            <div className="relative">
              {/* 카드 배경 */}
              <div className="bg-gradient-to-br from-white via-red-50/20 to-red-50/15 rounded-3xl shadow-2xl border-2 border-red-500 hover:shadow-2xl hover:scale-[1.02] hover:border-red-600 transition-all duration-300 ease-out overflow-hidden flex flex-col group cursor-pointer">
                {/* 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/3 pointer-events-none z-0"></div>
                
                {/* 상단 섹션: 오늘의 크리에이터 정보 */}
                <div className="px-7 pt-7 pb-5 shrink-0 relative z-10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1.5">오늘의 크리에이터</p>
                      <p className="text-2xl font-extrabold text-gray-900 leading-tight truncate">{analysisReel.title}</p>
                    </div>
                    {analysisReel.followers && (
                      <div className="shrink-0 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/60 shadow-sm">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-0.5">팔로워</p>
                          <p className="text-sm font-bold text-gray-900">{analysisReel.followers}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 영상 영역 - 높이 계산식 적용 */}
                <div className="flex-1 min-h-0 relative overflow-hidden mx-4 mb-7 rounded-2xl shadow-inner border border-red-300/40">
                  <div className="relative w-full overflow-hidden" style={{ paddingBottom: '120%', height: 0 }}>
                    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ top: '-60px', height: 'calc(100% + 60px)' }}>
                      <InstagramEmbed 
                        url={analysisReel.url} 
                        className="w-full h-full" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: Top 3 조회수 영상 섹션 */}
          <div className="flex-[2.7]">
            {/* 섹션 헤더 */}
            <div className="mb-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1">조회수 Top 3</h3>
              <p className="text-sm text-gray-500">이 크리에이터의 인기 영상</p>
            </div>
            
            {/* Top 3 영상 그리드 */}
            <div className="grid grid-cols-3 gap-6">
              {topVideos.map((video, index) => {
                const rank = index + 1;
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
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-2xl hover:scale-[1.02] hover:border-gray-300 transition-all duration-300 ease-out overflow-hidden flex flex-col cursor-pointer">
                    {/* 영상 영역 - 9:16 비율로 제한하여 하단 UI 숨김 */}
                    <div className="relative w-full overflow-hidden" style={{ paddingBottom: '120%', height: 0 }}>
                      {/* 랭킹 배지와 제목 - 비디오 영역 위에 오버레이 */}
                      <div className="absolute top-4 left-5 z-30 flex items-center gap-3 max-w-[calc(100%-2.5rem)]">
                        <div
                          className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-md flex-shrink-0 ${getRankBadgeStyle(rank)}`}
                        >
                          <Crown className="w-4 h-4" />
                          {`${rank}위`}
                        </div>
                        {video.title && (
                          <p className="text-lg font-medium text-white truncate drop-shadow-lg">
                            {video.title}
                          </p>
                        )}
                      </div>
                      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ top: '-50px', height: 'calc(100% + 50px)' }}>
                        <InstagramEmbed 
                          url={video.url} 
                          className="w-full h-full" 
                        />
                      </div>
                      {/* 조회수 - 영상 오른쪽 아래 */}
                      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-black/70 via-black/60 to-black/50 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
                        <Eye className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold text-white tracking-tight">{video.views || video.viewCount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
