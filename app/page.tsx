// 메인 랜딩 페이지: 루트 경로(/)에서 표시되는 홈 페이지
// 각 섹션은 최적화를 위해 기능별 컴포넌트로 분리되었습니다.

import React from 'react';
import dynamic from 'next/dynamic';
import HeroSection from './components/features/landing/HeroSection';

/**
 * [최적화] 아래 섹션들은 초기 로딩 속도 향상을 위해 dynamic import를 사용합니다.
 * 사용자가 스크롤을 내릴 때 필요한 컴포넌트만 로드하여 초기 번들 크기를 줄이고 로딩 성능을 개선합니다.
 */

const ProblemSolutionSection = dynamic(() => import('./components/features/landing/ProblemSolutionSection'));
const AlgorithmLogicSection = dynamic(() => import('./components/features/landing/AlgorithmLogicSection'));
const ClickOnceSection = dynamic(() => import('./components/features/landing/ClickOnceSection'));
const StepReelsMakerSection = dynamic(() => import('./components/features/landing/StepReelsMakerSection'));
const UserReviewCarousel = dynamic(() => import('./components/ui/UserReviewCarousel'));
const PricingSection = dynamic(() => import('./components/features/landing/PricingSection'));
const BottomCTASection = dynamic(() => import('./components/features/landing/BottomCTASection'));

/**
 * 홈 페이지 메인 컴포넌트
 */
export default function Home() {
  return (
    <>
      {/* 1. 히어로 섹션: 즉시 로드 (LCP 최적화) */}
      <HeroSection />

      {/* 2. 문제-해결책 섹션: 지연 로드 */}
      <ProblemSolutionSection />

      {/* 3. 알고리즘 로직 섹션: 지연 로드 */}
      <AlgorithmLogicSection />

      {/* 4. 클릭 한 번 섹션: 지연 로드 */}
      <ClickOnceSection />

      {/* 5. 4단계 릴스 메이커 섹션: 지연 로드 */}
      <StepReelsMakerSection />

      {/* 6. 사용자 리뷰 섹션: 지연 로드 및 CSR 최적화 */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserReviewCarousel />
        </div>
      </section>

      {/* 7. 플랜 섹션: 지연 로드 */}
      <PricingSection />

      {/* 8. 마지막 CTA 섹션: 지연 로드 */}
      <BottomCTASection />
    </>
  );
}
