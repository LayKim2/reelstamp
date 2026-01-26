'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * 알고리즘 로직 섹션: 릴스탬프의 핵심 가치를 설명합니다.
 */
export default function AlgorithmLogicSection() {
  const cards = [
    { src: '/images/landing_AO1.png', title: '100만뷰 구조', text: '수만 개의 성공 릴스 데이터 반영', delay: 0.1 },
    { src: '/images/landing_AO2.png', title: '대본 마스터', text: '시청자의 스크롤을 멈추게 할 대본', delay: 0.2, mt: true },
    { src: '/images/landing_AO3.png', title: '전환율 최적화', text: '댓글과 공유를 부르는 심리적 트리거 삽입', delay: 0.3 },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-xl sm:text-2xl text-gray-600 mb-3">
            그래서 릴스탬프는<br className="sm:hidden" /> 잘나가는 릴스들에 숨겨진 공통점을 추출했습니다
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            클릭 한 번으로 조회수를 보장하는 알고리즘 로직
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-start gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <motion.div 
              key={index}
              className={`bg-gray-50 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center w-full md:w-auto md:min-w-[280px] ${card.mt ? 'md:mt-8' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: card.delay }}
            >
              <div className="w-40 h-40 sm:w-48 sm:h-48 mb-4 flex items-center justify-center">
                <img src={card.src} alt={card.title} className="w-full h-full object-contain" loading="lazy" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-nowrap">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
