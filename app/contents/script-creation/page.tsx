// 기획·대본 제작 페이지: 사용자 정보 입력 후 대본 생성
'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, X, Paperclip, Loader2, RefreshCw, HelpCircle, AlertCircle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useGenerateScript } from '@/app/hooks/useGenerateScript';
import { REEL_CATEGORY_MAP, REEL_LENGTH_MAP, REEL_CATEGORY_OPTIONS, REEL_LENGTH_OPTIONS } from '@/app/lib/constants/reels-creation';
import { ReelScriptRequest } from '@/app/types/reels-creation';
import { useAuth } from '@/app/components/providers/AuthProvider';

// 상수
const MAX_DURATION_SECONDS = 25 * 60; // 1500초
const MAX_SIZE_BYTES = 400 * 1024 * 1024; // 400MB

// 지연 로드: 제출할 때만 필요하므로 초기 번들에서 제외
const LoadingOverlay = dynamic(() => import('@/app/components/ui/LoadingOverlay'), {
  ssr: false,
});

export default function ScriptCreationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const { mutate: generateScript, data: generatedData, reset: resetApi } = useGenerateScript();

  // 폼 상태 관리
  const [category, setCategory] = useState('');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [videoLength, setVideoLength] = useState('');
  const [additionalContent, setAdditionalContent] = useState('');
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);
  // 영상 파일 정보를 ID로 매핑하여 관리
  const [videoFiles, setVideoFiles] = useState<Array<{ id: string; file: File }>>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<Map<string, string>>(new Map());
  const [videoDurations, setVideoDurations] = useState<Map<string, number>>(new Map()); // 각 영상 파일의 길이(초)
  const [excludeRecommendedSources, setExcludeRecommendedSources] = useState(false); // 입력한 영상 외엔 영상 소스 추천받지 않기
  const [hoverTooltip, setHoverTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ [key: string]: { top: number; left: number } }>({});
  const [mounted, setMounted] = useState(false);
  const [clickedTooltip, setClickedTooltip] = useState<string | null>(null); // 모바일 클릭 상태
  const tooltipRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('생성 중...');
  const [showToast, setShowToast] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const additionalContentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // textarea 높이 자동 조정 함수 (메모이제이션)
  const adjustTextareaHeight = useCallback((textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  // textarea 초기 높이 설정
  useEffect(() => {
    [contentTextareaRef.current, additionalContentTextareaRef.current].forEach((ref) => {
      if (ref) adjustTextareaHeight(ref);
    });
  }, [adjustTextareaHeight]);

  // Preview URL cleanup
  useEffect(() => {
    return () => {
      videoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [videoPreviewUrls]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // tooltip 위치 계산
  useEffect(() => {
    const activeTooltip = hoverTooltip || clickedTooltip;
    if (!activeTooltip) {
      setTooltipPosition({});
      return;
    }

    const updateTooltipPosition = () => {
      const element = tooltipRefs.current[activeTooltip];
      if (!element) return;

      const rect = element.getBoundingClientRect();
      setTooltipPosition({
        [activeTooltip]: {
          top: rect.top - 8,
          left: rect.left - 10,
        },
      });
    };

    updateTooltipPosition();
    const timer = setTimeout(updateTooltipPosition, 50);
    
    window.addEventListener('scroll', updateTooltipPosition, true);
    window.addEventListener('resize', updateTooltipPosition);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', updateTooltipPosition, true);
      window.removeEventListener('resize', updateTooltipPosition);
    };
  }, [hoverTooltip, clickedTooltip]);

  // 모바일: 외부 클릭 시 tooltip 닫기
  useEffect(() => {
    if (!clickedTooltip) return;

    const handleClickOutside = (e: MouseEvent) => {
      const element = tooltipRefs.current[clickedTooltip];
      if (element && !element.contains(e.target as Node)) {
        setClickedTooltip(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clickedTooltip]);

  // 토스트 알림 표시 및 자동 닫기
  useEffect(() => {
    if (submitError) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setSubmitError(null), 300); // 애니메이션 완료 후 상태 초기화
      }, 5000); // 5초 후 자동 닫기

      return () => clearTimeout(timer);
    }
  }, [submitError]);

  // 영상 파일의 길이(초)를 가져오는 함수
  const getVideoDuration = useCallback((file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      const objectUrl = URL.createObjectURL(file);
      let timeoutId: NodeJS.Timeout | null = null;
      
      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        URL.revokeObjectURL(objectUrl);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);
      };
      
      const handleLoadedMetadata = () => {
        cleanup();
        const duration = video.duration;
        
        // duration 유효성 검사
        if (!isFinite(duration) || isNaN(duration) || duration <= 0) {
          reject(new Error('영상 파일의 길이를 확인할 수 없습니다.'));
          return;
        }
        
        resolve(duration);
      };
      
      const handleError = () => {
        cleanup();
        reject(new Error('영상 파일을 읽을 수 없습니다.'));
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('error', handleError);
      
      // 타임아웃 설정 (10초)
      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('영상 파일 로드 시간이 초과되었습니다.'));
      }, 10000);
      
      video.src = objectUrl;
      video.load();
    });
  }, []);

  // 파일 선택 핸들러 (메모이제이션)
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    
    if (newFiles.length === 0) {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        videoFiles.forEach(({ file }) => dataTransfer.items.add(file));
        fileInputRef.current.files = dataTransfer.files;
      }
      return;
    }

    try {
      // 기존 파일들의 총 길이와 용량 계산
      const existingTotalDuration = Array.from(videoDurations.values()).reduce((sum, duration) => sum + duration, 0);
      const existingTotalSize = videoFiles.reduce((sum, { file }) => sum + file.size, 0);

      // 새 파일들의 길이 가져오기 및 고유 ID 생성
      const newFileEntries: Array<{ id: string; file: File }> = [];
      const newPreviewUrlsMap = new Map<string, string>();
      const newDurationsMap = new Map<string, number>();

      for (const file of newFiles) {
        try {
          const duration = await getVideoDuration(file);
          
          // 개별 파일 길이 체크
          if (duration > MAX_DURATION_SECONDS) {
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            setSubmitError(`영상 파일 "${file.name}"의 길이가 25분을 초과합니다. (${minutes}분 ${seconds}초)`);
            return;
          }
          
          // 고유 ID 생성
          const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;
          const previewUrl = URL.createObjectURL(file);
          
          newFileEntries.push({ id: fileId, file });
          newPreviewUrlsMap.set(fileId, previewUrl);
          newDurationsMap.set(fileId, duration);
        } catch (error) {
          setSubmitError(error instanceof Error ? error.message : '영상 파일의 길이를 확인할 수 없습니다. 다시 시도해주세요.');
          return;
        }
      }

      // 새 파일들의 총 길이와 용량 계산
      const newTotalDuration = Array.from(newDurationsMap.values()).reduce((sum, duration) => sum + duration, 0);
      const newTotalSize = newFiles.reduce((sum, file) => sum + file.size, 0);

      // 제한 체크
      const totalDuration = existingTotalDuration + newTotalDuration;
      const totalSize = existingTotalSize + newTotalSize;

      if (totalDuration > MAX_DURATION_SECONDS) {
        const totalMinutes = Math.floor(totalDuration / 60);
        const totalSeconds = Math.floor(totalDuration % 60);
        setSubmitError(`영상 총 길이는 25분 이하여야 합니다. (현재: ${totalMinutes}분 ${totalSeconds}초)`);
        return;
      }

      if (totalSize > MAX_SIZE_BYTES) {
        const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
        setSubmitError(`영상 총 용량은 400MB 이하여야 합니다. (현재: ${totalSizeMB}MB)`);
        return;
      }

      // 제한을 통과한 경우 파일 추가
      const allFiles = [...videoFiles, ...newFileEntries];
      const allPreviewUrls = new Map([...videoPreviewUrls, ...newPreviewUrlsMap]);
      const allDurations = new Map([...videoDurations, ...newDurationsMap]);
      
      setVideoFiles(allFiles);
      setVideoPreviewUrls(allPreviewUrls);
      setVideoDurations(allDurations);
      setSubmitError(null);
      
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        allFiles.forEach(({ file }) => dataTransfer.items.add(file));
        fileInputRef.current.files = dataTransfer.files;
      }
    } catch (error) {
      setSubmitError('파일 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }, [videoFiles, videoPreviewUrls, videoDurations, getVideoDuration]);

  // 총 길이 및 용량 계산 (메모이제이션)
  const totalVideoStats = useMemo(() => {
    if (videoFiles.length === 0) return { duration: 0, size: 0 };
    const duration = Array.from(videoDurations.values()).reduce((sum, d) => sum + d, 0);
    const size = videoFiles.reduce((sum, { file }) => sum + file.size, 0);
    return { duration, size };
  }, [videoFiles, videoDurations]);

  // 영상 파일 삭제 핸들러 (메모이제이션)
  const handleDeleteVideo = useCallback((id: string) => {
    const urlToRevoke = videoPreviewUrls.get(id);
    if (urlToRevoke) {
      URL.revokeObjectURL(urlToRevoke);
    }
    
    const newFiles = videoFiles.filter((item) => item.id !== id);
    const newPreviewUrls = new Map(videoPreviewUrls);
    const newDurations = new Map(videoDurations);
    newPreviewUrls.delete(id);
    newDurations.delete(id);
    
    setVideoFiles(newFiles);
    setVideoPreviewUrls(newPreviewUrls);
    setVideoDurations(newDurations);
    
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      newFiles.forEach(({ file }) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  }, [videoFiles, videoPreviewUrls, videoDurations]);

  // 제출 핸들러 (메모이제이션)
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 로그인 인증 체크
    if (!isAuthenticated || !user) {
      // 현재 경로를 저장하고 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('previousPath', pathname);
      }
      router.push('/login');
      return;
    }
    
    // 카테고리 필수 체크
    if (!category) {
      setSubmitError('카테고리를 선택해주세요.');
      return;
    }

    // 영상 파일 제한 체크
    if (videoFiles.length > 0) {
      const { duration: totalDuration, size: totalSize } = totalVideoStats;

      if (totalDuration > MAX_DURATION_SECONDS) {
        const totalMinutes = Math.floor(totalDuration / 60);
        const totalSeconds = Math.floor(totalDuration % 60);
        setSubmitError(`영상 총 길이는 25분 이하여야 합니다. (현재: ${totalMinutes}분 ${totalSeconds}초)`);
        return;
      }

      if (totalSize > MAX_SIZE_BYTES) {
        const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
        setSubmitError(`영상 총 용량은 400MB 이하여야 합니다. (현재: ${totalSizeMB}MB)`);
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);
    resetApi();

    try {
      // video_source_mode 결정
      let videoSourceMode: 'uploaded_only' | 'uploaded_plus_new' | 'no_video' = 'no_video';
      if (videoFiles.length > 0) {
        videoSourceMode = excludeRecommendedSources ? 'uploaded_only' : 'uploaded_plus_new';
      }

      // API 요청 데이터 생성 (타입 안정성 확보)
      const request: ReelScriptRequest = {
        reel_type: REEL_CATEGORY_MAP[category] || 'information',
        reel_topic: topic,
        user_request: content,
        user_id: user.id,
        reel_length: videoLength ? REEL_LENGTH_MAP[videoLength] : null,
        extra_request: additionalContent || null,
        video: videoFiles.length > 0 ? videoFiles.map(({ file }) => file) : null,
        video_source_mode: videoSourceMode,
      };

      setLoadingText('대본 생성 중...');
      
      // useMutation 호출
      generateScript(request, {
        onSuccess: (data) => {
          setIsSubmitting(false);
          
          // sessionId를 쿼리 파라미터로 전달하여 이동
          router.push(`/contents/script-creation/result?sessionId=${data.sessionId}`);
        },
        onError: (error: any) => {
          setIsSubmitting(false);
          const statusCode = error?.response?.status;
          const errorData = error?.response?.data;
          
          // 서버에서 보낸 에러 메시지를 그대로 표시
          let errorMsg = '대본 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          
          if (errorData?.message) {
            // 서버에서 보낸 메시지가 있으면 그대로 사용
            errorMsg = errorData.message;
          } else if (error?.message) {
            // error 객체에 메시지가 있으면 사용
            errorMsg = error.message;
          }
          
          setSubmitError(errorMsg);
        }
      });

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '대본 생성 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  }, [
    isAuthenticated,
    user,
    pathname,
    router,
    category,
    videoFiles,
    totalVideoStats,
    excludeRecommendedSources,
    topic,
    content,
    videoLength,
    additionalContent,
    generateScript,
    resetApi,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50/30">
      {/* 로딩 GIF 미리 로드 (Preload) */}
      <div className="hidden" aria-hidden="true">
        <Image
          src="/images/reelstamp_loading.gif"
          alt="Preload"
          width={1}
          height={1}
          priority
          unoptimized
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 페이지 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            기획·대본 제작
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            100만 조회수 릴스를 분석하여 나만의 릴스 기획과 대본을 생성해드립니다
          </p>
        </div>

        {/* 메인 컨텐츠 영역: 중앙 정렬 */}
        <div className="flex justify-center">
          {/* 입력 폼 영역 */}
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
              {/* 카테고리 */}
              <div>
                <label className="flex items-center gap-2 text-base font-bold text-gray-900 mb-2.5">
                  <span>카테고리 <span className="text-red-500">*</span></span>
                  <div 
                    ref={(el) => { tooltipRefs.current['category-help'] = el; }}
                    className="flex-shrink-0"
                    onMouseEnter={() => setHoverTooltip('category-help')}
                    onMouseLeave={() => setHoverTooltip(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setClickedTooltip(clickedTooltip === 'category-help' ? null : 'category-help');
                    }}
                  >
                    <HelpCircle className={`w-4 h-4 transition-all ${(hoverTooltip === 'category-help' || clickedTooltip === 'category-help') ? 'text-gray-900' : 'text-gray-400'}`} />
                  </div>
                </label>
                {/* PC: 전체 너비에 맞게 4개 그리드, 모바일: 가로 스크롤 */}
                <div className="hidden lg:grid lg:grid-cols-4 gap-3 pt-2">
                  {REEL_CATEGORY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCategory(option)}
                      className={`relative px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        category === option
                          ? 'bg-[#FF6B8A] text-white shadow-lg scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {/* 모바일: 가로 스크롤 */}
                <div className="lg:hidden overflow-x-auto pb-4 pt-2 -mx-4 px-4 pr-8" style={{ scrollbarWidth: 'thin' }}>
                  <div className="flex gap-3 min-w-max">
                    {REEL_CATEGORY_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setCategory(option)}
                        className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                          category === option
                            ? 'bg-[#FF6B8A] text-white shadow-lg scale-105'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 릴스 주제 */}
              <div>
                <label htmlFor="topic" className="block text-base font-bold text-gray-900 mb-2.5">
                  릴스 주제 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="만들고자 하는 영상 주제를 입력해주세요"
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B8A] focus:ring-4 focus:ring-pink-100 text-base text-gray-900 placeholder:text-base placeholder:text-gray-400 transition-all shadow-sm"
                  required
                />
              </div>

              {/* 릴스 내용 */}
              <div>
                <label htmlFor="content" className="block text-base font-bold text-gray-900 mb-2.5">
                  릴스 내용 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    ref={contentTextareaRef}
                    id="content"
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      adjustTextareaHeight(e.target as HTMLTextAreaElement);
                    }}
                    rows={4}
                    placeholder="릴스에 담고 싶은 내용을 자유롭게 작성해주세요.&#10;구체적일수록 나만의 컨셉이 반영된 기획과 대본이 제공됩니다."
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B8A] focus:ring-4 focus:ring-pink-100 resize-none overflow-hidden text-base text-gray-900 placeholder:text-base placeholder:text-gray-400 transition-all shadow-sm"
                    required
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {content.length}/1000
                  </div>
                </div>
              </div>

              {/* 영상 소스 */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-2.5">
                  영상 소스 <span className="text-gray-500 text-xs font-normal">(선택)</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#FF6B8A] hover:bg-pink-50/30 transition-all group"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center justify-center gap-3">
                      <Paperclip className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B8A] transition-colors" />
                      <span className="text-base text-gray-600 group-hover:text-gray-900">
                        {videoFiles.length > 0 
                          ? `${videoFiles.length}개 파일 선택됨`
                          : '여러 영상 파일 선택 가능'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      (총 25분, 400MB 이내)
                    </span>
                  </div>
                </div>

                {/* 체크박스: 입력한 영상 외엔 영상 소스 추천받지 않기 */}
                {videoFiles.length > 0 && (
                  <>
                    <div className="mt-4 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="excludeRecommendedSources"
                        checked={excludeRecommendedSources}
                        onChange={(e) => setExcludeRecommendedSources(e.target.checked)}
                        className="w-4 h-4 text-[#FF6B8A] border-gray-300 rounded focus:ring-[#FF6B8A] focus:ring-2 cursor-pointer"
                      />
                      <label htmlFor="excludeRecommendedSources" className="text-sm text-gray-700 cursor-pointer">
                        입력한 영상 외엔 영상 소스 추천받지 않기
                      </label>
                    </div>
                    {/* 총 길이 및 용량 표시 */}
                    <div className="mt-2 text-xs text-gray-500">
                      총 길이: {Math.floor(totalVideoStats.duration / 60)}분 {Math.floor(totalVideoStats.duration % 60)}초 / 25분
                      {' • '}
                      총 용량: {(totalVideoStats.size / 1024 / 1024).toFixed(2)}MB / 400MB
                    </div>
                  </>
                )}
                
                {/* 영상 Preview */}
                {videoFiles.length > 0 && (
                  <div className="mt-4">
                    <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}>
                      <div className="flex gap-4" style={{ width: 'max-content' }}>
                        {videoFiles.map(({ id, file }) => {
                          const previewUrl = videoPreviewUrls.get(id);
                          const duration = videoDurations.get(id);
                          
                          if (!previewUrl) return null;
                          
                          return (
                            <div key={id} className="relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden group" style={{ width: '280px', flexShrink: 0 }}>
                              {/* 영상 Preview */}
                              <div className="relative aspect-video bg-gray-100">
                                <video
                                  key={previewUrl}
                                  src={previewUrl}
                                  className="w-full h-full object-cover"
                                  muted
                                  playsInline
                                  preload="metadata"
                                />
                                {/* 삭제 버튼 */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteVideo(id)}
                                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10"
                                  aria-label="파일 삭제"
                                >
                                  <X className="w-4 h-4 text-white" />
                                </button>
                              </div>
                              {/* 파일 정보 */}
                              <div className="p-3">
                                <p className="text-sm font-medium text-gray-900 truncate mb-1">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                  {duration !== undefined && !isNaN(duration) && (
                                    <span className="ml-2">
                                      • {Math.floor(duration / 60)}분 {Math.floor(duration % 60)}초
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 추가 사항 (접을 수 있는 섹션) */}
              <div className="border-2 border-gray-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsAdditionalOpen(!isAdditionalOpen)}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-base font-bold text-gray-900 hover:bg-gray-50 transition-colors rounded-t-xl"
                >
                  <span>추가 사항 <span className="text-gray-500 text-xs font-normal">(선택)</span></span>
                  <span className={`transform transition-transform duration-200 ${isAdditionalOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                <AnimatePresence>
                  {isAdditionalOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-6 border-t border-gray-200 pt-4">
                        {/* 영상 길이 */}
                        <div>
                          <label className="block text-base font-bold text-gray-900 mb-2.5">
                            영상 길이 <span className="text-gray-500 text-xs font-normal">(선택)</span>
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {REEL_LENGTH_OPTIONS.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setVideoLength(option)}
                                className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                  videoLength === option
                                    ? 'bg-[#FF6B8A] text-white shadow-lg scale-105'
                                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 추가 내용 */}
                        <div>
                          <label htmlFor="additionalContent" className="block text-base font-bold text-gray-900 mb-2.5">
                            추가 내용 <span className="text-gray-500 text-xs font-normal">(선택)</span>
                          </label>
                          <textarea
                            ref={additionalContentTextareaRef}
                            id="additionalContent"
                            value={additionalContent}
                            onChange={(e) => {
                              setAdditionalContent(e.target.value);
                              adjustTextareaHeight(e.target as HTMLTextAreaElement);
                            }}
                            rows={4}
                            placeholder="릴스에 추가로 담고 싶은 내용, 영상 소스, 또는 컨셉이 있다면 작성해주세요."
                            className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B8A] focus:ring-4 focus:ring-pink-100 resize-none overflow-hidden text-base text-gray-900 placeholder:text-base placeholder:text-gray-400 transition-all shadow-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-[#FF6B8A] text-white font-bold rounded-xl hover:bg-[#FF5A7A] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-[56px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{loadingText}</span>
                  </>
                ) : generatedData ? (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>다시 생성하기</span>
                  </>
                ) : (
                  <>
                    <span>대본 생성하기</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 로딩 오버레이 */}
      <LoadingOverlay isVisible={isSubmitting} text={loadingText} />

      {/* Toast 알림 */}
      {mounted && createPortal(
        <AnimatePresence>
          {showToast && submitError && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[10000] max-w-md w-full mx-4"
            >
              <div className="bg-white border-2 border-red-200 rounded-xl shadow-2xl p-4 flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-900">{submitError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowToast(false);
                    setTimeout(() => setSubmitError(null), 300);
                  }}
                  className="flex-shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
                  aria-label="닫기"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Tooltip Portal (PC hover용 말풍선) */}
      {mounted && createPortal(
        <>
          {(hoverTooltip === 'category-help' || clickedTooltip === 'category-help') && tooltipPosition['category-help'] && (
            <div
              className="fixed z-[9999] bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg"
              style={{
                top: `${tooltipPosition['category-help'].top}px`,
                left: `${tooltipPosition['category-help'].left}px`,
                transform: 'translateY(-100%)',
              }}
            >
              <div className="whitespace-nowrap">• 지식·정보: 재테크, 경제, 인물, 사건, 레시피 등</div>
              <div className="whitespace-nowrap">• 리뷰·소개: 맛집, 카페, 제품, 장소, 드라마, 예능 등</div>
              {/* 말풍선 꼬리 (아래쪽, 왼쪽 - 아이콘 바로 위) */}
              <div className="absolute bottom-0 left-4 translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
            </div>
          )}
        </>,
        document.body
      )}
    </div>
  );
}

