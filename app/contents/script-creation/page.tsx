// 기획·대본 제작 페이지: 사용자 정보 입력 후 대본 생성
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Video, Sparkles, X, Paperclip, Loader2 } from 'lucide-react';
import Modal from '@/app/components/ui/Modal';
import LoadingOverlay from '@/app/components/ui/LoadingOverlay';
import Image from 'next/image';

export default function ScriptCreationPage() {
  // 폼 상태 관리
  const [category, setCategory] = useState('');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [videoLength, setVideoLength] = useState('');
  const [additionalContent, setAdditionalContent] = useState('');
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  
  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
  const [loadingText, setLoadingText] = useState('생성 중...');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const additionalContentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [formHeight, setFormHeight] = useState<number>(600);

  // textarea 높이 자동 조정 함수
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // 왼쪽 폼 높이 측정 및 오른쪽 영역 높이 동기화 (ResizeObserver가 자동으로 감지)
  useEffect(() => {
    if (!formRef.current) return;

    const updateHeight = () => {
      if (formRef.current) {
        setFormHeight(formRef.current.offsetHeight);
      }
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(formRef.current);

    return () => resizeObserver.disconnect();
  }, []);

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
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 파일 업로드 (presigned URL 사용)
      const uploadedFiles: Array<{ fileName: string; fileUrl: string }> = [];
      
      if (videoFiles.length > 0) {
        setLoadingText('파일 업로드 중...');
        const totalFiles = videoFiles.length;
        let uploadedBytes = 0;
        let totalBytes = videoFiles.reduce((sum, file) => sum + file.size, 0);
        
        for (let i = 0; i < videoFiles.length; i++) {
          const file = videoFiles[i];
          
          const urlResponse = await fetch('/api/reels-request/upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileSize: file.size,
              contentType: file.type,
            }),
          });

          if (!urlResponse.ok) {
            throw new Error('업로드 URL 생성에 실패했습니다.');
          }

          const urlData = await urlResponse.json();
          if (!urlData.success) {
            throw new Error('업로드 URL 생성에 실패했습니다.');
          }

          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
              if (e.lengthComputable) {
                const currentFileProgress = (e.loaded / e.total) * file.size;
                const totalProgress = ((uploadedBytes + currentFileProgress) / totalBytes) * 100;
                setUploadProgress(Math.min(totalProgress, 100));
              }
            });
            
            xhr.addEventListener('load', () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                uploadedBytes += file.size;
                resolve();
              } else {
                reject(new Error(`파일 업로드에 실패했습니다: ${file.name}`));
              }
            });
            
            xhr.addEventListener('error', () => {
              reject(new Error(`파일 업로드 중 오류가 발생했습니다: ${file.name}`));
            });
            
            xhr.open('PUT', urlData.data.uploadUrl);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file);
          });

          uploadedFiles.push({
            fileName: file.name,
            fileUrl: urlData.data.readUrl,
          });
        }
        
        setUploadProgress(undefined);
        setLoadingText('대본 생성 중...');
      }

      // 카테고리 필수 체크
      if (!category) {
        setSubmitError('카테고리를 선택해주세요.');
        setIsSubmitting(false);
        return;
      }

      const formData = {
        topic,
        content,
        category,
        additionalContent: additionalContent || null,
        videoLength: videoLength || null,
        files: uploadedFiles,
      };

      const response = await fetch('/api/reels-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || '대본 생성 중 오류가 발생했습니다.');
      }

      // 성공 처리
      videoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setTopic('');
      setContent('');
      setCategory('');
      setVideoFiles([]);
      setVideoPreviewUrls([]);
      setVideoLength('');
      setAdditionalContent('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error('제출 실패:', error);
      setSubmitError(error instanceof Error ? error.message : '대본 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(undefined);
      setLoadingText('생성 중...');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            기획·대본 제작
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            100만 조회수 릴스를 분석하여 나만의 릴스 기획과 대본을 생성해드립니다
          </p>
        </div>

        {/* 메인 컨텐츠 영역: 2단 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 왼쪽: 입력 폼 영역 */}
          <div className="order-2 lg:order-1">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* 카테고리 */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-2.5">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                {/* PC: 전체 너비에 맞게 4개 그리드, 모바일: 가로 스크롤 */}
                <div className="hidden lg:grid lg:grid-cols-4 gap-3">
                  {['일상', '지식·정보', '리뷰·추천', '서비스 소개'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCategory(option)}
                      className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        category === option
                          ? 'bg-gradient-to-r from-[#EB48B1] to-[#F59A39] text-white shadow-lg scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {/* 모바일: 가로 스크롤 */}
                <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'thin' }}>
                  <div className="flex gap-3 min-w-max">
                    {['일상', '지식·정보', '리뷰·추천', '서비스 소개'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setCategory(option)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                          category === option
                            ? 'bg-gradient-to-r from-[#EB48B1] to-[#F59A39] text-white shadow-lg scale-105'
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
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#EB48B1] focus:ring-4 focus:ring-pink-100 text-base text-gray-900 placeholder:text-base placeholder:text-gray-400 transition-all shadow-sm"
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
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#EB48B1] focus:ring-4 focus:ring-pink-100 resize-none overflow-hidden text-base text-gray-900 placeholder:text-base placeholder:text-gray-400 transition-all shadow-sm"
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
                  className="w-full px-4 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#EB48B1] hover:bg-pink-50/30 transition-all group"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Paperclip className="w-5 h-5 text-gray-400 group-hover:text-[#EB48B1] transition-colors" />
                    <span className="text-base text-gray-600 group-hover:text-gray-900">
                      {videoFiles.length > 0 
                        ? `${videoFiles.length}개 파일 선택됨`
                        : '여러 영상 파일 선택 가능'}
                    </span>
                  </div>
                </div>
                
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
                            {['30초 미만', '30-40초', '50-60초'].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setVideoLength(option)}
                                className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                  videoLength === option
                                    ? 'bg-gradient-to-r from-[#EB48B1] to-[#F59A39] text-white shadow-lg scale-105'
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
                            className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#EB48B1] focus:ring-4 focus:ring-pink-100 resize-none overflow-hidden text-base text-gray-900 placeholder:text-base placeholder:text-gray-400 transition-all shadow-sm"
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
                disabled={true}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#EB48B1] to-[#F59A39] text-white font-bold rounded-xl hover:from-[#D93D9F] hover:to-[#E6892F] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{loadingText}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>대본 생성하기</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 오른쪽: 결과/플레이스홀더 영역 */}
          <div className="hidden lg:block order-1 lg:order-2">
            <div className="sticky top-8" style={{ height: `${formHeight}px` }}>
              <div className="h-full bg-gradient-to-br from-white via-pink-50/30 to-orange-50/30 rounded-3xl border-2 border-gray-200 shadow-xl flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#EB48B1] to-[#F59A39] rounded-3xl blur-2xl opacity-20"></div>
                    <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-[#EB48B1] to-[#F59A39] rounded-3xl flex items-center justify-center shadow-2xl">
                      <FileText className="w-16 h-16 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    클릭 한 번으로<br />대본 생성!
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 로딩 오버레이 */}
      <LoadingOverlay isVisible={isSubmitting} text={loadingText} progress={uploadProgress} />

      {/* 성공 모달 */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="대본 생성 완료"
        description="Insta DM으로 연락드리겠습니다."
        icon={
          <Image
            src="/images/logo.png"
            alt="BooQuest"
            width={120}
            height={120}
            className="w-[120px] h-[120px]"
          />
        }
      />
    </div>
  );
}

