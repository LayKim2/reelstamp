'use client';

import React from 'react';

/**
 * 4단계 릴스 메이커 섹션: 구체적인 작업 단계를 설명합니다.
 */
export default function StepReelsMakerSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xl sm:text-2xl text-gray-600 mb-3">조회수가 터지는 릴스, 이렇게 설계됩니다</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">따라만 하면 완성되는 4단계 릴스 메이커</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
          <div className="space-y-4">
            <StepCard step="01" title="타이틀" content="본문" active />
            <StepCard step="02" title="타이틀" />
            <StepCard step="03" title="타이틀" />
            <StepCard step="04" title="타이틀" />
          </div>
          <div className="bg-gray-100 rounded-xl h-full min-h-[300px] lg:min-h-0">
            {/* 플레이스홀더 영역 */}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, title, content, active = false }: { step: string, title: string, content?: string, active?: boolean }) {
  return (
    <div className={`${active ? 'bg-pink-50 border-pink-200 border-2' : 'bg-white border-gray-200 border'} rounded-xl p-6`}>
      <p className="text-sm text-gray-400 mb-2">Step {step}</p>
      <h3 className={`text-xl font-bold ${active ? 'text-pink-600' : 'text-gray-900'} mb-2`}>{title}</h3>
      {content && <p className="text-sm text-gray-500">{content}</p>}
    </div>
  );
}
