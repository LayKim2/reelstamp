'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 사용자 리뷰 데이터 타입
interface Review {
  name: string;
  text1: string;
  text2: string;
  handle: string;
}

// 사용자 리뷰 캐러셀 컴포넌트
export default function UserReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  const reviews: Review[] = [
    {
      name: '김ㅇㅇ 사용자',
      text1: '"릴스탬프 사용하고',
      text2: '조회수 처음으로 10만 달성함"',
      handle: '@hahahaha',
    },
    {
      name: '김○○ 사용자',
      text1: '"릴스탬프 사용 5일만에',
      text2: '1만 조회수 달성했어요!"',
      handle: '@hahahaha',
    },
    {
      name: '이ㅇㅇ 사용자',
      text1: '"릴스탬프 추천받고',
      text2: '첫 릴스가 5만 조회수 달성!"',
      handle: '@test123',
    },
    {
      name: '박○○ 사용자',
      text1: '"기획 시간이 줄어서',
      text2: '콘텐츠 제작이 훨씬 쉬워졌어요!"',
      handle: '@user456',
    },
  ];

  // 화면 크기에 따라 표시할 카드 수 설정
  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth >= 768 ? 2 : 1);
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const maxIndex = Math.max(0, reviews.length - itemsPerPage);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="relative">
      {/* 왼쪽 버튼 */}
      <button
        onClick={prevReview}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 rounded-full bg-white border border-gray-300 shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="이전 리뷰"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>

      {/* 캐러셀 컨테이너 */}
      <div className="relative overflow-hidden">
        <motion.div
          animate={{
            x: itemsPerPage === 1
              ? `calc(-${currentIndex} * (100% + 1.5rem))`
              : `calc(-${currentIndex} * (50% + 0.75rem))`
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="flex gap-6"
        >
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 border border-gray-300 rounded-lg bg-white p-6 h-64 md:h-80 flex w-full md:w-[calc(50%-12px)]"
            >
              {/* 왼쪽 절반: 이미지 공간 (원형, 가운데 정렬) */}
              <div className="w-1/2 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-white border border-gray-300 flex items-center justify-center">
                  {/* 이미지가 들어갈 공간 */}
                </div>
              </div>
              {/* 오른쪽 절반: 텍스트 (가운데 정렬) */}
              <div className="w-1/2 flex items-center justify-center">
                <div className="flex flex-col gap-1.5">
                  <p className="text-base font-bold text-gray-900 leading-tight">
                    {review.name}
                  </p>
                  <p className="text-base text-gray-900 leading-tight">
                    {review.text1}
                  </p>
                  <p className="text-base text-gray-900 leading-tight">
                    {review.text2}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 leading-tight">
                    {review.handle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 오른쪽 버튼 */}
      <button
        onClick={nextReview}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 rounded-full bg-white border border-gray-300 shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="다음 리뷰"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>

      {/* 인디케이터 */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {Array.from({ length: itemsPerPage === 2 ? maxIndex + 1 : reviews.length }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-gray-900' : 'bg-gray-300'
            }`}
            aria-label={`리뷰 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
}

