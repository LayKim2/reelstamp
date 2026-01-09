'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ScriptSegment } from '@/app/types/reels-creation';

interface ScriptMobileCardProps {
  segment: ScriptSegment;
  index: number;
  screenContent: string;
  subtitleContent: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const ScriptMobileCard = memo(function ScriptMobileCard({
  segment,
  index,
  screenContent,
  subtitleContent,
  isExpanded,
  onToggle,
}: ScriptMobileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white relative"
    >
      {/* 카드 헤더 (회색 바 형태, 화살표 포함, 상단만 라운드) */}
      <div className="relative" id={`header-${segment.id}`} style={{ position: 'relative' }}>
        <button
          onClick={() => onToggle(segment.id)}
          className={`w-full bg-gray-100 px-4 py-3 flex items-center justify-between hover:bg-gray-200 transition-colors ${
            isExpanded && segment.designReason ? 'rounded-t-2xl' : 'rounded-2xl'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[#373A46]">
              {index + 1}. {segment.section}
            </span>
            <span className="text-sm text-[#86889C] font-medium">
              {segment.timeline}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-[#86889C] flex-shrink-0 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* 설계 이유 (헤더 바로 아래, 확장 시에만 표시) */}
        <AnimatePresence>
          {isExpanded && segment.designReason && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden bg-gray-100 border-t border-b border-gray-200 rounded-b-2xl"
              id={`design-reason-${segment.id}`}
            >
              <div className="px-4 py-4">
                <div className="text-sm font-bold text-[#FF496D] mb-2">
                  왜 이렇게 구성되었나요?
                </div>
                <p className="text-sm text-[#373A46] leading-relaxed">
                  {segment.designReason}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 카드 바디 (항상 표시) */}
      <div className="px-4 py-4 space-y-4">
        {/* 대본 */}
        <div>
          <div className="text-xs font-bold text-[#86889C] mb-2 uppercase tracking-wider">
            대본
          </div>
          <p className="text-sm text-[#373A46] leading-relaxed whitespace-pre-wrap">
            {segment.script}
          </p>
        </div>

        {/* 화면 */}
        <div>
          <div className="text-xs font-bold text-[#86889C] mb-2 uppercase tracking-wider">
            화면
          </div>
          <p className="text-sm text-[#373A46] leading-relaxed">
            {screenContent}
          </p>
        </div>

        {/* 자막 */}
        {subtitleContent && (
          <div>
            <div className="text-xs font-bold text-[#86889C] mb-2 uppercase tracking-wider">
              자막
            </div>
            <p className="text-sm text-[#373A46] leading-relaxed">
              {subtitleContent}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
});

export default ScriptMobileCard;
