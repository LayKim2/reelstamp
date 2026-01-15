'use client';

import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

interface SatisfactionSurveyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SatisfactionSurvey({ isOpen, onClose }: SatisfactionSurveyProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [positives, setPositives] = useState('');
  const [negatives, setNegatives] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 팝업이 열렸을 때 body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // 스크롤 복원
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // 컴포넌트 언마운트 시 스크롤 복원
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = () => {
    if (rating === 0) {
      alert('별점을 선택해주세요');
      return;
    }
    // 여기서 실제 제출 로직 처리
    console.log({
      rating,
      positives,
      negatives
    });
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setRating(0);
    setPositives('');
    setNegatives('');
    onClose();
  };

  if (!isOpen) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        {/* 배경 이미지 - 실제 이미지 경로로 변경 필요 */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-pink-50 to-orange-50"
          style={{
            backgroundImage: 'url(/images/background-survey.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }}
        />
        <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">감사합니다!</h2>
          <p className="text-gray-600 mb-6">소중한 의견 감사드립니다. 더 나은 서비스로 보답하겠습니다.</p>
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            type="button"
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* 만족도 조사 모달 */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="닫기"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 제목 */}
        <h2 className="text-2xl font-bold text-center mb-2">만족도 조사</h2>
        <p className="text-gray-600 text-center mb-6">릴스탬프를 사용해주셔서 감사합니다</p>

        {/* 별점 평가 */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-3 text-center">
            서비스 만족도를 평가해주세요
          </label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
                type="button"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-orange-400 text-orange-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 좋았던 점 */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            좋았던 점
          </label>
          <textarea
            value={positives}
            onChange={(e) => setPositives(e.target.value)}
            placeholder="릴스탬프를 사용하면서 좋았던 점을 알려주세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* 아쉬웠던 점 */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            아쉬웠던 점
          </label>
          <textarea
            value={negatives}
            onChange={(e) => setNegatives(e.target.value)}
            placeholder="개선되었으면 하는 점을 알려주세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="w-full text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FF496D' }}
            type="button"
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
}
