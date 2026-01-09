'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// 사용자 리뷰 데이터 타입
interface Review {
  name: string;
  handle: string;
  youtubeViews: string;
  instagramViews: string;
  text: string;
  highlightedNumber: string;
  profileImage?: string;
}

// 사용자 리뷰 캐러셀 컴포넌트
export default function UserReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews: Review[] = [
    {
      name: '밤하늘',
      handle: '@nightsky_piano',
      youtubeViews: '5.6만',
      instagramViews: '5953',
      text: '릴스 대본부터 영상 구성까지 잡아주니 릴스 제작 시간이 크게 줄었어요. 앞으로 인스타를 활발히 운영할 예정이라 릴스탬프를 자주 활용할 것 같습니다!',
      highlightedNumber: '',
      profileImage: '/images/night_sky.jpg',
    },
    {
      name: '앱톤 APTONE',
      handle: '@aptone_official',
      youtubeViews: '',
      instagramViews: '1.5만',
      text: '브랜드 입장에서 인플루언서에게 제품 소개 영상을 요청할 때 릴스 제작 가이드에 대한 고민이 많았는데, 릴스탬프가 좋은 방향성을 제시해주었습니다.',
      highlightedNumber: '',
      profileImage: '/images/aptone.jpg',
    },
    {
      name: 'korean teacher',
      handle: '@Koreanteacher_Sam',
      youtubeViews: '',
      instagramViews: '1.1만',
      text: '주제별 최신 트렌드까지 파악할 수 있어서 크리에이터라면 꼭 사용해야할 서비스 같습니다~!',
      highlightedNumber: '',
      profileImage: '/images/korean_teacher.jpg',
    },
    {
      name: '잭영',
      handle: '@hongik_university',
      youtubeViews: '2.8만',
      instagramViews: '6380',
      text: '릴스탬프를 사용하고 콘텐츠 제작 시간을 많이 단축했습니다! 덕분에 더 자주 업로드할 수 있을것 같아요.',
      highlightedNumber: '',
      profileImage: '/images/jack.jpg',
    },
  ];

  const nextReview = () => {
    setCurrentIndex((prev) => (prev >= reviews.length - 1 ? 0 : prev + 1));
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev <= 0 ? reviews.length - 1 : prev - 1));
  };

  const currentReview = reviews[currentIndex];

  return (
    <div className="relative flex flex-col items-center w-full max-w-7xl mx-auto">
      {/* PC: 왼쪽 아이콘, 카드, 오른쪽 아이콘을 한 줄로 배치 / 모바일: 카드만 */}
      <div className="flex items-center justify-center w-full gap-2 sm:gap-4" style={{ minHeight: '198px' }}>
        {/* PC: 왼쪽 버튼 (모바일에서는 카드 안에 배치) */}
        <button
          onClick={prevReview}
          className="hidden sm:flex flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors items-center justify-center"
          aria-label="이전 리뷰"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>

        {/* 중앙 카드 */}
        <div className="relative w-full max-w-[852px]">
          <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center px-4 py-3 sm:px-8 sm:py-4 gap-3 sm:gap-6 bg-[#F8F8FB] rounded-[20px] relative"
            style={{ minHeight: '198px' }}
          >
            {/* 모바일: 왼쪽 버튼 (카드 내부) */}
            <button
              onClick={prevReview}
              className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors flex items-center justify-center shadow-sm"
              aria-label="이전 리뷰"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            {/* 모바일: 오른쪽 버튼 (카드 내부) */}
            <button
              onClick={nextReview}
              className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors flex items-center justify-center shadow-sm"
              aria-label="다음 리뷰"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
            {/* 모바일: 왼쪽 프로필 이미지, 오른쪽 아이디/조회수 / PC: 프로필 이미지만 */}
            <div className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-0 w-full sm:w-auto sm:flex-shrink-0">
              {/* 왼쪽: 프로필 이미지 */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {currentReview.profileImage ? (
                    <Image
                      src={currentReview.profileImage}
                      alt={currentReview.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-yellow-200"></div>
                  )}
                </div>
              </div>

              {/* 모바일만: 오른쪽 아이디 및 조회수 정보 */}
              <div className="flex-1 sm:hidden flex flex-col justify-center items-start w-full self-center">
                {/* 이름과 조회수를 같은 줄에 배치 */}
                <div className="flex items-center justify-between w-full gap-2">
                  <h3 className="text-lg font-bold text-gray-700 text-left">{currentReview.name}</h3>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {currentReview.youtubeViews && (
                      <div className="flex items-center gap-1.5">
                        <Image 
                          src="/images/icon_youtube.svg" 
                          alt="YouTube" 
                          width={28} 
                          height={28} 
                          className="w-4 h-4"
                        />
                        <span className="text-base font-semibold text-gray-900">{currentReview.youtubeViews}</span>
                      </div>
                    )}
                    {currentReview.instagramViews && (
                      <div className="flex items-center gap-1.5">
                        <Image 
                          src="/images/icon_insta.svg" 
                          alt="Instagram" 
                          width={28} 
                          height={28} 
                          className="w-4 h-4"
                        />
                        <span className="text-base font-semibold text-gray-900">{currentReview.instagramViews}</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* 아이디는 아래 줄 */}
                <p className="text-sm text-gray-500 text-left mt-1">{currentReview.handle}</p>
              </div>
            </div>

            {/* 중앙: 사용자 정보 및 텍스트 */}
            <div className="flex-1 flex flex-col gap-2 w-full sm:w-auto pl-10 sm:pl-0 pr-10 sm:pr-0">
              {/* PC: 첫 번째 줄: 이름, 핸들, 그리고 오른쪽 끝에 조회수 정보 */}
              <div className="hidden sm:flex flex-row items-center w-full justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">{currentReview.name}</h3>
                  <p className="text-base text-gray-500">{currentReview.handle}</p>
                </div>
                {/* 조회수 정보 - 오른쪽 끝 정렬 */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  {currentReview.youtubeViews && (
                    <div className="flex items-center gap-2">
                      <Image 
                        src="/images/icon_youtube.svg" 
                        alt="YouTube" 
                        width={28} 
                        height={28} 
                        className="w-5 h-5"
                      />
                      <span className="text-base font-semibold text-gray-900">{currentReview.youtubeViews}</span>
                    </div>
                  )}
                  {currentReview.instagramViews && (
                    <div className="flex items-center gap-2">
                      <Image 
                        src="/images/icon_insta.svg" 
                        alt="Instagram" 
                        width={28} 
                        height={28} 
                        className="w-5 h-5"
                      />
                      <span className="text-base font-semibold text-gray-900">{currentReview.instagramViews}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* 두 번째 줄: 메인 텍스트 (모바일/PC 모두) */}
              <p className="text-base sm:text-xl text-gray-700 mt-2 sm:mt-4">
                {currentReview.highlightedNumber ? (
                  <>
                    {currentReview.text.split(currentReview.highlightedNumber)[0]}
                    <span className="text-[#FF496D]">{currentReview.highlightedNumber}</span>
                    {currentReview.text.split(currentReview.highlightedNumber)[1]}
                  </>
                ) : (
                  currentReview.text
                )}
              </p>

              {/* 모바일: 페이지네이션 도트 (카드 내부) */}
              <div 
                className="sm:hidden flex flex-row items-center justify-center px-[27px] py-4 gap-4 bg-[#F8F8FB] rounded-[30px] mt-2 mx-auto"
                style={{ width: '144px', height: '46px' }}
              >
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex
                        ? 'bg-[#FF496D]'
                        : 'bg-gray-300'
                    }`}
                    aria-label={`리뷰 ${idx + 1}로 이동`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          </AnimatePresence>
        </div>

        {/* PC: 오른쪽 버튼 (모바일에서는 카드 안에 배치) */}
        <button
          onClick={nextReview}
          className="hidden sm:flex flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors items-center justify-center"
          aria-label="다음 리뷰"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
      </div>

      {/* PC: 하단 페이지네이션 도트 (모바일에서는 카드 안에 배치) */}
      <div 
        className="hidden sm:flex flex-row items-center px-[27px] py-4 gap-4 bg-[#F8F8FB] rounded-[30px] mt-8"
        style={{ width: '144px', height: '46px' }}
      >
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === currentIndex
                ? 'bg-[#FF496D]'
                : 'bg-gray-300'
            }`}
            aria-label={`리뷰 ${idx + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
