// 메인 랜딩 페이지: 루트 경로(/)에서 표시되는 홈 페이지
// 히어로 섹션과 주요 콘텐츠를 보여주는 랜딩 페이지
'use client';

import UserReviewCarousel from '@/app/components/ui/UserReviewCarousel';

export default function Home() {
  return (
    <div className="min-h-full">
      {/* 히어로 섹션: 메인 배너 영역 */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* 왼쪽: 텍스트 콘텐츠 */}
            <div className="flex flex-col">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
                크리에이터 여정을 더 효율적으로
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
                나만의 컨텐츠 조수, 릴스탬프
              </h1>
              <p className="text-base sm:text-lg text-gray-900 leading-relaxed mb-3">
                1분만에 완성하는 릴스 영상 기획과 대본
              </p>
              <p className="text-base sm:text-lg text-gray-900 leading-relaxed mb-8">
                검증된 성공 공식으로 내 콘텐츠 만들기
              </p>
              <div>
                <a
                  href="/contents/insta-side-job"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-all"
                >
                  무료로 시작하기
                </a>
              </div>
            </div>

            {/* 오른쪽: 영상 플레이스홀더 */}
            <div className="relative w-full aspect-video bg-white border border-gray-300 rounded-lg flex items-center justify-center">
              {/* 플레이 버튼 아이콘 - 간단한 삼각형 */}
              <svg 
                className="w-16 h-16 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" 
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 문제-해결책 섹션 */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 메인 타이틀 및 서브타이틀 */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              열심히 영상 만들어 업로드하는데, 왜 성과가 안날까?
            </h2>
            <p className="text-lg sm:text-xl text-gray-700">
              릴스의 터지는 구조에 대한 이해 부족
            </p>
          </div>

          {/* 4개 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* 카드 1 */}
            <div className="border border-gray-300 rounded-lg p-6 flex flex-col">
              {/* 이미지 공간 (위쪽) */}
              <div className="w-full aspect-video bg-white border border-gray-200 rounded mb-6 flex items-center justify-center">
                {/* 이미지가 들어갈 공간 */}
              </div>
              {/* 문제 제목 */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                내 영상 주제의 성공 레퍼런스 분석 부족
              </h3>
              {/* 해결책 설명 */}
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                주제별 수천 개 성공 데이터 학습한 릴스탬프 AI 활용하기
              </p>
            </div>

            {/* 카드 2 */}
            <div className="border border-gray-300 rounded-lg p-6 flex flex-col">
              {/* 이미지 공간 (위쪽) */}
              <div className="w-full aspect-video bg-white border border-gray-200 rounded mb-6 flex items-center justify-center">
                {/* 이미지가 들어갈 공간 */}
              </div>
              {/* 문제 제목 */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                주제별 릴스 성공 공식 내 영상에 적용 어려움
              </h3>
              {/* 해결책 설명 */}
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                버튼 한 번으로 주제별 성공 공식 내 영상에 바로 적용하기
              </p>
            </div>

            {/* 카드 3 */}
            <div className="border border-gray-300 rounded-lg p-6 flex flex-col">
              {/* 이미지 공간 (위쪽) */}
              <div className="w-full aspect-video bg-white border border-gray-200 rounded mb-6 flex items-center justify-center">
                {/* 이미지가 들어갈 공간 */}
              </div>
              {/* 문제 제목 */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                영상 소스 선별 및 흐름 구성의 어려움
              </h3>
              {/* 해결책 설명 */}
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                영상 업로드 시 썸네일부터 초단위 영상 활용 가이드 제공
              </p>
            </div>

            {/* 카드 4 */}
            <div className="border border-gray-300 rounded-lg p-6 flex flex-col">
              {/* 이미지 공간 (위쪽) */}
              <div className="w-full aspect-video bg-white border border-gray-200 rounded mb-6 flex items-center justify-center">
                {/* 이미지가 들어갈 공간 */}
              </div>
              {/* 문제 제목 */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                매일 달라지는 트렌드 따라가기 어려움
              </h3>
              {/* 해결책 설명 */}
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                매일 업데이트되는 랭킹으로 주제별 최신 트렌드 확인하기
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 인플루언서 리뷰 섹션 */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center">
            {/* 왼쪽: 프로필 이미지 */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                {/* 프로필 이미지가 들어갈 공간 */}
              </div>
            </div>

            {/* 오른쪽: 리뷰 텍스트 */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  최재욱님
                </p>
                <p className="text-base text-gray-900">
                  크리에이터 컨설턴트 대표 | 12만 팔로워 인스타 계정 보유 | 채널 대행 5개
                </p>
              </div>
              <div className="text-lg sm:text-xl text-gray-900 leading-relaxed">
                "릴스 성공 비법은 디자인 퀄리티가 아니라 기획 퀄리티에 있습니다. 릴스에는 검증된 성공 공식이 존재하며, 성과는 이 공식을 얼마나 잘 활용하느냐에 달려있습니다"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 사용자 리뷰 섹션 (캐러셀) */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserReviewCarousel />
        </div>
      </section>
    </div>
  );
}

