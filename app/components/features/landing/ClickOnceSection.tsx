'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * 클릭 한 번 섹션: 빠른 결과 도출을 시각적으로 강조합니다.
 */
export default function ClickOnceSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            className="mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-2xl sm:text-3xl text-gray-600 mb-2">3시간의 고민을 10분의 확신으로</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">고민의 마침표를 찍는 단 한 번의 클릭</h2>
          </motion.div>

          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="relative" style={{ transform: 'translateX(15%)' }}>
              <img src="/images/landing_AE.svg" alt="Reelstamp" className="w-full max-w-md sm:max-w-lg lg:max-w-xl h-auto" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
