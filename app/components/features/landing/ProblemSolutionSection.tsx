'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * 문제-해결책 섹션: 사용자가 겪는 페인 포인트를 나열합니다.
 * 스크롤 시점에 애니메이션이 실행되도록 최적화되었습니다.
 */
export default function ProblemSolutionSection() {
  return (
    <section className="pt-16 sm:pt-20 lg:pt-24 pb-40 sm:pb-52 mb-20 sm:mb-32 bg-gradient-to-b from-white via-pink-50/30 to-white relative overflow-hidden">
      {/* 하단 화살표 그라데이션 디자인 */}
      <div className="absolute -bottom-20 sm:-bottom-32 left-0 right-0 h-[260px] sm:h-[320px] pointer-events-none">
        <svg className="w-full h-full block sm:hidden" viewBox="0 0 1920 520" preserveAspectRatio="none">
          <defs>
            <linearGradient id="arrowGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="43.89%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="100%" stopColor="rgba(255, 180, 199, 0.3)" />
            </linearGradient>
          </defs>
          <path d="M 0,0 L 1920,0 L 1920,400 L 960,520 L 0,400 Z" fill="url(#arrowGradientMobile)" />
          <path d="M 0,400 L 960,520 L 1920,400" fill="none" stroke="rgba(255, 180, 199, 0.4)" strokeWidth="2" />
        </svg>
        <svg className="w-full h-full hidden sm:block" viewBox="0 0 1920 520" preserveAspectRatio="none">
          <defs>
            <linearGradient id="arrowGradientDesktop" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="43.89%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="100%" stopColor="rgba(255, 180, 199, 0.3)" />
            </linearGradient>
          </defs>
          <path d="M 0,0 L 1920,0 L 1920,228 L 960,520 L 0,228 Z" fill="url(#arrowGradientDesktop)" />
          <path d="M 0,228 L 960,520 L 1920,228" fill="none" stroke="rgba(255, 180, 199, 0.4)" strokeWidth="2" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-xl sm:text-2xl text-gray-600 mb-3">열심히 만든 릴스, 왜 나만 안 터질까?</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            답은 편집 기술이 아니라 <br className="sm:hidden" />
            <span className="text-[#FF496D]">끝까지 보게 만드는 설계에</span> 있습니다
          </h2>
        </motion.div>

        <div className="space-y-6 sm:space-y-8 max-w-3xl sm:max-w-4xl mx-auto">
          {/* 말풍선들 - whileInView를 통해 실제 보일 때만 애니메이션 실행 */}
          <Bubble text="초반 3초, 시청자가 화면을" subText="넘기지 않게 만드는 후킹이 있나요?" label="이탈 방지" side="right" delay={0.1} />
          <Bubble text="인기 릴스 수백 개를 넘겨봤지만," subText="정작 내 영상에 바로 써먹을 소스는 못 찾으셨나요?" label="레퍼런스 분석" side="left" delay={0.2} />
          <Bubble text="어떤 장면을 먼저 보여줘야 할지 몰라" subText="편집 프로그램 앞에서 시간만 허비하고 계신가요?" label="구성능력" side="right" delay={0.3} />
          <Bubble text="지금 내 분야에서 가장 뜨거운 트렌드를" subText="1분 만에 파악할 수 있나요?" label="트렌드 추적" side="left" delay={0.4} />
        </div>
      </div>
    </section>
  );
}

function Bubble({ text, subText, label, side, delay }: { text: string, subText: string, label: string, side: 'left' | 'right', delay: number }) {
  return (
    <motion.div 
      className={`flex ${side === 'right' ? 'justify-end sm:pr-8' : 'justify-start sm:pl-4'}`}
      initial={{ opacity: 0, x: side === 'right' ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="relative bg-gray-100 rounded-2xl p-5 sm:p-6 w-[95%] sm:w-auto sm:max-w-[60%]">
        <div className="text-base sm:text-lg text-gray-900 leading-relaxed font-semibold">
          <div>{text}</div>
          <div className="flex justify-between items-center">
            <span>{subText}</span>
            <span className="text-base sm:text-lg text-gray-500 font-bold ml-4 whitespace-nowrap">{label}</span>
          </div>
        </div>
        <div className={`absolute -bottom-2 ${side === 'right' ? 'right-6' : 'left-6'} w-4 h-4 bg-gray-100 transform rotate-45`}></div>
      </div>
    </motion.div>
  );
}
