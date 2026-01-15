'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * 마지막 CTA 섹션: 페이지 하단에서 전환을 유도합니다.
 */
export default function BottomCTASection() {
  return (
    <section className="relative bg-gradient-to-b from-white to-pink-50/30 py-20 sm:py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none sm:hidden" style={{ bottom: '0', opacity: 0.4, background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 180, 199, 0.5))' }}>
        <span className="text-[150px] font-bold whitespace-nowrap" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, lineHeight: '150%', letterSpacing: '-0.05em', color: '#FFFFFF' }}>Reelstamp</span>
      </div>
      <div className="hidden sm:flex absolute inset-0 items-end justify-center pointer-events-none" style={{ bottom: '0', opacity: 0.5, width: '100%', height: '675px', background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 180, 199, 0.6))' }}>
        <span className="text-[250px] md:text-[350px] lg:text-[450px] font-bold whitespace-nowrap" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontStyle: 'normal', fontWeight: 700, fontSize: '450px', lineHeight: '150%', letterSpacing: '-0.05em', color: '#FFFFFF' }}>Reelstamp</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
          <p className="text-xl sm:text-2xl text-gray-700">이미 N명의 크리에이터가 <span className="sm:hidden"><br /></span>릴스탬프로 시간을 아끼고 있습니다</p>
          <Link
            href="/contents/script-creation"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg sm:text-xl font-bold text-white rounded-full transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, #FF496D 0%, #FFB4C7 100%)', borderRadius: '135px' }}
          >
            지금 무료로 릴스탬프 시작하기
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
          <Link
            href="https://forms.gle/Sp2nQE9L7yx7k99b6"
            target="_blank"
            rel="noopener noreferrer"
            className="alarm-button inline-flex items-center justify-center gap-2 px-8 py-4 text-lg sm:text-xl font-bold text-white rounded-full transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, #A9A9A9 0%, #D4D4D4 100%)', borderRadius: '135px' }}
          >
            서비스 정식 출시 알람 신청하기
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}
