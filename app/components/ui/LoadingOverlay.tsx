// 로딩 오버레이 컴포넌트: 전체 화면 로딩 표시
'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
}

export default function LoadingOverlay({ isVisible, text = '신청 중...' }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* 로딩 스피너 */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none">
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* 링 */}
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, #EB48B1 0%, #F59A39 50%, #EB48B1 100%)',
                    WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))',
                    mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))',
                    filter: 'drop-shadow(0 0 8px rgba(235, 72, 177, 0.3))',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </div>
              
              {/* 텍스트 */}
              <p className="text-sm font-medium text-gray-700">{text}</p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

