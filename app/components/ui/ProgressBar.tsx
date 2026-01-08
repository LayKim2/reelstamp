// 진행 상태바 컴포넌트: 단계별 진행 상황을 시각적으로 표시하는 UI 컴포넌트
'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { clsx } from '@/app/lib/utils/clsx';

// 단계 정보 타입
interface StepInfo {
  gradient: string;
}

// ProgressBar 컴포넌트 Props
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  currentGradient: string;
  steps: StepInfo[];
  completedMinutes: number;
  remainingMinutes: number;
  totalMinutes: number;
}

// 진행 상태바 컴포넌트
export default function ProgressBar({
  currentStep,
  totalSteps,
  stepTitle,
  currentGradient,
  steps,
  completedMinutes,
  remainingMinutes,
  totalMinutes,
}: ProgressBarProps) {
  // 시간 기반 진행률 계산 (퍼센트)
  const progress = (completedMinutes / totalMinutes) * 100;

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl shadow-lg p-5 relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {/* 배경 그라데이션 효과 */}
      <div className={`absolute inset-0 bg-gradient-to-r ${currentGradient} opacity-5`} />
      
      {/* 상단: 배지 + 시간 정보 */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-sm">
          ⚡ {totalMinutes}분 완성
        </span>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <span className="text-purple-600">{completedMinutes}분 완료</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-500">{remainingMinutes}분 남음</span>
        </div>
      </div>
      
      <div className="relative z-10 flex items-center justify-between gap-6">
        {/* 왼쪽: 큰 퍼센트 표시 */}
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
          >
            {/* 원형 프로그레스 배경 */}
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-200"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="32"
                stroke="url(#gradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 201" }}
                animate={{ strokeDasharray: `${progress * 2.01} 201` }}
                transition={{ type: 'spring', stiffness: 50, damping: 15 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            {/* 중앙 퍼센트 숫자 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className={`text-2xl font-black bg-gradient-to-r ${currentGradient} bg-clip-text text-transparent`}
                key={progress}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
          </motion.div>
          
          {/* 단계 정보 */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium mb-1">현재 진행</span>
            <span className={`text-lg font-black bg-gradient-to-r ${currentGradient} bg-clip-text text-transparent`}>
              STEP {currentStep + 1} / {totalSteps}
            </span>
            <span className="text-xs text-gray-600 font-medium mt-0.5">
              {stepTitle}
            </span>
          </div>
        </div>

        {/* 오른쪽: 단계별 미니 인디케이터 */}
        <div className="hidden sm:flex items-center gap-2">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={clsx(
                "relative w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300",
                index <= currentStep
                  ? `bg-gradient-to-br ${step.gradient} text-white shadow-md`
                  : "bg-gray-200 text-gray-400"
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
            >
              {index < currentStep ? (
                <CheckCircle2 size={16} strokeWidth={3} />
              ) : (
                index + 1
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

