// 랭킹 페이지: 릴스 랭킹 서비스
'use client';

import { useState, useEffect } from 'react';
import { RankingItem, TodayReelstamper, Category, CATEGORY_NAMES } from '@/app/types/ranking';
import { RANKING_DATA_BY_CATEGORY, TODAY_REELSTAMPER_DATA } from '@/app/lib/constants/rankingData';
import InstagramEmbed from '@/app/components/ui/InstagramEmbed';
import Modal from '@/app/components/ui/Modal';
import { Crown, Eye } from 'lucide-react';

export default function RankingPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('trend');
  const [rankingData, setRankingData] = useState<RankingItem[]>(RANKING_DATA_BY_CATEGORY.trend);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 카테고리 변경 시 랭킹 데이터 업데이트
  useEffect(() => {
    setRankingData(RANKING_DATA_BY_CATEGORY[selectedCategory]);
  }, [selectedCategory]);

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

  // 서브 해시태그 가져오기
  const getSubHashtags = () => {
    return rankingData[0]?.subHashtags || [];
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4">
        {/* HOT REELSTAMP RANKING 섹션 */}
        <section className="mb-16">
          {/* 제목 */}
          <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EB48B1] to-[#F59A39] mb-6">
            HOT REELSTAMP RANKING
          </h2>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-3 mb-4">
            {Object.entries(CATEGORY_NAMES).map(([key, name]) => {
              const category = key as Category;
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
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

          {/* 서브 해시태그 */}
          {getSubHashtags().length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {getSubHashtags().map((hashtag, index) => (
                <span key={index} className="text-sm text-gray-600">
                  {hashtag}
                </span>
              ))}
            </div>
          )}

          {/* 랭킹 세로 패널 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {rankingData.map((item) => (
              <div
                key={item.rank}
                className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow relative"
                style={{ overflow: 'hidden' }}
              >
                {/* 랭킹 배지 */}
                <div
                  className={`absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-md ${getRankBadgeStyle(
                    item.rank
                  )}`}
                >
                  {item.rank === 1 && <Crown className="w-3 h-3" />}
                  {getRankText(item.rank)}
                </div>

                {/* Instagram Embed - 세로 비율 유지 */}
                <div 
                  className="w-full relative" 
                  style={{ 
                    aspectRatio: '9/16', 
                    overflow: 'hidden',
                    position: 'relative',
                    height: 'auto',
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
                    <InstagramEmbed url={item.instagramUrl} className="w-full h-full" />
                  </div>
                  
                  {/* 정보 영역 - Instagram embed 하단에 오버레이 */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pt-2 pb-3 bg-gradient-to-t from-white via-white to-transparent z-20">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600">@{item.instagramId}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        <span>{item.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TODAY'S REELSTAMPER 섹션 */}
        <section className="mb-16">
          {/* 제목 */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9B59B6] to-[#8E44AD]">
              reels
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9B59B6] to-[#8E44AD]">
              TODAY'S REELSTAMPER
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Featured (왼쪽 큰 카드) */}
            {TODAY_REELSTAMPER_DATA.filter((item) => item.isFeatured).map((item, index) => (
              <div
                key={`featured-${index}`}
                className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-full">
                  <InstagramEmbed url={item.instagramUrl} className="w-full" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">@{item.instagramId}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>{item.views}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* VIEWS #1, #2, #3 (오른쪽 작은 카드들) */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {TODAY_REELSTAMPER_DATA.filter((item) => item.viewsRank)
                .sort((a, b) => (a.viewsRank || 0) - (b.viewsRank || 0))
                .map((item, index) => (
                  <div
                    key={`views-${index}`}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow relative"
                  >
                    {/* VIEWS 배지 */}
                    <div className="absolute top-2 left-2 z-10 bg-gray-800 text-white px-2 py-1 rounded text-xs font-semibold">
                      VIEWS #{item.viewsRank}
                    </div>
                    <div className="w-full">
                      <InstagramEmbed url={item.instagramUrl} className="w-full" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-gray-600 mb-1">@{item.instagramId}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        <span>{item.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* 하단 버튼 */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white font-semibold rounded-xl hover:from-[#8E44AD] hover:to-[#7D3C98] transition-all shadow-lg hover:shadow-xl text-lg"
          >
            이런 영상 만들러 가기
          </button>
        </div>

        {/* 서비스 준비중 모달 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="서비스 준비중"
          description="곧 만나요! 릴스 제작 서비스가 곧 출시됩니다."
          buttonText="확인"
        />
      </div>
    </div>
  );
}
