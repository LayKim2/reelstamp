// 랭킹 카드 컴포넌트: 모바일/PC 공통 사용
'use client';

import { Category, RankingItem } from '@/app/types/ranking';
import InstagramEmbed from './InstagramEmbed';
import { Crown, Eye, Instagram } from 'lucide-react';

interface RankingCardProps {
  item: RankingItem;
  category: Category;
  isMobile?: boolean;
  getRankBadgeStyle: (rank: number) => string;
  getRankText: (rank: number) => string;
}

export default function RankingCard({
  item,
  category,
  isMobile = false,
  getRankBadgeStyle,
  getRankText,
}: RankingCardProps) {
  return (
    <div
      key={`${category}-${item.rank}`}
      className="ranking-card bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-2xl hover:scale-[1.02] hover:border-gray-300 transition-all duration-300 ease-out relative overflow-hidden flex flex-col cursor-pointer"
    >
      {/* 랭킹 배지와 제목 */}
      <div className="absolute top-18 left-5 z-10 flex items-center gap-3 max-w-[calc(100%-2.5rem)]">
        <div
          className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-md flex-shrink-0 ${getRankBadgeStyle(
            item.rank
          )}`}
        >
          {(item.rank === 1 || item.rank === 2 || item.rank === 3) && <Crown className="w-4 h-4" />}
          {getRankText(item.rank)}
        </div>
        {item.title && (
          <p className="text-lg font-medium text-white truncate drop-shadow-lg">
            {item.title}
          </p>
        )}
      </div>

      {/* 비디오 영역 */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '133.33%', height: 0, maxHeight: '400px' }}>
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <InstagramEmbed 
            url={item.instagramUrl} 
            className="w-full h-full" 
          />
        </div>
        {/* 조회수 */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-black/70 via-black/60 to-black/50 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
          <Eye className="w-4 h-4 text-white" />
          <span className="text-sm font-bold text-white tracking-tight">{item.views}</span>
        </div>
      </div>

      {/* 하단 정보 영역 */}
      <div className={`shrink-0 ${isMobile ? 'px-4 pt-3 pb-4' : 'p-4'} bg-gradient-to-b from-white via-gray-50/50 to-gray-50/30 flex flex-col gap-3 border-t border-gray-200/50`}>
        <a
          href={item.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF6B8A] text-white text-sm font-semibold rounded-lg hover:bg-[#FF5A7A] transition-all shadow-sm hover:shadow-md"
        >
          <Instagram className="w-4 h-4" />
          <span>Instagram</span>
        </a>
      </div>
    </div>
  );
}
