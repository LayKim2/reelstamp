'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * 히어로 섹션: 메인 배너 영역
 * 페이지 진입 시 가장 먼저 보이는 영역으로 즉시 로드됩니다.
 */
export default function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden py-20 sm:py-20 md:py-28 lg:py-40 xl:py-48 sm:min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center pb-16 sm:pb-16">
          {/* 배경 워터마크: Reelstamp */}
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none sm:hidden"
            style={{ top: '60%', opacity: 0.25, left: 0, right: 0 }}
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
          <div 
            className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none"
            style={{ top: '30%', opacity: 0.25, left: 0, right: 0 }}
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

          <div className="relative z-10 flex flex-col items-center max-w-4xl w-full px-4 -mt-4 sm:-mt-8">
            <motion.h1 
              className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 sm:mb-8 px-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="text-gray-900">100만 릴스 제작 파트너,</span>
              <br className="sm:hidden" />
              <span className="text-[#FF496D]">릴스탬프</span>
            </motion.h1>

            <motion.div 
              className="mb-8 sm:mb-12 space-y-2 sm:space-y-3 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">
                밤새 고민하던 릴스 대본과 영상,
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">
                이제 검증된 알고리즘 공식으로 1분 만에 만드세요!
              </p>
            </motion.div>

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
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
