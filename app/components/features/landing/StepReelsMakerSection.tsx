'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: '100만뷰 릴스 시나리오 제작하기',
    content: '릴스에 담고 싶은 내용과 영상을 자유롭게 입력하면 100만뷰 기반의 대본·영상 시나리오가 생성됩니다.',
    image: '/images/step1.png'
  },
  {
    step: '02',
    title: '릴스 챗봇으로 바로 수정하기',
    content: '시나리오에서 수정이 필요한 부분을 말하면, 릴스 챗봇이 대화에 따라 수정안을 즉시 반영합니다.',
    image: '/images/step22.png'
  },
  {
    step: '03',
    title: '오늘의 릴스 트렌드 확인',
    content: '누구보다 빠르게 트렌드를 반영할 수 있도록, 오늘의 주제별 인기 릴스를 한눈에 확인하세요.',
    image: '/images/step3.png'
  },
  {
    step: '04',
    title: '업로드하고 빠르게 성장하기',
    content: '완성된 시나리오와 트렌드를 활용해 릴스를 제작해 업로드하세요. 릴스탬프와 함께 빠르게 성장하세요!',
    image: '/images/step44.png'
  }
];

/**
 * 4단계 릴스 메이커 섹션: 구체적인 작업 단계를 설명합니다.
 */
export default function StepReelsMakerSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xl sm:text-2xl text-gray-600 mb-3 font-medium">조회수가 터지는 릴스, 이렇게 설계됩니다</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#373A46] tracking-tight">
            따라만 하면 완성되는 <span className="text-[#FF496D]">4단계 릴스 메이커</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Step 카드 리스트 */}
          <div className="space-y-3 order-2 lg:order-1">
            {steps.map((item, index) => (
              <StepCard 
                key={item.step}
                step={item.step}
                title={item.title}
                content={item.content}
                active={activeStep === index}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>

          {/* 이미지 표시 영역 */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[600px] w-full bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src={steps[activeStep].image}
                  alt={steps[activeStep].title}
                  fill
                  className="object-cover object-top"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StepCardProps {
  step: string;
  title: string;
  content: string;
  active: boolean;
  onClick: () => void;
}

function StepCard({ step, title, content, active, onClick }: StepCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`cursor-pointer rounded-3xl p-6 transition-all duration-300 border-2 ${
        active 
          ? 'bg-white border-[#FF496D] shadow-xl translate-x-2' 
          : 'bg-transparent border-transparent hover:bg-gray-100/50'
      }`}
      whileHover={!active ? { x: 5 } : {}}
    >
      <div className="flex items-start gap-5">
        <span className={`text-xl font-black ${active ? 'text-[#FF496D]' : 'text-gray-300'}`}>
          {step}
        </span>
        <div className="flex-1">
          <h3 className={`text-xl sm:text-2xl font-bold mb-3 transition-colors ${active ? 'text-[#373A46]' : 'text-gray-400'}`}>
            {title}
          </h3>
          <AnimatePresence initial={false}>
            {active && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
