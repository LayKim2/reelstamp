'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ScriptSegment } from '@/app/types/reels-creation';

interface ScriptTableRowProps {
  segment: ScriptSegment;
  index: number;
  screenContent: string;
  expandedDesignReasons: Set<string>;
  hoveredDesignReason: string | null;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  onToggleDesignReason: (id: string) => void;
}

const ScriptTableRow = memo(function ScriptTableRow({
  segment,
  index,
  screenContent,
  expandedDesignReasons,
  hoveredDesignReason,
  onMouseEnter,
  onMouseLeave,
  onToggleDesignReason,
}: ScriptTableRowProps) {
  // index가 -1이면 애니메이션 없이 즉시 표시 (스크롤 성능 최적화)
  const shouldAnimate = index >= 0;
  
  const content = (
    <div className="grid grid-cols-12 gap-3 items-stretch">
      {/* 타임라인(초) 열 */}
      <div className={`col-span-2 flex flex-col items-center justify-center rounded-2xl p-4 shadow-sm border border-[#EDEDF1] ${
        segment.section.includes('후킹') ? 'bg-[#FFF0F3]' : 'bg-white'
      }`}>
        <div className={`text-base font-bold text-center mb-2 ${
          segment.section.includes('후킹') ? 'text-[#FF496D]' : 'text-[#373A46]'
        }`}>
          {segment.section}
        </div>
        <div className="text-sm text-[#86889C] font-medium text-center">
          {segment.timeline}
        </div>
      </div>

      {/* 대본 열 */}
      <div className="col-span-3 bg-white border border-[#EDEDF1] rounded-2xl p-4 flex items-center shadow-sm">
        <div className="text-[13px] text-[#373A46] leading-relaxed whitespace-pre-wrap">
          {segment.script}
        </div>
      </div>

      {/* 화면 설계 열 */}
      <div className="col-span-7 bg-white border border-[#EDEDF1] rounded-2xl p-4 shadow-sm flex flex-col justify-center space-y-3 relative">
        {/* 화면 파트 */}
        <div className="flex items-start gap-3 pr-12">
          <span className="bg-[#FFF0F3] text-[#FF496D] text-[10px] font-bold px-2 py-1 rounded flex-shrink-0 mt-0.5 min-w-[36px] text-center">
            화면
          </span>
          <p className="text-[13px] text-[#373A46] leading-relaxed whitespace-pre-wrap">
            {screenContent}
          </p>
        </div>
        
        {/* 설계 이유 아이콘 (오른쪽 아래) */}
        <div className="absolute right-4 bottom-4">
          <button
            onMouseEnter={() => onMouseEnter(segment.id)}
            onMouseLeave={onMouseLeave}
            onClick={() => onToggleDesignReason(segment.id)}
            className="relative"
            aria-label="설계 이유 보기"
          >
            <Image
              src={(expandedDesignReasons.has(segment.id) || hoveredDesignReason === segment.id) ? "/images/right_on.svg" : "/images/right_off.svg"}
              alt="설계 이유"
              width={37}
              height={37}
              className="w-9 h-9 cursor-pointer transition-all hover:scale-110"
              unoptimized
            />
            
            {/* 설계 이유 말풍선 (hover 또는 클릭 시 표시) */}
            {(expandedDesignReasons.has(segment.id) || hoveredDesignReason === segment.id) && (
              <div
                className="absolute right-0 top-0 -translate-y-full mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-[9999]"
                style={{
                  marginTop: '-8px',
                  width: '258px',
                  maxWidth: '258px',
                }}
              >
                <div className="whitespace-normal leading-relaxed break-words">
                  {segment.designReason}
                </div>
                {/* 말풍선 꼬리 (아래쪽, 아이콘을 가리킴) */}
                <div className="absolute bottom-0 right-4 translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // 애니메이션이 필요할 때만 motion.div 사용, 아니면 일반 div
  if (shouldAnimate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        style={{ willChange: 'transform' }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
});

export default ScriptTableRow;
