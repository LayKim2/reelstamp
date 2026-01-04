// 메인 랜딩 페이지: 루트 경로(/)에서 표시되는 홈 페이지
// 히어로 섹션과 주요 콘텐츠를 보여주는 랜딩 페이지
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import UserReviewCarousel from '@/app/components/ui/UserReviewCarousel';

export default function Home() {
  return (
    <div className="min-h-full overflow-x-hidden">
      {/* 히어로 섹션: 메인 배너 영역 */}
      <section className="relative bg-white overflow-visible py-20 sm:py-20 md:py-28 lg:py-40 xl:py-48 sm:min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center pb-16 sm:pb-16">
            {/* 배경 워터마크: Reelstamp */}
            {/* 모바일용 배경 타이포 */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none sm:hidden"
              style={{
                top: '60%',
                opacity: 0.25,
                left: 0,
                right: 0,
              }}
            >
              <span 
                className="text-[150px] font-bold whitespace-nowrap"
                style={{ 
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 700,
                  lineHeight: '150%',
                  letterSpacing: '-0.05em',
                  background: 'linear-gradient(to bottom, #FFFFFF, #FFB4C7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Reelstamp
              </span>
            </div>
            {/* PC용 배경 타이포 */}
            <div 
              className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none"
              style={{
                top: '30%',
                opacity: 0.25,
                left: 0,
                right: 0,
              }}
            >
              <span 
                className="text-[250px] md:text-[350px] lg:text-[450px] font-bold whitespace-nowrap"
                style={{ 
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 700,
                  lineHeight: '150%',
                  letterSpacing: '-0.05em',
                  background: 'linear-gradient(to bottom, #FFFFFF, #FFB4C7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Reelstamp
              </span>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="relative z-10 flex flex-col items-center max-w-4xl w-full px-4 -mt-4 sm:-mt-8">
              {/* 메인 타이틀 */}
              <motion.h1 
                className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 sm:mb-8 px-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <span className="text-gray-900">당신의 릴스 성공 공식,</span>
                <br className="sm:hidden" />
                <span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#EB48B1] to-[#F59A39]"
                  style={{ color: '#FF496D' }}
                >
                  릴스탬프
                </span>
              </motion.h1>

              {/* 서브타이틀 */}
              <motion.div 
                className="mb-8 sm:mb-12 space-y-2 sm:space-y-3 px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">
                  밤새 고민하던 릴스 기획과 대본,
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">
                  이제 검증된 알고리즘 공식으로 1분 만에 끝내세요!
                </p>
              </motion.div>

              {/* CTA 버튼 */}
              <motion.a
                href="/contents/script-creation"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg sm:text-xl font-bold text-white rounded-full transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(90deg, #FF496D 0%, #FFB4C7 100%)',
                  borderRadius: '135px',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="whitespace-nowrap">지금 무료로 시작하기</span>
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* 문제-해결책 섹션 */}
      <section className="pt-16 sm:pt-20 lg:pt-24 pb-40 sm:pb-52 mb-20 sm:mb-32 bg-gradient-to-b from-white via-pink-50/30 to-white relative overflow-visible">
        {/* 하단 화살표 그라데이션 디자인 */}
        <div className="absolute -bottom-20 sm:-bottom-32 left-0 right-0 h-[260px] sm:h-[320px] pointer-events-none">
          {/* 모바일용 */}
          <svg 
            className="w-full h-full block sm:hidden" 
            viewBox="0 0 1920 520" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="arrowGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                <stop offset="43.89%" stopColor="rgba(255, 255, 255, 0.3)" />
                <stop offset="100%" stopColor="rgba(255, 180, 199, 0.3)" />
              </linearGradient>
            </defs>
            {/* 위쪽 사각형 + 아래를 가리키는 화살표 형태 */}
            <path 
              d="M 0,0 L 1920,0 L 1920,400 L 960,520 L 0,400 Z" 
              fill="url(#arrowGradientMobile)"
            />
            <path 
              d="M 0,400 L 960,520 L 1920,400" 
              fill="none"
              stroke="rgba(255, 180, 199, 0.4)"
              strokeWidth="2"
            />
          </svg>
          {/* PC용 */}
          <svg 
            className="w-full h-full hidden sm:block" 
            viewBox="0 0 1920 520" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="arrowGradientDesktop" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                <stop offset="43.89%" stopColor="rgba(255, 255, 255, 0.3)" />
                <stop offset="100%" stopColor="rgba(255, 180, 199, 0.3)" />
              </linearGradient>
            </defs>
            {/* 위쪽 사각형 + 아래를 가리키는 화살표 형태 */}
            <path 
              d="M 0,0 L 1920,0 L 1920,228 L 960,520 L 0,228 Z" 
              fill="url(#arrowGradientDesktop)"
            />
            <path 
              d="M 0,228 L 960,520 L 1920,228" 
              fill="none"
              stroke="rgba(255, 180, 199, 0.4)"
              strokeWidth="2"
            />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* 메인 타이틀 및 서브타이틀 */}
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-base sm:text-lg text-gray-600 mb-3">
              열심히 만든 릴스, 왜 나만 안 터질까?
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              답은 편집 기술이 아니라{' '}
              <br className="sm:hidden" />
              <span className="text-[#FF496D]">끝까지 보게 만드는 설계에</span> 있습니다
            </h2>
          </motion.div>

          {/* 대화형 말풍선 레이아웃 */}
          <div className="space-y-6 sm:space-y-8 max-w-3xl sm:max-w-4xl mx-auto">
            {/* 말풍선 1: 이탈 방지 (오른쪽) */}
            <motion.div 
              className="flex justify-end sm:justify-end sm:pr-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative bg-gray-100 rounded-2xl p-5 sm:p-6 w-[95%] sm:w-auto sm:max-w-[45%]">
                <div className="text-sm sm:text-base text-gray-900 leading-relaxed">
                  <div>초반 3초, 시청자가 화면을</div>
                  <div className="flex justify-between items-center">
                    <span>넘기지 않게 만드는 후킹이 있나요?</span>
                    <span className="text-sm sm:text-base text-gray-500 font-medium ml-4 whitespace-nowrap">이탈 방지</span>
                  </div>
                </div>
                {/* 말풍선 꼬리 (오른쪽) */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-gray-100 transform rotate-45"></div>
              </div>
            </motion.div>

            {/* 말풍선 2: 레퍼런스 분석 (왼쪽) */}
            <motion.div 
              className="flex justify-start sm:justify-start sm:pl-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative bg-gray-100 rounded-2xl p-5 sm:p-6 w-[95%] sm:w-auto sm:max-w-[55%]">
                <div className="text-sm sm:text-base text-gray-900 leading-relaxed">
                  <div>인기 릴스 수백 개를 넘겨봤지만,</div>
                  <div className="flex justify-between items-center">
                    <span>정작 내 영상에 바로 써먹을 소스는 못 찾으셨나요?</span>
                    <span className="text-sm sm:text-base text-gray-500 font-medium ml-4 whitespace-nowrap">레퍼런스 분석</span>
                  </div>
                </div>
                {/* 말풍선 꼬리 (왼쪽) */}
                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-gray-100 transform rotate-45"></div>
              </div>
            </motion.div>

            {/* 말풍선 3: 구성능력 (오른쪽) */}
            <motion.div 
              className="flex justify-end sm:justify-end sm:pr-12"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative bg-gray-100 rounded-2xl p-5 sm:p-6 w-[95%] sm:w-auto sm:max-w-[48%]">
                <div className="text-sm sm:text-base text-gray-900 leading-relaxed">
                  <div>어떤 장면을 먼저 보여줘야 할지 몰라</div>
                  <div className="flex justify-between items-center">
                    <span>편집 프로그램 앞에서 시간만 허비하고 계신가요?</span>
                    <span className="text-sm sm:text-base text-gray-500 font-medium ml-4 whitespace-nowrap">구성능력</span>
                  </div>
                </div>
                {/* 말풍선 꼬리 (오른쪽) */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-gray-100 transform rotate-45"></div>
              </div>
            </motion.div>

            {/* 말풍선 4: 트렌드 추적 (왼쪽) */}
            <motion.div 
              className="flex justify-start sm:justify-start sm:pl-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="relative bg-gray-100 rounded-2xl p-5 sm:p-6 w-[95%] sm:w-auto sm:max-w-[52%]">
                <div className="text-sm sm:text-base text-gray-900 leading-relaxed">
                  <div>지금 내 분야에서 가장 뜨거운 트렌드를</div>
                  <div className="flex justify-between items-center">
                    <span>1분 만에 파악할 수 있나요?</span>
                    <span className="text-sm sm:text-base text-gray-500 font-medium ml-4 whitespace-nowrap">트렌드 추적</span>
                  </div>
                </div>
                {/* 말풍선 꼬리 (왼쪽) */}
                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-gray-100 transform rotate-45"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 알고리즘 로직 섹션 */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-sm sm:text-base text-gray-600 mb-3">
              그래서 릴스탬프는<br className="sm:hidden" /> 잘나가는 릴스들에 숨겨진 공통점을 추출했습니다
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              클릭 한 번으로 조회수를 보장하는 알고리즘 로직
            </h2>
          </motion.div>

          {/* 3개 기능 카드 */}
          <div className="flex flex-col md:flex-row justify-center items-start gap-6 lg:gap-8">
            {/* 카드 1: 검증된 포맷 */}
            <motion.div 
              className="bg-gray-50 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center w-full md:w-auto md:min-w-[280px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-40 h-40 sm:w-48 sm:h-48 mb-4 flex items-center justify-center">
                <img 
                  src="/images/landing_AO1.svg" 
                  alt="검증된 포맷" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                검증된 포맷
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-nowrap">
                수만 개의 상위 노출 영상 분석 결과 반영
              </p>
            </motion.div>

            {/* 카드 2: 후킹 마스터 */}
            <motion.div 
              className="bg-gray-50 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center w-full md:w-auto md:min-w-[280px] md:mt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-40 h-40 sm:w-48 sm:h-48 mb-4 flex items-center justify-center">
                <img 
                  src="/images/landing_AO2.svg" 
                  alt="후킹 마스터" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                후킹 마스터
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-nowrap">
                시청자를 멈추게 할 강력한 오프닝 제안
              </p>
            </motion.div>

            {/* 카드 3: 전환율 최적화 */}
            <motion.div 
              className="bg-gray-50 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center w-full md:w-auto md:min-w-[280px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-40 h-40 sm:w-48 sm:h-48 mb-4 flex items-center justify-center">
                <img 
                  src="/images/landing_AO3.svg" 
                  alt="전환율 최적화" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                전환율 최적화
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-nowrap">
                댓글과 공유를 부르는 심리적 트리거 삽입
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 클릭 한 번 섹션 */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* 상단 텍스트 */}
            <motion.div 
              className="mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <p className="text-base sm:text-lg text-gray-600 mb-2">
                3시간의 고민을 10분의 확신으로
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                고민의 마침표를 찍는 단 한 번의 클릭
              </h2>
            </motion.div>

            {/* Reelstamp 이미지 - 이미지 내부 텍스트가 중앙에 오도록 조정 */}
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              <div 
                className="relative"
                style={{ 
                  transform: 'translateX(15%)' // 이미지 내부 텍스트가 중앙에 오도록 오른쪽으로 이동
                }}
              >
                <img 
                  src="/images/landing_AE.svg" 
                  alt="Reelstamp" 
                  className="w-full max-w-md sm:max-w-lg lg:max-w-xl h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4단계 릴스 메이커 섹션 */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sm sm:text-base text-gray-600 mb-3">
              조회수가 터지는 릴스, 이렇게 설계됩니다
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              따라만 하면 완성되는 4단계 릴스 메이커
            </h2>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
            {/* 왼쪽: Step 카드 영역 */}
            <div className="space-y-4">
              {/* Step 01 - 활성화된 상태 (핑크 배경) */}
              <div className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
                <p className="text-sm text-gray-400 mb-2">Step 01</p>
                <h3 className="text-xl font-bold text-pink-600 mb-2">타이틀</h3>
                <p className="text-sm text-gray-500">본문</p>
              </div>

              {/* Step 02 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-sm text-gray-400 mb-2">Step 02</p>
                <h3 className="text-xl font-bold text-gray-900">타이틀</h3>
              </div>

              {/* Step 03 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-sm text-gray-400 mb-2">Step 03</p>
                <h3 className="text-xl font-bold text-gray-900">타이틀</h3>
              </div>

              {/* Step 04 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-sm text-gray-400 mb-2">Step 04</p>
                <h3 className="text-xl font-bold text-gray-900">타이틀</h3>
              </div>
            </div>

            {/* 오른쪽: 플레이스홀더 영역 */}
            <div className="bg-gray-100 rounded-xl h-full min-h-[300px] lg:min-h-0">
              {/* 플레이스홀더 - 나중에 추가 예정 */}
            </div>
          </div>
        </div>
      </section>

      {/* 사용자 리뷰 섹션 (캐러셀) */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <UserReviewCarousel />
        </motion.div>
      </section>

      {/* 플랜 섹션 */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sm sm:text-base text-gray-600 mb-3">
              성장을 위한 가장 확실한 투자
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              조회수가 터지는 습관, 릴스탬프 플랜
            </h2>
          </div>

          {/* 플랜 카드 영역 */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 lg:gap-8">
            {/* 플레이스홀더 카드 1 */}
            <div className="w-full md:w-auto md:flex-1 max-w-md h-64 sm:h-80 bg-gray-100 rounded-2xl"></div>
            
            {/* 플레이스홀더 카드 2 */}
            <div className="w-full md:w-auto md:flex-1 max-w-md h-64 sm:h-80 bg-gray-100 rounded-2xl"></div>
            
            {/* 플레이스홀더 카드 3 */}
            <div className="w-full md:w-auto md:flex-1 max-w-md h-64 sm:h-80 bg-gray-100 rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* 마지막 CTA 섹션 */}
      <section className="relative bg-gradient-to-b from-white to-pink-50/30 py-20 sm:py-28 lg:py-40 overflow-visible">
        {/* 배경 타이포: Reelstamp */}
        {/* 모바일용 배경 타이포 */}
        <div 
          className="absolute inset-0 flex items-end justify-center pointer-events-none sm:hidden"
          style={{
            bottom: '-100px',
            opacity: 0.4,
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 180, 199, 0.5))',
          }}
        >
          <span 
            className="text-[150px] font-bold whitespace-nowrap"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 700,
              lineHeight: '150%',
              letterSpacing: '-0.05em',
              color: '#FFFFFF',
            }}
          >
            Reelstamp
          </span>
        </div>
        {/* PC용 배경 타이포 */}
        <div 
          className="hidden sm:flex absolute inset-0 items-end justify-center pointer-events-none"
          style={{
            bottom: '-250px',
            opacity: 0.5,
            width: '2098px',
            height: '675px',
            left: 'calc(50% - 2098px / 2)',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 180, 199, 0.6))',
          }}
        >
          <span 
            className="text-[250px] md:text-[350px] lg:text-[450px] font-bold whitespace-nowrap"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '450px',
              lineHeight: '150%',
              letterSpacing: '-0.05em',
              color: '#FFFFFF',
            }}
          >
            Reelstamp
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
            {/* 상단 텍스트 */}
            <p className="text-base sm:text-lg text-gray-700">
              이미 N명의 크리에이터가{' '}
              <span className="sm:hidden"><br /></span>
              릴스탬프로 시간을 아끼고 있습니다
            </p>

            {/* CTA 버튼 */}
            <Link
              href="/contents/script-creation"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg sm:text-xl font-bold text-white rounded-full transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(90deg, #FF496D 0%, #FFB4C7 100%)',
                borderRadius: '135px',
              }}
            >
              지금 무료로 릴스탬프 시작하기
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

