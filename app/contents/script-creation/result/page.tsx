// 대본 생성 결과 페이지: 테이블 구조로 대본 표시 및 AI 챗봇 인터랙션
'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Send, MessageSquare, ChevronDown, ChevronUp, Sparkles, Layout } from 'lucide-react';
import Image from 'next/image';
import { ReelScriptResponse, ScriptSegment } from '@/app/types/reels-creation';

// 헤더 컴포넌트 분리 (이미지 디자인의 독립된 박스 형태)
const TableHeader = ({ title, className }: { title: string; className: string }) => (
  <div className={`bg-[#373A46] text-white py-3 px-4 rounded-xl text-center font-bold text-sm ${className}`}>
    {title}
  </div>
);

export default function ScriptResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">결과를 불러오는 중...</p>
        </div>
      </div>
    }>
      <ScriptResultContent />
    </Suspense>
  );
}

function ScriptResultContent() {
  const router = useRouter();
  const [resultData, setResultData] = useState<ReelScriptResponse | null>(null);
  const [reelTopic, setReelTopic] = useState<string>(''); // 릴스 주제
  const [chatMessage, setChatMessage] = useState('');
  
  // 초기 AI 메시지 (전체 텍스트)
  const initialAiMessage = '대본이 완성됐어요! ✨ 수정하고 싶은 부분이 있다면 편하게 말씀해주세요.';
  
  // 메시지 리스트 상태 (초기에는 빈 메시지로 시작, 타이핑 효과로 추가)
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; content: string }>>([
    { role: 'ai', content: '' }
  ]);
  
  const [showModificationPrompt, setShowModificationPrompt] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true); // 챗봇 열림/닫힘 상태 (기본값: 열림)
  const [isTyping, setIsTyping] = useState(true); // 타이핑 중인지 여부
  const [expandedDesignReasons, setExpandedDesignReasons] = useState<Set<string>>(new Set()); // 설계 이유 말풍선 표시 상태
  const [tooltipPositions, setTooltipPositions] = useState<{ [key: string]: { top: number; left: number } }>({});
  const iconRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // sessionStorage에서 생성된 데이터 가져오기
    const storedData = sessionStorage.getItem('generatedScript');
    const storedTopic = sessionStorage.getItem('reelTopic');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData) as ReelScriptResponse;
        setResultData(data);
      } catch (error) {
        console.error('데이터 파싱 실패:', error);
        router.push('/contents/script-creation');
      }
    } else {
      // 데이터가 없으면 생성 페이지로 리다이렉트
      router.push('/contents/script-creation');
    }
    
    // 릴스 주제 정보 가져오기
    if (storedTopic) {
      setReelTopic(storedTopic);
    }
  }, [router]);

  // 아이콘 위치 계산 및 말풍선 위치 업데이트
  useEffect(() => {
    const updateTooltipPositions = () => {
      const newPositions: { [key: string]: { top: number; left: number } } = {};
      
          Object.keys(iconRefs.current).forEach((segmentId) => {
            const iconElement = iconRefs.current[segmentId];
            if (iconElement && expandedDesignReasons.has(segmentId)) {
              const rect = iconElement.getBoundingClientRect();
              newPositions[segmentId] = {
                top: rect.top, // 아이콘의 top 위치
                left: rect.right - 256, // 말풍선 너비(256px)만큼 왼쪽으로 이동하여 아이콘 위에 표시
              };
            }
          });
      
      setTooltipPositions(newPositions);
    };

    if (expandedDesignReasons.size > 0) {
      updateTooltipPositions();
      window.addEventListener('scroll', updateTooltipPositions);
      window.addEventListener('resize', updateTooltipPositions);
    }

    return () => {
      window.removeEventListener('scroll', updateTooltipPositions);
      window.removeEventListener('resize', updateTooltipPositions);
    };
  }, [expandedDesignReasons]);

  // 초기 AI 메시지 타이핑 효과
  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < initialAiMessage.length) {
        setMessages([{ role: 'ai', content: initialAiMessage.slice(0, currentIndex + 1) }]);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 50); // 50ms마다 한 글자씩 (타이핑 속도 조절 가능)

    return () => clearInterval(typingInterval);
  }, [isTyping]);

  // 더미 데이터가 segments가 없으면 기본 segments 생성
  const segments: ScriptSegment[] = resultData?.segments || (resultData?.script ? parseScriptToSegments(resultData.script) : []);

  // 대본을 세그먼트로 파싱하는 함수 (마크다운 테이블 파서)
  function parseScriptToSegments(script: string): ScriptSegment[] {
    if (!script) return [];

    const lines = script.split('\n');
    const segments: ScriptSegment[] = [];
    let isTableStarted = false;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      // 마크다운 테이블 행인지 확인 (| 로 시작하고 끝남)
      if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
        // 구분선(| --- |)이나 헤더(| 구간 | 시간 |)는 제외
        if (trimmedLine.includes('---') || trimmedLine.includes('구간') || trimmedLine.includes('시간')) {
          isTableStarted = true;
          return;
        }

        if (isTableStarted) {
          // 셀 데이터 추출: 앞뒤 | 제거 후 split
          // 단순 split('|')는 문제가 있을 수 있으므로 정규식으로 처리
          const content = trimmedLine.slice(1, -1); // 앞뒤 | 제거
          
          // | 로 분리하되, 빈 문자열은 제외
          const cells: string[] = [];
          let currentCell = '';
          let inBrackets = false;
          
          for (let i = 0; i < content.length; i++) {
            const char = content[i];
            
            if (char === '[') {
              inBrackets = true;
              currentCell += char;
            } else if (char === ']') {
              inBrackets = false;
              currentCell += char;
            } else if (char === '|' && !inBrackets) {
              // 괄호 밖의 | 만 구분자로 사용
              cells.push(currentCell.trim());
              currentCell = '';
            } else {
              currentCell += char;
            }
          }
          
          // 마지막 셀 추가
          if (currentCell.trim()) {
            cells.push(currentCell.trim());
          }

          if (cells.length >= 5) {
            segments.push({
              id: `segment-${segments.length + 1}`,
              section: cells[0].replace(/\*\*/g, ''), // **후킹** -> 후킹
              timeline: cells[1],
              script: cells[2],
              visualSource: cells[3],
              designReason: cells.slice(4).join(' | ') // 5번째 이후 모든 셀을 합침 (설계 이유가 여러 셀로 나뉠 수 있음)
            });
          }
        }
      }
    });

    // 테이블 형식이 아닐 경우를 위한 폴백 (기존 로직 유지)
    if (segments.length === 0) {
      const lines = script.split('\n').filter(line => line.trim());
      let currentSection = '전체';
      let currentTimeline = `0~${resultData?.finalLengthSeconds || 30}s`;
      let currentScript = script;
      
      segments.push({
        id: 'segment-1',
        section: currentSection,
        timeline: currentTimeline,
        script: currentScript,
        visualSource: '전체 대본에 맞는 화면 구성',
        designReason: '제공된 정보를 바탕으로 구성되었습니다.'
      });
    }

    return segments;
  }

  // 챗봇 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // 사용자 메시지 추가
    const newUserMessage = { role: 'user' as const, content: chatMessage };
    setMessages(prev => [...prev, newUserMessage]);
    
    // 더미 AI 피드백 생성
    setTimeout(() => {
      const aiResponse = { 
        role: 'ai' as const, 
        content: `알겠습니다! 👌 요청하신 내용을 반영해서 대본을 수정해 드릴까요?` 
      };
      setMessages(prev => [...prev, aiResponse]);
      setShowModificationPrompt(true);
    }, 600);
    
    setChatMessage('');
  };

  const handleApplyModification = () => {
    // 수정 사항 적용 로직 (추후 구현)
    setShowModificationPrompt(false);
  };

  const handleRegenerate = () => {
    // 재생성 로직 (추후 구현)
    setShowModificationPrompt(false);
  };

  const handleBack = () => {
    sessionStorage.removeItem('generatedScript');
    router.push('/contents/script-creation');
  };

  if (!resultData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF496D] mx-auto mb-4"></div>
          <p className="text-gray-600">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50/30">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-12 pb-24 sm:pb-8">
        {/* 페이지 타이틀과 챗봇 토글 버튼 (PC: 같은 row, 모바일: 세로 배치) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          {/* 페이지 타이틀 */}
          {reelTopic && (
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#373A46] tracking-tight">
                '{reelTopic}' <span className="text-[#86889C] font-medium">대본</span>
              </h1>
            </div>
          )}

          {/* 상단 챗봇 토글 버튼 (PC 전용) */}
          <div className="hidden lg:flex">
            <motion.button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`group relative flex items-center gap-2.5 py-2.5 px-5 rounded-xl border transition-all shadow-sm ${
                isChatOpen 
                  ? 'bg-[#373A46] text-white border-transparent' 
                  : 'bg-white text-[#373A46] border-[#EDEDF1] hover:border-[#FF496D] hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={!isChatOpen ? {
                y: [0, -5, 0],
              } : { y: 0 }}
              transition={{
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              {/* 닫혀있을 때만 은은하게 깜빡이는 강조 효과 */}
              {!isChatOpen && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-[#FF496D]/5 pointer-events-none"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {isChatOpen ? (
                <>
                  <Layout className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold tracking-tight">대본만 보기</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FF496D] animate-bounce" />
                  <span className="text-sm font-bold tracking-tight">AI 대본 수정</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* 메인 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 대본 테이블 영역 */}
          <div className={`${isChatOpen ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all duration-500 ease-in-out`}>
            {/* 모바일 가로 스크롤을 위한 컨테이너 */}
            <div className="overflow-x-auto pb-4 lg:pb-0 lg:overflow-visible custom-scrollbar">
              <div className="min-w-[700px] lg:min-w-0">
                {/* 독립된 헤더 박스들 */}
                <div className="grid grid-cols-12 gap-3 mb-4">
                  <TableHeader title="타임라인(초)" className="col-span-2" />
                  <TableHeader title="대본" className="col-span-3" />
                  <TableHeader title="화면 설계" className="col-span-7" />
                </div>

                {/* 테이블 바디 (스크롤 가능 영역) */}
                <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
                  {segments.map((segment, index) => {
                    // 화면 설계(visualSource) 파싱: "원본(...): 내용. 자막: 내용" 형식 처리
                    const vsText = segment.visualSource || '';
                    
                    // "자막:" 또는 "자막 :" 기준으로 분리
                    const parts = vsText.split(/자막\s*:\s*/);
                    
                    // 화면 내용: "원본(...):" 또는 "원본:" 접두어 제거
                    const screenContent = parts[0]
                      .replace(/^원본\s*\(.*?\)\s*:\s*/, '')
                      .replace(/^원본\s*:\s*/, '')
                      .trim();
                    
                    // 자막 내용: 마지막에 붙은 마침표나 별표 제거
                    const subtitleContent = parts[1] 
                      ? parts[1].replace(/[\.\*]$/, '').trim() 
                      : '';

                    return (
                      <motion.div
                        key={segment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="grid grid-cols-12 gap-3 items-stretch"
                      >
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
                            <p className="text-[13px] text-[#373A46] leading-relaxed">
                              {screenContent}
                            </p>
                          </div>
                          
                          {/* 자막 파트 */}
                          {subtitleContent && (
                            <div className="flex items-start gap-3 pr-12">
                              <span className="bg-[#F8F9FA] text-[#FF496D] text-[10px] font-bold px-2 py-1 rounded flex-shrink-0 mt-0.5 min-w-[36px] text-center">
                                자막
                              </span>
                              <p className="text-[13px] text-[#373A46] leading-relaxed">
                                {subtitleContent}
                              </p>
                            </div>
                          )}

                          {/* 설계 이유 아이콘 (오른쪽 아래) */}
                          <div className="absolute right-4 bottom-4">
                            <button
                              ref={(el) => {
                                iconRefs.current[segment.id] = el;
                              }}
                              onClick={() => {
                                setExpandedDesignReasons(prev => {
                                  const newSet = new Set(prev);
                                  if (newSet.has(segment.id)) {
                                    newSet.delete(segment.id);
                                  } else {
                                    newSet.add(segment.id);
                                  }
                                  return newSet;
                                });
                              }}
                              className="relative"
                              aria-label="설계 이유 보기"
                            >
                              <Image
                                src={expandedDesignReasons.has(segment.id) ? "/images/right_on.svg" : "/images/right_off.svg"}
                                alt="설계 이유"
                                width={37}
                                height={37}
                                className="w-9 h-9 cursor-pointer transition-all hover:scale-110"
                                unoptimized
                              />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 챗봇 피드백 영역 (PC 전용) */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block lg:col-span-1"
              >
                <div className="bg-white border border-[#EDEDF1] rounded-3xl shadow-xl h-[calc(100vh-280px)] flex flex-col overflow-hidden">
                  {/* 메시지 리스트 */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/30">
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
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
                        <div className={`relative max-w-[75%] p-3.5 shadow-md mt-4 ${
                          msg.role === 'ai' 
                            ? 'bg-white text-[#373A46] rounded-2xl rounded-tl-none border border-[#EDEDF1]' 
                            : 'bg-gradient-to-r from-[#EB48B1] to-[#FF496D] text-white rounded-2xl rounded-tr-none'
                        }`}>
                          <p className="text-sm leading-relaxed font-semibold tracking-tight">
                            {msg.content}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {showModificationPrompt && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-white border-2 border-[#FF496D]/10 rounded-2xl p-5 space-y-4 shadow-xl"
                      >
                        <div className="text-[13px] text-[#373A46] font-bold text-center">
                          내용을 반영해서 수정해 드릴까요?
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleApplyModification}
                            className="flex-1 px-4 py-2.5 bg-[#373A46] text-white text-xs font-bold rounded-xl hover:bg-[#2A2C35] transition-all shadow-md active:scale-95"
                          >
                            네, 부탁해요
                          </button>
                          <button
                            onClick={handleRegenerate}
                            className="flex-1 px-4 py-2.5 bg-[#F2F2F7] text-[#86889C] text-xs font-bold rounded-xl hover:bg-[#E5E5EA] transition-all active:scale-95"
                          >
                            아니요
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* 채팅 입력창 */}
                  <div className="p-6 bg-[#F8F9FA] border-t border-[#EDEDF1]">
                    <div className="relative">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="예: 조금 더 유머러스하게 바꿔줘"
                        className="w-full pl-4 pr-12 py-3.5 bg-white border border-[#EDEDF1] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF496D]/20 focus:border-[#FF496D] transition-all shadow-sm"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#FF496D] text-white rounded-xl hover:bg-[#E63E62] transition-all flex items-center justify-center shadow-lg active:scale-90"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 모바일 전용 하단 고정 챗봇 바 (확장형 바텀 시트) */}
      <div className="lg:hidden">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100) setIsChatOpen(false);
              }}
              className="fixed inset-x-0 bottom-0 z-[60] bg-white border-t border-[#EDEDF1] rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col h-[70vh] overflow-hidden touch-none"
            >
              {/* 바텀 시트 헤더 (클릭 시 닫힘) */}
              <div 
                onClick={() => setIsChatOpen(false)}
                className="flex flex-col items-center py-2 cursor-pointer active:bg-gray-50 transition-colors"
              >
                <ChevronDown className="w-6 h-6 text-[#86889C] mb-1" />
                <span className="text-[10px] font-bold text-[#86889C] uppercase tracking-wider">Close</span>
              </div>

              {/* 메시지 리스트 (모바일용) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/30 overscroll-contain">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
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
                    <div className={`relative max-w-[85%] p-3.5 shadow-md mt-4 ${
                      msg.role === 'ai' 
                        ? 'bg-white text-[#373A46] rounded-2xl rounded-tl-none border border-[#EDEDF1]' 
                        : 'bg-gradient-to-r from-[#EB48B1] to-[#FF496D] text-white rounded-2xl rounded-tr-none'
                    }`}>
                      <p className="text-sm leading-relaxed font-semibold tracking-tight">
                        {msg.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {showModificationPrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-white border-2 border-[#FF496D]/10 rounded-2xl p-5 space-y-4 shadow-xl"
                  >
                    <div className="text-[13px] text-[#373A46] font-bold text-center">
                      내용을 반영해서 수정해 드릴까요?
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleApplyModification}
                        className="flex-1 px-4 py-2.5 bg-[#373A46] text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
                      >
                        네, 부탁해요
                      </button>
                      <button
                        onClick={handleRegenerate}
                        className="flex-1 px-4 py-2.5 bg-[#F2F2F7] text-[#86889C] text-xs font-bold rounded-xl active:scale-95 transition-all"
                      >
                        아니요
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 입력창 (모바일 확장 시 하단 고정) */}
              <div className="p-6 bg-[#F8F9FA] border-t border-[#EDEDF1] pb-10">
                <div className="relative">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="예: 조금 더 유머러스하게 바꿔줘"
                    className="w-full pl-4 pr-12 py-3.5 bg-white border border-[#EDEDF1] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF496D]/20 focus:border-[#FF496D] transition-all shadow-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#FF496D] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 모바일 하단 고정 입력 바 (기본 상태) */}
        {!isChatOpen && (
          <div 
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EDEDF1] p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 rounded-t-[24px] cursor-pointer active:bg-gray-50 transition-colors"
          >
            <div className="max-w-md mx-auto">
              <div className="flex flex-col items-center mb-2">
                <ChevronUp className="w-5 h-5 text-[#86889C] animate-bounce" />
              </div>
              <div className="relative flex items-center">
                <div className="flex-1 bg-[#F8F9FA] border border-[#EDEDF1] rounded-2xl px-4 py-3 text-sm text-[#86889C] font-medium shadow-sm">
                  예: 조금 더 유머러스하게 바꿔줘
                </div>
                <div className="absolute right-1.5 w-8 h-8 bg-[#FF496D] text-white rounded-xl flex items-center justify-center shadow-lg">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 설계 이유 말풍선 (포탈로 렌더링하여 헤더 위에 표시) */}
      {mounted && expandedDesignReasons.size > 0 && createPortal(
        <>
          {segments.map((segment) => {
            if (!expandedDesignReasons.has(segment.id) || !tooltipPositions[segment.id]) return null;
            const pos = tooltipPositions[segment.id];
            return (
              <div
                key={segment.id}
                className="fixed bg-white border border-[#EDEDF1] rounded-xl shadow-lg z-[9999]"
                style={{
                  position: 'absolute',
                  width: '258px',
                  height: '72px',
                  top: `${pos.top}px`,
                  left: `${pos.left}px`,
                  transform: 'translateY(-100%)',
                  marginTop: '-8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div className="text-[12px] text-[#373A46] leading-relaxed overflow-hidden text-ellipsis line-clamp-3">
                  {segment.designReason}
                </div>
                {/* 말풍선 꼬리 (아래쪽, 아이콘을 가리킴) */}
                <div className="absolute right-4 bottom-0 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-[#EDEDF1]"></div>
                <div className="absolute right-[17px] bottom-0 translate-y-full w-0 h-0 border-l-7 border-r-7 border-t-7 border-transparent border-t-white"></div>
              </div>
            );
          })}
        </>,
        document.body
      )}

      {/* 커스텀 스크롤바 스타일 */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E2E9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D1DB;
        }
      `}</style>
    </div>
  );
}
