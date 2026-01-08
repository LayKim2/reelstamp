// 기획·대본 제작 페이지: 사용자 정보 입력 후 대본 생성
'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, X, Paperclip, Loader2, RefreshCw, HelpCircle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import LoadingOverlay from '@/app/components/ui/LoadingOverlay';
import { useGenerateScript } from '@/app/hooks/useGenerateScript';
import { REEL_CATEGORY_MAP, REEL_LENGTH_MAP, REEL_CATEGORY_OPTIONS, REEL_LENGTH_OPTIONS } from '@/app/lib/constants/reels-creation';
import { ReelScriptRequest } from '@/app/types/reels-creation';
import { useAuth } from '@/app/components/providers/AuthProvider';

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
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const additionalContentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // textarea 높이 자동 조정 함수
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };


  // textarea 초기 높이 설정
  useEffect(() => {
    [contentTextareaRef.current, additionalContentTextareaRef.current].forEach((ref) => {
      if (ref) adjustTextareaHeight(ref);
    });
  }, []);

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

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    
    if (newFiles.length === 0) {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        videoFiles.forEach((f) => dataTransfer.items.add(f));
        fileInputRef.current.files = dataTransfer.files;
      }
      return;
    }

    try {
      const allFiles = [...videoFiles, ...newFiles];
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      const allPreviewUrls = [...videoPreviewUrls, ...newPreviewUrls];
      
      setVideoFiles(allFiles);
      setVideoPreviewUrls(allPreviewUrls);
      
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        allFiles.forEach((f) => dataTransfer.items.add(f));
        fileInputRef.current.files = dataTransfer.files;
      }
    } catch (error) {
      console.error('파일 처리 실패:', error);
    }
  };

  // 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
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
        video: videoFiles.length > 0 ? videoFiles : null,
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
          const errorMsg = statusCode === 422 
            ? '입력 정보가 올바르지 않습니다. 다시 확인해주세요.' 
            : error?.message || '대본 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          setSubmitError(errorMsg);
        }
      });

    } catch (error) {
      console.error('제출 실패:', error);
      setSubmitError(error instanceof Error ? error.message : '대본 생성 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

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
                  <div className="flex items-center justify-center gap-3">
                    <Paperclip className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B8A] transition-colors" />
                    <span className="text-base text-gray-600 group-hover:text-gray-900">
                      {videoFiles.length > 0 
                        ? `${videoFiles.length}개 파일 선택됨`
                        : '여러 영상 파일 선택 가능'}
                    </span>
                  </div>
                </div>

                {/* 체크박스: 입력한 영상 외엔 영상 소스 추천받지 않기 */}
                {videoFiles.length > 0 && (
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
                )}
                
                {/* 영상 Preview */}
                {videoPreviewUrls.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {videoFiles.map((file, index) => (
                      <div key={index} className="relative bg-white border-2 border-gray-200 rounded-xl p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Video className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = videoFiles.filter((_, i) => i !== index);
                              const newUrls = videoPreviewUrls.filter((_, i) => i !== index);
                              URL.revokeObjectURL(videoPreviewUrls[index]);
                              setVideoFiles(newFiles);
                              setVideoPreviewUrls(newUrls);
                              if (fileInputRef.current) {
                                const dataTransfer = new DataTransfer();
                                newFiles.forEach((f) => dataTransfer.items.add(f));
                                fileInputRef.current.files = dataTransfer.files;
                              }
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))}
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

              {/* 에러 메시지 */}
              {submitError && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-base text-red-600">{submitError}</p>
                </div>
              )}

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

