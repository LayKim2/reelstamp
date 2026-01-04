// 로딩 오버레이 컴포넌트: 전체 화면 로딩 표시
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  progress?: number; // 0-100 사이의 진행률
}

export default function LoadingOverlay({ isVisible, text = '신청 중...', progress }: LoadingOverlayProps) {
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
              {/* GIF 로딩 이미지 */}
              <div className="relative w-40 h-40">
                <Image
                  src="/images/reelstamp_loading.gif"
                  alt="Loading"
                  width={160}
                  height={160}
                  className="w-40 h-40"
                  unoptimized
                />
              </div>
              
              {/* 텍스트 및 진행률 */}
              <div className="flex flex-col items-center gap-2 -mt-6 ml-4">
                <div className="flex items-center gap-1">
                  <motion.p
                    className="text-base font-medium text-gray-700"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  >
                    {text.replace(/\.+$/, '')}
                  </motion.p>
                  <span className="flex gap-0.5">
                    <motion.span
                      className="text-base font-medium text-gray-700"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                    >
                      .
                    </motion.span>
                    <motion.span
                      className="text-base font-medium text-gray-700"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                    >
                      .
                    </motion.span>
                    <motion.span
                      className="text-base font-medium text-gray-700"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                    >
                      .
                    </motion.span>
                  </span>
                </div>
                {progress !== undefined && (
                  <p className="text-xs font-semibold text-gray-600">{Math.round(progress)}%</p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

