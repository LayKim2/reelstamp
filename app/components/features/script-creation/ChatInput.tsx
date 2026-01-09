'use client';

import { memo } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  chatMessage: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

const ChatInput = memo(function ChatInput({
  chatMessage,
  isLoading,
  onChange,
  onSend,
}: ChatInputProps) {
  return (
    <div className="p-6 bg-[#F8F9FA] border-t border-[#EDEDF1]">
      <div className="relative">
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && onSend()}
          placeholder={isLoading ? "대화 중..." : "예: 이 대본에 대해 궁금한 점이 있어요"}
          disabled={isLoading}
          className="w-full pl-4 pr-12 py-3.5 bg-white border border-[#EDEDF1] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF496D]/20 focus:border-[#FF496D] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={onSend}
          disabled={isLoading || !chatMessage.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#FF496D] text-white rounded-xl hover:bg-[#E63E62] transition-all flex items-center justify-center shadow-lg active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FF496D]"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
});

export default ChatInput;
