// 오늘의 크리에이터 섹션 컴포넌트: PC 버전 레이아웃으로 크리에이터 분석 영상과 Top 3 조회수 영상 표시
// 왼쪽: 내 릴스에 올라간 분석한 크리에이터 설명 영상
// 오른쪽: 해당 크리에이터의 최대 조회수 Top 3 영상
'use client';

import InstagramEmbed from '@/app/components/ui/InstagramEmbed';
import { User, Eye, TrendingUp } from 'lucide-react';

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
  return (
    <div className="hidden lg:block py-6">
      <div className="flex gap-10 w-full px-4 sm:px-6 lg:px-8">
        {/* 왼쪽: 분석한 크리에이터 설명 카드 (강조) */}
        <div className="flex-[1.3] min-w-0">
          <div className="relative">
            {/* 카드 배경 */}
            <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 rounded-3xl shadow-2xl border-2 border-purple-400/70 hover:shadow-2xl hover:scale-[1.02] hover:border-purple-500/90 transition-all duration-300 ease-out overflow-hidden flex flex-col h-[740px] group cursor-pointer">
              {/* 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-transparent to-pink-500/5 pointer-events-none z-0"></div>
              
              {/* 상단 섹션: 오늘의 크리에이터 정보 */}
              <div className="px-7 pt-7 pb-5 shrink-0 relative z-10">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">오늘의 크리에이터</p>
                    <p className="text-2xl font-extrabold text-gray-900 leading-tight truncate">{analysisReel.title}</p>
                  </div>
                  {analysisReel.followers && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-100/80 via-pink-100/60 to-purple-100/80 rounded-xl border border-purple-200/50 shadow-sm shrink-0">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 leading-tight">팔로워</span>
                        <span className="text-sm font-bold text-gray-900 leading-tight">{analysisReel.followers}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 영상 영역 */}
              <div className="flex-1 min-h-0 relative overflow-hidden mx-4 mb-7 rounded-2xl shadow-inner border border-purple-200/30">
                <div className="absolute w-full" style={{ top: '-60px', height: 'calc(100% + 460px)' }}>
                  <InstagramEmbed 
                    url={analysisReel.url} 
                    className="w-full h-full" 
                  />
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
            {topVideos.map((video, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-2xl hover:scale-[1.02] hover:border-gray-300 transition-all duration-300 ease-out overflow-hidden flex flex-col h-[480px] group cursor-pointer">
                {/* 영상 영역 */}
                <div className="flex-1 min-h-0 overflow-hidden relative">
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <div className="absolute w-full" style={{ top: '-60px', bottom: '-60px', height: 'calc(100% + 130px)' }}>
                      <InstagramEmbed 
                        url={video.url} 
                        className="w-full h-full" 
                      />
                    </div>
                  </div>
                  {/* 조회수 - 영상 오른쪽 위 */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-black/70 via-black/60 to-black/50 rounded-xl shadow-lg border border-white/10">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white tracking-tight">{video.views}</span>
                  </div>
                  {/* 하단 오버레이 - embed 하단 부분 가리기 */}
                  <div className="absolute bottom-0 left-0 right-0 h-0 bg-white z-10 pointer-events-none"></div>
                </div>
                
                {/* 하단 정보 영역 */}
                <div className="shrink-0 p-4 bg-gradient-to-b from-white via-gray-50/50 to-gray-50/30 flex flex-col gap-3 border-t border-gray-200/50">
                  {/* 제목 - 항상 한 줄 공간 차지 */}
                  <p className="text-sm text-gray-800 leading-relaxed line-clamp-1 font-medium min-h-[1.5rem]">
                    {video.title || '\u00A0'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

