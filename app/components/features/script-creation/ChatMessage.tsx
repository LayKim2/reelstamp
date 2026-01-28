'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ChatMessageProps {
  msg: {
    role: 'ai' | 'user';
    content: string;
    revisionMode?: string;
    suggestedChange?: string;
    applyPromptType?: string;
    isApplied?: boolean;
    isRejected?: boolean;
    isLoading?: boolean;
    isApplying?: boolean;
  };
  idx: number;
  user?: {
    profileImageUrl?: string;
    nickname?: string;
    email?: string;
  } | null;
  onApplySuggestion?: (index: number) => void;
  onRejectSuggestion?: (index: number) => void;
  isMobile?: boolean;
}

const ChatMessage = memo(function ChatMessage({
  msg,
  idx,
  user,
  onApplySuggestion,
  onRejectSuggestion,
  isMobile = false,
}: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'} items-start gap-2`}
    >
      {msg.role === 'ai' && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-white border border-[#EDEDF1] overflow-hidden shadow-sm flex items-center justify-center">
            <Image
              src="/images/reelstamp_loading.gif"
              alt="AI"
              width={32}
              height={32}
              className="w-full h-full object-contain scale-150"
              unoptimized
            />
          </div>
        </div>
      )}
      <div className={`relative ${isMobile ? 'max-w-[85%]' : 'max-w-[75%]'} p-3.5 shadow-md mt-4 ${
        msg.role === 'ai'
          ? 'bg-white text-[#373A46] rounded-2xl rounded-tl-none border border-[#EDEDF1]'
          : 'bg-white text-[#373A46] rounded-2xl rounded-tr-none border border-[#EDEDF1]'
      }`}>
        {msg.isLoading ? (
          <div className="flex items-center gap-1 py-1">
            <span className="w-2 h-2 bg-[#373A46] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-[#373A46] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-[#373A46] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed font-semibold tracking-tight">
            {msg.content}
          </p>
        )}

        {/* 수정 제안 UI */}
        {msg.role === 'ai' && !msg.isLoading && msg.revisionMode === 'suggestion' && !msg.isApplied && !msg.isRejected && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-[13px] font-bold text-[#FF496D] mb-3">
              {msg.isApplying ? '수정 사항을 적용 중입니다...' : '수정 사항을 적용하시겠습니까?'}
            </p>
            {!msg.isApplying && (
              <div className="flex gap-2">
                <button
                  onClick={() => onApplySuggestion?.(idx)}
                  className="flex-1 py-2 bg-[#FF496D] text-white text-xs font-bold rounded-lg hover:bg-[#E63E62] transition-colors"
                >
                  예
                </button>
                <button
                  onClick={() => onRejectSuggestion?.(idx)}
                  className="flex-1 py-2 bg-gray-100 text-[#86889C] text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  아니오
                </button>
              </div>
            )}
            {msg.isApplying && (
              <div className="flex items-center gap-1.5 py-1">
                <span className="w-1.5 h-1.5 bg-[#FF496D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[#FF496D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[#FF496D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}
          </div>
        )}

        {/* 적용/거절 상태 표시 */}
        {msg.isApplied && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-[#FF496D] font-bold">
            ✓ 수정 사항이 적용되었습니다.
          </div>
        )}
        {msg.isRejected && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-400 font-bold">
            ✕ 수정 사항을 거절했습니다.
          </div>
        )}
      </div>
      {msg.role === 'user' && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-white border border-[#EDEDF1] overflow-hidden shadow-sm flex items-center justify-center">
            {user?.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt="프로필"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-orange-200">
                <span className={`${isMobile ? 'text-sm' : 'text-xs'} font-semibold text-gray-700`}>
                  {user?.nickname?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
});

export default ChatMessage;
