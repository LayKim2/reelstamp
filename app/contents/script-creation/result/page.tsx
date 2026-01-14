// 대본 생성 결과 페이지: 테이블 구조로 대본 표시 및 AI 챗봇 인터랙션
'use client';

import { useEffect, useState, Suspense, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronDown, ChevronUp, Sparkles, Layout } from 'lucide-react';
import Image from 'next/image';
import { ReelScriptResponse, ScriptSegment, ChatReelScriptResponse } from '@/app/types/reels-creation';
import { chatReelScript, getLatestReelScript, applyReelScript } from '@/app/lib/api/reels-creation';
import { useAuth } from '@/app/components/providers/AuthProvider';
import ScriptTableRow from '@/app/components/features/script-creation/ScriptTableRow';
import ScriptMobileCard from '@/app/components/features/script-creation/ScriptMobileCard';

// 챗봇 관련 컴포넌트는 지연 로드 (초기 번들 크기 감소)
// 챗봇이 열릴 때만 필요하므로 dynamic import로 최적화
const ChatMessage = dynamic(() => import('@/app/components/features/script-creation/ChatMessage'), {
  ssr: false,
});
const ChatInput = dynamic(() => import('@/app/components/features/script-creation/ChatInput'), {
  ssr: false,
});

// XLSX는 엑셀 다운로드 버튼 클릭 시에만 로드 (초기 번들 크기 감소)
let XLSX: any = null;
const loadXLSX = async () => {
  if (!XLSX) {
    XLSX = await import('xlsx');
  }
  return XLSX;
};

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
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [resultData, setResultData] = useState<ReelScriptResponse | null>(null);
  const [reelTopic, setReelTopic] = useState<string>(''); // 릴스 주제
  const [chatMessage, setChatMessage] = useState('');
  
  // 메시지창 스크롤을 위한 ref (PC와 모바일 각각)
  const messagesContainerRefPC = useRef<HTMLDivElement>(null);
  const messagesContainerRefMobile = useRef<HTMLDivElement>(null);
  
  // URL에서 sessionId 가져오기
  const urlSessionId = searchParams.get('sessionId');
  
  // 세션 및 리비전 ID 관리
  const [sessionId, setSessionId] = useState<string>(urlSessionId || '');
  const [revisionId, setRevisionId] = useState<string>('');
  
  // 초기 AI 메시지 (reelTopic이 있으면 앞에 붙임) - 메모이제이션
  const initialAiMessage = useMemo(() => {
    return reelTopic 
      ? `${reelTopic} 대본이 완성됐어요! ✨ 수정하고 싶은 부분이 있다면 편하게 말씀해주세요.`
      : '대본이 완성됐어요! ✨ 수정하고 싶은 부분이 있다면 편하게 말씀해주세요.';
  }, [reelTopic]);
  
  // 메시지 리스트 상태 (초기에는 빈 메시지로 시작, 타이핑 효과로 추가)
  const [messages, setMessages] = useState<Array<{ 
    role: 'ai' | 'user'; 
    content: string;
    revisionMode?: string;
    suggestedChange?: string;
    applyPromptType?: string;
    isApplied?: boolean;
    isRejected?: boolean;
    isLoading?: boolean; // 로딩 중인 메시지 표시
  }>>([
    { role: 'ai', content: '' }
  ]);
  
  // showModificationPrompt 제거: 대본 수정은 별도 API로 처리하므로 대화만 진행
  // 모바일에서는 기본적으로 닫힘, 데스크톱에서는 열림
  const [isChatOpen, setIsChatOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768; // 768px 이상이면 데스크톱 (열림), 미만이면 모바일 (닫힘)
    }
    return true; // SSR 시 기본값
  });
  const [isTyping, setIsTyping] = useState(true); // 타이핑 중인지 여부
  const [isLoading, setIsLoading] = useState(false); // API 호출 중인지 여부
  const [expandedDesignReasons, setExpandedDesignReasons] = useState<Set<string>>(new Set()); // 설계 이유 말풍선 표시 상태 (클릭)
  const [hoveredDesignReason, setHoveredDesignReason] = useState<string | null>(null); // 설계 이유 말풍선 표시 상태 (hover)
  const [expandedMobileCards, setExpandedMobileCards] = useState<Set<string>>(new Set()); // 모바일 카드 확장 상태

  useEffect(() => {
    const fetchLatestScript = async (sid: string) => {
      try {
        const data = await getLatestReelScript(sid);
        setResultData(data);
        
        // selectedStructureId와 selectedStructureName이 있으면 console.log로 출력
        if (data.selectedStructureId || data.selectedStructureName) {
          console.log('[Selected Structure]', {
            selectedStructureId: data.selectedStructureId,
            selectedStructureName: data.selectedStructureName,
          });
        }
        
        // inputSummary에서 reelTopic 가져오기
        if (data.inputSummary?.reelTopic) {
          setReelTopic(data.inputSummary.reelTopic);
          // reelTopic이 설정되면 메시지 초기화하고 타이핑 효과 다시 시작
          setMessages([{ role: 'ai', content: '' }]);
          setIsTyping(true);
        }
        
        // revisionId 업데이트 (세션 스토리지는 유지 관리를 위해 업데이트할 수 있음)
        if (data.revisionId) {
          setRevisionId(data.revisionId);
          sessionStorage.setItem('revisionId', data.revisionId);
        }
      } catch (error) {
        console.error('대본 정보 조회 실패:', error);
        router.push('/contents/script-creation');
      }
    };

    if (urlSessionId) {
      setSessionId(urlSessionId);
      sessionStorage.setItem('sessionId', urlSessionId); // 챗봇 등 다른 기능에서 참조할 수 있도록 저장
      fetchLatestScript(urlSessionId);
    } else {
      // urlSessionId가 없으면 생성 페이지로 리다이렉트
      router.push('/contents/script-creation');
    }

    const storedRevisionId = sessionStorage.getItem('revisionId');
    if (storedRevisionId) {
      setRevisionId(storedRevisionId);
    }
  }, [urlSessionId, router]);

  // 초기 AI 메시지 타이핑 효과 (reelTopic이 변경되면 다시 시작)
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
  }, [isTyping, initialAiMessage]);

  // 메시지가 추가되거나 변경될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    const scrollToBottom = (container: HTMLDivElement | null) => {
      if (container) {
        // 약간의 지연을 두어 DOM 업데이트 후 스크롤
        setTimeout(() => {
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 50);
      }
    };

    // PC와 모바일 모두 스크롤
    scrollToBottom(messagesContainerRefPC.current);
    scrollToBottom(messagesContainerRefMobile.current);
  }, [messages]);

  // HTML 태그를 렌더링 가능한 형태로 변환하는 헬퍼 함수
  const renderHtml = useCallback((text: string) => {
    if (!text) return '';
    // <br> 태그를 실제 줄바꿈으로 변환
    return text.replace(/<br\s*\/?>/gi, '\n');
  }, []);

  // visualSource 파싱 헬퍼 함수 (메모이제이션)
  const parseVisualSource = useCallback((visualSource: string) => {
    const vsText = visualSource || '';
    const parts = vsText.split(/자막\s*:\s*/);
    const screenContent = parts[0]
      .replace(/^원본\s*\(.*?\)\s*:\s*/, '')
      .replace(/^원본\s*:\s*/, '')
      .trim();
    const subtitleContent = parts[1] 
      ? parts[1].replace(/[\.\*]$/, '').trim() 
      : '';
    return { screenContent, subtitleContent };
  }, []);

  // segments 메모이제이션 (resultData가 변경될 때만 재계산)
  const segments: ScriptSegment[] = useMemo(() => {
    return resultData?.segments || (resultData?.script ? parseScriptToSegments(resultData.script) : []);
  }, [resultData]);

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
        // 구분선(| --- |)은 제외하되, 헤더는 테이블 시작으로 표시
        if (trimmedLine.includes('---')) {
          isTableStarted = true;
          return;
        }
        
        // 헤더 행 체크 (구간, 시간이 포함된 행)
        if (trimmedLine.includes('구간') && trimmedLine.includes('시간')) {
          isTableStarted = true;
          return;
        }

        if (isTableStarted) {
          // 셀 데이터 추출: 앞뒤 | 제거 후 정확하게 분리
          const content = trimmedLine.slice(1, -1); // 앞뒤 | 제거
          
          // 정규식으로 | 를 기준으로 분리하되, 앞뒤 공백 제거
          // 단순 split('|')를 사용하되, 빈 셀은 제외하지 않음 (인덱스가 중요함)
          const cells = content.split('|').map(cell => cell.trim());
          
          // 최소 5개 컬럼이 있어야 함 (구간, 시간, 대본, 영상 소스, 설계 이유)
          if (cells.length >= 5) {
            segments.push({
              id: `segment-${segments.length + 1}`,
              section: cells[0].replace(/\*\*/g, '').trim(), // **후킹** -> 후킹
              timeline: cells[1].trim(),
              script: cells[2].trim(),
              visualSource: cells[3].trim(),
              designReason: cells.slice(4).join(' | ').trim() // 5번째 이후 모든 셀을 합침 (설계 이유가 여러 셀로 나뉠 수 있음)
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

  // 수정 사항 적용 핸들러 (메모이제이션)
  const handleApplySuggestion = useCallback(async (index: number) => {
    const msg = messages[index];
    if (!msg.suggestedChange || isLoading) return;

    setIsLoading(true);
    try {
      // 대본 수정 적용 API 호출
      const response = await applyReelScript({
        sessionId,
        parentRevisionId: revisionId,
        suggestedChange: msg.suggestedChange
      });

      // 왼쪽 대본 테이블 데이터 업데이트
      setResultData(response);
      
      // revisionId 업데이트
      if (response.revisionId) {
        setRevisionId(response.revisionId);
        sessionStorage.setItem('revisionId', response.revisionId);
      }

      // 메시지 상태 업데이트 (적용됨 표시)
      setMessages(prev => prev.map((m, i) => 
        i === index ? { ...m, isApplied: true } : m
      ));

      // AI 완료 메시지 추가
      const completionMessage = {
        role: 'ai' as const,
        content: '수정 사항이 대본에 반영되었습니다! ✨'
      };
      setMessages(prev => [...prev, completionMessage]);

    } catch (error: any) {
      console.error('대본 수정 적용 실패:', error);
      const errorMessage = {
        role: 'ai' as const,
        content: error?.message || '대본 수정 적용 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, revisionId, isLoading]);

  // 수정 사항 거절 핸들러 (메모이제이션)
  const handleRejectSuggestion = useCallback((index: number) => {
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, isRejected: true } : msg
    ));
  }, []);

  // 챗봇 메시지 전송 핸들러: 사용자 메시지를 전송하고 AI 챗봇 대화 API 호출 (메모이제이션)
  const handleSendMessage = useCallback(async () => {
    if (!chatMessage.trim() || isLoading) return;
    
    // sessionId가 없으면 API 호출 불가
    if (!sessionId) {
      const errorMessage = { 
        role: 'ai' as const, 
        content: '챗봇 대화를 위한 세션 정보가 없습니다. 처음부터 다시 생성해주세요.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      setChatMessage('');
      return;
    }
    
    // 사용자 메시지 추가
    const userMessage = chatMessage.trim();
    const newUserMessage = { role: 'user' as const, content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    
    // 로딩 메시지 추가 (답변이 올 때까지 표시)
    const loadingMessage = { 
      role: 'ai' as const, 
      content: '',
      isLoading: true 
    };
    setMessages(prev => [...prev, loadingMessage]);
    
    setChatMessage('');
    setIsLoading(true);
    
    // 사용자 메시지 추가 후 스크롤을 맨 아래로 이동
    setTimeout(() => {
      if (messagesContainerRefPC.current) {
        messagesContainerRefPC.current.scrollTop = messagesContainerRefPC.current.scrollHeight;
      }
      if (messagesContainerRefMobile.current) {
        messagesContainerRefMobile.current.scrollTop = messagesContainerRefMobile.current.scrollHeight;
      }
    }, 50);
    
    try {
      // AI 챗봇 대화 API 호출 (완성된 대본에 대해 대화)
      const response = await chatReelScript({
        sessionId,
        editRequest: userMessage, // 사용자 메시지를 editRequest로 전달
      });
      
      // revisionMode가 suggestion일 경우 suggestedChange를 메시지 내용으로 사용
      const aiMessage = (response.revisionMode === 'suggestion' && response.suggestedChange)
        ? response.suggestedChange
        : (response.script || '알겠습니다! 대본에 대해 더 궁금한 점이 있으시면 말씀해주세요.');
      
      // 로딩 메시지를 실제 AI 응답으로 교체
      setMessages(prev => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex((msg, idx) => 
          idx === newMessages.length - 1 && msg.isLoading
        );
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            role: 'ai' as const,
            content: aiMessage,
            revisionMode: response.revisionMode,
            suggestedChange: response.suggestedChange,
            applyPromptType: response.applyPromptType,
            isLoading: false
          };
        }
        return newMessages;
      });
      
      // 메시지 업데이트 후 스크롤을 맨 아래로 이동
      setTimeout(() => {
        if (messagesContainerRefPC.current) {
          messagesContainerRefPC.current.scrollTop = messagesContainerRefPC.current.scrollHeight;
        }
        if (messagesContainerRefMobile.current) {
          messagesContainerRefMobile.current.scrollTop = messagesContainerRefMobile.current.scrollHeight;
        }
      }, 100);
      
      // revisionId 업데이트 (새로운 revisionId가 있다면)
      if (response.revisionId && response.revisionId !== revisionId) {
        setRevisionId(response.revisionId);
        sessionStorage.setItem('revisionId', response.revisionId);
      }
      
    } catch (error: any) {
      console.error('챗봇 대화 API 호출 실패:', error);
      
      // 로딩 메시지를 에러 메시지로 교체
      setMessages(prev => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex((msg, idx) => 
          idx === newMessages.length - 1 && msg.isLoading
        );
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            role: 'ai' as const,
            content: error?.message || '챗봇 대화 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            isLoading: false
          };
        }
        return newMessages;
      });
      
      // 에러 메시지 업데이트 후 스크롤을 맨 아래로 이동
      setTimeout(() => {
        if (messagesContainerRefPC.current) {
          messagesContainerRefPC.current.scrollTop = messagesContainerRefPC.current.scrollHeight;
        }
        if (messagesContainerRefMobile.current) {
          messagesContainerRefMobile.current.scrollTop = messagesContainerRefMobile.current.scrollHeight;
        }
      }, 100);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, chatMessage, isLoading]);

  // 엑셀 다운로드 핸들러: 대본 테이블을 엑셀 파일로 다운로드 (메모이제이션, XLSX 지연 로드)
  const handleDownloadExcel = useCallback(async () => {
    if (!resultData || segments.length === 0) {
      return;
    }

    // XLSX 라이브러리 지연 로드
    const xlsx = await loadXLSX();

    // 엑셀 데이터 준비
    const excelData = segments.map((segment, index) => {
      const { screenContent, subtitleContent } = parseVisualSource(segment.visualSource || '');

      return {
        '순번': index + 1,
        '구간': segment.section,
        '타임라인(초)': segment.timeline,
        '대본': segment.script,
        '화면': screenContent,
        '자막': subtitleContent,
        '설계 이유': segment.designReason,
      };
    });

    // 워크북 생성
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(excelData);

    // 컬럼 너비 설정
    ws['!cols'] = [
      { wch: 8 },  // 순번
      { wch: 12 }, // 구간
      { wch: 15 }, // 타임라인
      { wch: 40 }, // 대본
      { wch: 40 }, // 화면
      { wch: 30 }, // 자막
      { wch: 50 }, // 설계 이유
    ];

    // 워크시트 추가
    xlsx.utils.book_append_sheet(wb, ws, '대본');

    // 파일명 생성 (릴스 주제 포함)
    const fileName = reelTopic 
      ? `${reelTopic}_대본_${new Date().toISOString().split('T')[0]}.xlsx`
      : `대본_${new Date().toISOString().split('T')[0]}.xlsx`;

    // 파일 다운로드
    xlsx.writeFile(wb, fileName);
  }, [resultData, segments, reelTopic, parseVisualSource]);


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
    <div className="bg-gradient-to-b from-white to-pink-50/30">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-12 pb-24 lg:pb-16">
        {/* 페이지 타이틀과 챗봇 토글 버튼 (PC: 같은 row, 모바일: 같은 행 오른쪽 정렬) */}
        <div className="flex flex-row items-center justify-between gap-4 mb-6 lg:mb-8">
          {/* 페이지 타이틀 */}
          {reelTopic && (
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#373A46] tracking-tight">
                '{reelTopic}' <span className="text-[#86889C] font-medium">대본</span>
              </h1>
            </div>
          )}

          {/* 엑셀 다운로드 버튼 (모바일: title과 같은 행 오른쪽, PC: 챗봇 버튼과 함께) */}
          <div className="flex lg:hidden">
            <motion.button
              onClick={handleDownloadExcel}
              className="group relative flex items-center justify-center w-10 h-10 rounded-xl border border-[#EDEDF1] bg-white text-[#373A46] hover:bg-gray-50 transition-all shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="엑셀로 다운로드"
            >
              <Image
                src="/images/icon_excel.png"
                alt="엑셀 다운로드"
                width={24}
                height={24}
                className="w-6 h-6"
                unoptimized
              />
            </motion.button>
          </div>

          {/* 상단 챗봇 토글 버튼 및 엑셀 다운로드 버튼 (PC 전용) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* 엑셀 다운로드 버튼 */}
            <motion.button
              onClick={handleDownloadExcel}
              className="group relative flex items-center justify-center w-10 h-10 rounded-xl border border-[#EDEDF1] bg-white text-[#373A46] hover:bg-gray-50 transition-all shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="엑셀로 다운로드"
            >
              <Image
                src="/images/icon_excel.png"
                alt="엑셀 다운로드"
                width={24}
                height={24}
                className="w-6 h-6"
                unoptimized
              />
            </motion.button>

            {/* 챗봇 토글 버튼 */}
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
            {/* PC: 테이블 형태, 모바일: 카드 형태 */}
            {/* PC 테이블 (기존) */}
            <div className="hidden lg:block">
              <div className="overflow-visible custom-scrollbar">
                {/* 독립된 헤더 박스들 */}
                <div className="grid grid-cols-12 gap-3 mb-4">
                  <TableHeader title="타임라인(초)" className="col-span-2" />
                  <TableHeader title="대본" className="col-span-3" />
                  <TableHeader title="화면 설계" className="col-span-7" />
                </div>

                {/* 테이블 바디 (전체 표시) */}
                <div className="space-y-3 pr-2 pt-4">
                  {segments.map((segment, index) => {
                    const { screenContent, subtitleContent } = parseVisualSource(segment.visualSource || '');
                    // HTML 태그를 렌더링 가능한 형태로 변환
                    const renderedScript = renderHtml(segment.script || '');
                    const renderedScreenContent = renderHtml(screenContent);
                    const renderedSubtitleContent = renderHtml(subtitleContent);

                    return (
                      <ScriptTableRow
                        key={segment.id}
                        segment={{ ...segment, script: renderedScript }}
                        index={index}
                        screenContent={renderedScreenContent}
                        subtitleContent={renderedSubtitleContent}
                        expandedDesignReasons={expandedDesignReasons}
                        hoveredDesignReason={hoveredDesignReason}
                        onMouseEnter={setHoveredDesignReason}
                        onMouseLeave={() => setHoveredDesignReason(null)}
                        onToggleDesignReason={(id) => {
                          setExpandedDesignReasons(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(id)) {
                              newSet.delete(id);
                            } else {
                              newSet.add(id);
                            }
                            return newSet;
                          });
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 모바일 카드 형태 (전체 표시) */}
            <div className="lg:hidden space-y-4 pr-2 pt-4">
              {segments.map((segment, index) => {
                const { screenContent, subtitleContent } = parseVisualSource(segment.visualSource || '');
                const isExpanded = expandedMobileCards.has(segment.id);
                // HTML 태그를 렌더링 가능한 형태로 변환
                const renderedScript = renderHtml(segment.script || '');
                const renderedScreenContent = renderHtml(screenContent);
                const renderedSubtitleContent = renderHtml(subtitleContent);

                return (
                  <ScriptMobileCard
                    key={segment.id}
                    segment={{ ...segment, script: renderedScript }}
                    index={index}
                    screenContent={renderedScreenContent}
                    subtitleContent={renderedSubtitleContent}
                    isExpanded={isExpanded}
                    onToggle={(id) => {
                      setExpandedMobileCards(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(id)) {
                          newSet.delete(id);
                        } else {
                          newSet.add(id);
                        }
                        return newSet;
                      });
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* 오른쪽: 챗봇 피드백 영역 (PC 전용, Sticky 적용) */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block lg:col-span-1 sticky top-24 self-start"
                style={{ height: 'calc(100vh - 160px)', maxHeight: 'calc(100vh - 160px)' }}
              >
                <div className="bg-white border border-[#EDEDF1] rounded-3xl shadow-xl flex flex-col overflow-hidden h-full">
                  {/* 메시지 리스트 */}
                  <div ref={messagesContainerRefPC} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/30" style={{ minHeight: 0, maxHeight: '100%' }}>
                    {messages.map((msg, idx) => (
                      <ChatMessage
                        key={idx}
                        msg={msg}
                        idx={idx}
                        user={user}
                        onApplySuggestion={handleApplySuggestion}
                        onRejectSuggestion={handleRejectSuggestion}
                        isMobile={false}
                      />
                    ))}
                  </div>

                  {/* 채팅 입력창 */}
                  <ChatInput
                    chatMessage={chatMessage}
                    isLoading={isLoading}
                    onChange={setChatMessage}
                    onSend={handleSendMessage}
                  />
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
              <div ref={messagesContainerRefMobile} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/30 overscroll-contain" style={{ minHeight: 0 }}>
                {messages.map((msg, idx) => (
                  <ChatMessage
                    key={idx}
                    msg={msg}
                    idx={idx}
                    user={user}
                    onApplySuggestion={handleApplySuggestion}
                    onRejectSuggestion={handleRejectSuggestion}
                    isMobile={true}
                  />
                ))}
              </div>

              {/* 입력창 (모바일 확장 시 하단 고정) */}
              <div className="pb-10">
                <ChatInput
                  chatMessage={chatMessage}
                  isLoading={isLoading}
                  onChange={setChatMessage}
                  onSend={handleSendMessage}
                />
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
