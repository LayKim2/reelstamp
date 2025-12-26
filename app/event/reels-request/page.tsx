'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Modal from '@/app/components/ui/Modal';
import LoadingOverlay from '@/app/components/ui/LoadingOverlay';

// 릴스 기획·대본 이벤트 신청 폼 페이지
export default function ReelsRequestPage() {
  // 폼 상태 관리
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  const [instagramId, setInstagramId] = useState('');
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);
  const [videoLength, setVideoLength] = useState('');
  const [additionalContent, setAdditionalContent] = useState('');
  const [agreedToPrivacyPolicy, setAgreedToPrivacyPolicy] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  // Preview URL cleanup (메모리 누수 방지)
  useEffect(() => {
    return () => {
      videoPreviewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [videoPreviewUrls]);
  
  // 제출 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | undefined>(undefined);
  const [loadingText, setLoadingText] = useState('신청 중...');

  // 파일 선택 핸들러: 여러 파일 선택 가능 (기존 파일 유지하며 추가)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFileError(null);

    if (newFiles.length === 0) {
      // 파일 선택 취소 시 기존 파일 유지
      if (fileInputRef.current) {
        // 기존 파일들을 다시 설정
        const dataTransfer = new DataTransfer();
        videoFiles.forEach((f) => dataTransfer.items.add(f));
        fileInputRef.current.files = dataTransfer.files;
      }
      return;
    }

    try {
      // 기존 파일에 새 파일 추가 (제한 없음)
      const allFiles = [...videoFiles, ...newFiles];
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      const allPreviewUrls = [...videoPreviewUrls, ...newPreviewUrls];
      
      setVideoFiles(allFiles);
      setVideoPreviewUrls(allPreviewUrls);
      
      // 파일 입력 업데이트 (모든 파일 포함)
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        allFiles.forEach((f) => dataTransfer.items.add(f));
        fileInputRef.current.files = dataTransfer.files;
      }
    } catch (error) {
      console.error('파일 처리 실패:', error);
      setFileError('파일을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.');
      // 파일 입력 초기화 (기존 파일은 유지)
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 제출 핸들러: 파일을 presigned URL로 직접 업로드한 후 폼 데이터 전송
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // 파일 업로드 (presigned URL 사용)
      const uploadedFiles: Array<{ fileName: string; fileUrl: string }> = [];
      
      if (videoFiles.length > 0) {
        setLoadingText('파일 업로드 중...');
        const totalFiles = videoFiles.length;
        let uploadedBytes = 0;
        let totalBytes = videoFiles.reduce((sum, file) => sum + file.size, 0);
        
        // 각 파일에 대해 presigned URL 생성 및 업로드
        for (let i = 0; i < videoFiles.length; i++) {
          const file = videoFiles[i];
          
          // 1. Presigned URL 생성 요청
          const urlResponse = await fetch('/api/reels-request/upload-url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileName: file.name,
              fileSize: file.size,
              contentType: file.type,
              instagramId: instagramId, 
            }),
          });

          if (!urlResponse.ok) {
            let errorData;
            try {
              errorData = await urlResponse.json();
            } catch {
              const text = await urlResponse.text();
              console.error('API 응답 파싱 실패:', text.substring(0, 200));
              throw new Error(`서버 오류가 발생했습니다. (${urlResponse.status})`);
            }
            throw new Error(errorData.error?.message || '업로드 URL 생성에 실패했습니다.');
          }

          const urlData = await urlResponse.json();
          if (!urlData.success) {
            throw new Error(urlData.error?.message || '업로드 URL 생성에 실패했습니다.');
          }

          // 2. Presigned URL로 파일 직접 업로드 (XMLHttpRequest로 진행률 추적)
          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
              if (e.lengthComputable) {
                // 현재 파일까지 업로드된 바이트 + 현재 파일의 업로드 진행률
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
                reject(new Error(`파일 업로드에 실패했습니다: ${file.name} (${xhr.status})`));
              }
            });
            
            xhr.addEventListener('error', () => {
              reject(new Error(`파일 업로드 중 오류가 발생했습니다: ${file.name}`));
            });
            
            xhr.open('PUT', urlData.data.uploadUrl);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file);
          });

          // 3. 읽기용 presigned URL 저장 (원래 코드와 동일)
          uploadedFiles.push({
            fileName: file.name,
            fileUrl: urlData.data.readUrl, // 읽기용 presigned URL (1년 유효)
          });
        }
        
        // 파일 업로드 완료 후 진행률 초기화 및 텍스트 변경
        setUploadProgress(undefined);
        setLoadingText('신청 중...');
      }

      // 개인정보 동의 확인
      if (!agreedToPrivacyPolicy) {
        setSubmitError('개인정보 수집 및 이용에 동의해주세요.');
        setIsSubmitting(false);
        return;
      }

      // 4. 폼 데이터 전송 (파일 URL 포함)
      const formData = {
        topic,
        content,
        instagramId,
        additionalContent: additionalContent || null,
        videoLength: videoLength || null,
        files: uploadedFiles,
        agreedToPrivacyPolicy,
      };

      // API 엔드포인트 호출
      const response = await fetch('/api/reels-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || '신청 처리 중 오류가 발생했습니다.');
      }

      // 성공 처리
      setSubmitSuccess(true);
      
      // 폼 초기화
      setTopic('');
      setContent('');
      // Preview URL 정리
      videoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setVideoFiles([]);
      setVideoPreviewUrls([]);
      setInstagramId('');
      setVideoLength('');
      setAdditionalContent('');
      setAgreedToPrivacyPolicy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // 성공 모달 표시
      setShowSuccessModal(true);
    } catch (error) {
      console.error('제출 실패:', error);
      setSubmitError(error instanceof Error ? error.message : '신청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(undefined);
      setLoadingText('신청 중...');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 제목 */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          릴스 기획·대본 이벤트 신청
        </h1>

        {/* 안내 문구 */}
        <p className="text-sm text-gray-900 mb-8 leading-relaxed">
          100만뷰 이상 성공 릴스 분석을 바탕으로
          <br />
          릴스 대본과 영상 편집 방향을 출력해드립니다.
        </p>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
          {/* 릴스 주제 */}
          <div>
            <label htmlFor="topic" className="block text-sm font-semibold text-gray-900 mb-2">
              릴스 주제 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#EB48B1] to-[#F59A39] opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none -z-10 blur-[1px]"></div>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="만들고자 하는 영상 주제를 입력해주세요. (ex. 연말정산 꿀팁 5가지 소개)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent text-sm text-gray-900 placeholder:text-xs placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-[#EB48B1] focus:shadow-[0_0_0_3px_rgba(235,72,177,0.2),0_0_0_1px_rgba(245,154,57,0.3)]"
                required
              />
            </div>
          </div>

          {/* 릴스 내용 */}
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-2">
              릴스 내용 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#EB48B1] to-[#F59A39] opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none -z-10 blur-[1px]"></div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="릴스에 담고 싶은 내용을 자유롭게 작성해주세요.&#10;구체적일수록 나만의 컨셉이 반영된 기획과 대본이 제공됩니다."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent resize-none text-sm text-gray-900 placeholder:text-[13px] placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-[#EB48B1] focus:shadow-[0_0_0_3px_rgba(235,72,177,0.2),0_0_0_1px_rgba(245,154,57,0.3)]"
                required
              />
            </div>
          </div>

          {/* 영상 소스 */}
          <div>
            <label htmlFor="video" className="block text-sm font-semibold text-gray-900 mb-2">
              영상 소스 <span className="text-gray-500 text-xs font-normal">(선택)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#EB48B1] to-[#F59A39] opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none -z-10 blur-[1px]"></div>
              {/* 숨겨진 실제 file input */}
              <input
                type="file"
                id="video"
                ref={fileInputRef}
                accept="video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              {/* 커스텀 file input 박스 */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-all focus-within:ring-2 focus-within:ring-[#EB48B1] focus-within:shadow-[0_0_0_3px_rgba(235,72,177,0.2),0_0_0_1px_rgba(245,154,57,0.3)] flex items-center justify-between"
              >
                <span className="text-xs text-gray-500">
                  {videoFiles.length > 0 
                    ? `${videoFiles.length}개 파일 선택됨`
                    : '여러 영상 파일 선택 가능'}
                </span>
                <Paperclip className="w-5 h-5 text-gray-400" />
              </div>
              
              {/* 영상 Preview 섹션 */}
              {videoPreviewUrls.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {/* Preview 제목 */}
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Preview
                  </label>
                  
                  {/* Preview 컨테이너 */}
                  <div className="relative">
                    {/* 좌측 화살표 버튼 (PC에서만 표시, 여러 개일 때만) */}
                    {videoFiles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (previewScrollRef.current) {
                            previewScrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
                          }
                        }}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2.5 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all"
                        aria-label="이전 영상"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                    )}
                    
                    {/* Preview 스크롤 컨테이너 - 모바일에서 peek effect */}
                    <div className={`${videoFiles.length > 1 ? 'overflow-hidden md:overflow-visible -mx-6 md:mx-0 px-6 md:px-0 sm:-mx-8 sm:px-8' : ''}`}>
                      <div 
                        ref={previewScrollRef}
                        className={`flex ${videoFiles.length > 1 ? 'gap-3 md:gap-4 overflow-x-auto' : ''} pb-3 md:pb-2 scroll-smooth`}
                        style={{ 
                          scrollbarWidth: 'thin',
                        }}
                      >
                        {videoFiles.map((file, index) => (
                          <div 
                            key={index} 
                            className={videoFiles.length > 1 ? 'relative flex-shrink-0' : 'relative w-full'}
                            style={videoFiles.length > 1 ? { 
                              // 모바일에서 peek effect: 카드 너비를 화면의 약 85%로 설정하여 다음 카드가 확실히 보이도록
                              width: '85vw',
                              maxWidth: '320px',
                            } : {}}
                          >
                          {/* 영상 카드 */}
                          <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <video
                              src={videoPreviewUrls[index]}
                              controls
                              className="w-full h-full object-contain"
                            />
                            {/* Preview 제거 버튼 */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                // 해당 파일 제거
                                const newFiles = videoFiles.filter((_, i) => i !== index);
                                const newUrls = videoPreviewUrls.filter((_, i) => i !== index);
                                
                                // 제거된 파일의 URL 정리
                                URL.revokeObjectURL(videoPreviewUrls[index]);
                                
                                setVideoFiles(newFiles);
                                setVideoPreviewUrls(newUrls);
                                
                                // 파일 입력도 업데이트 (DataTransfer 사용)
                                if (fileInputRef.current) {
                                  const dataTransfer = new DataTransfer();
                                  newFiles.forEach((f) => dataTransfer.items.add(f));
                                  fileInputRef.current.files = dataTransfer.files;
                                }
                              }}
                              className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur-sm"
                              aria-label="영상 제거"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* 파일 정보 */}
                          <div className="mt-3 px-1">
                            <p className="text-xs font-medium text-gray-700 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                    
                    {/* 우측 화살표 버튼 (PC에서만 표시, 여러 개일 때만) */}
                    {videoFiles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (previewScrollRef.current) {
                            previewScrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
                          }
                        }}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2.5 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all"
                        aria-label="다음 영상"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* 파일 에러 메시지 */}
              {fileError && (
                <p className="mt-2 text-xs text-red-600">{fileError}</p>
              )}
            </div>
          </div>

          

          {/* 추가 사항 (접을 수 있는 섹션) */}
          <div className="border border-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => setIsAdditionalOpen(!isAdditionalOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <span>추가 사항 <span className="text-gray-500 text-xs font-normal">(선택)</span></span>
              <span className={`transform transition-transform ${isAdditionalOpen ? 'rotate-180' : ''}`}>
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
                  <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
                    {/* 영상 길이 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        영상 길이 <span className="text-gray-500 text-xs font-normal">(선택)</span>
                      </label>
                      <div className="flex gap-3">
                        {['30초 미만', '30-40초', '50-60초'].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setVideoLength(option)}
                            className={`flex-1 px-4 py-3 border rounded-lg text-sm font-medium transition-all ${
                              videoLength === option
                                ? 'border-transparent bg-gradient-to-r from-[#EB48B1] to-[#F59A39] text-white shadow-md'
                                : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <input
                        type="hidden"
                        name="videoLength"
                        value={videoLength}
                      />
                    </div>

                {/* 꼭 담고싶은 내용 */}
                <div>
                  <label htmlFor="additionalContent" className="block text-sm font-semibold text-gray-900 mb-2">
                    꼭 담고싶은 내용과 영상 소스 <span className="text-gray-500 text-xs font-normal">(선택)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#EB48B1] to-[#F59A39] opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none -z-10 blur-[1px]"></div>
                    <textarea
                      id="additionalContent"
                      value={additionalContent}
                      onChange={(e) => setAdditionalContent(e.target.value)}
                      rows={4}
                      placeholder="릴스에 꼭 담고 싶은 내용, 영상 소스, 또는 컨셉이 있다면 작성해주세요.&#10;기획과 대본에 반영됩니다."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent resize-none text-sm text-gray-900 placeholder:text-[13px] placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-[#EB48B1] focus:shadow-[0_0_0_3px_rgba(235,72,177,0.2),0_0_0_1px_rgba(245,154,57,0.3)]"
                    />
                  </div>
                </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 인스타그램 아이디 */}
          <div>
            <label htmlFor="instagramId" className="block text-sm font-semibold text-gray-900 mb-2">
              인스타그램 아이디 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#EB48B1] to-[#F59A39] opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none -z-10 blur-[1px]"></div>
              <input
                type="text"
                id="instagramId"
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value)}
                placeholder="@ 없이 입력해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent text-sm text-gray-900 placeholder:text-xs placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-[#EB48B1] focus:shadow-[0_0_0_3px_rgba(235,72,177,0.2),0_0_0_1px_rgba(245,154,57,0.3)]"
                required
              />
            </div>
          </div>

          {/* 안내 문구 */}
          <p className="text-sm text-gray-900 leading-relaxed">
          선정 여부는 기재된 인스타그램 계정으로 24시간 내 안내드립니다.
          </p>

          {/* 개인정보 수집 및 이용 동의 */}
          <div className="pt-2 pb-2">
            <div className="space-y-3">
              {/* 헤더: 체크박스 + 제목 + 펼치기 아이콘 */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="privacy-policy-checkbox"
                  checked={agreedToPrivacyPolicy}
                  onChange={(e) => setAgreedToPrivacyPolicy(e.target.checked)}
                  className="w-4 h-4 text-[#EB48B1] border-gray-300 rounded focus:ring-2 focus:ring-[#EB48B1] focus:ring-offset-0 cursor-pointer"
                  required
                />
                <div className="flex-1 flex items-center justify-between">
                  <label 
                    htmlFor="privacy-policy-checkbox"
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    개인정보 수집 및 이용에 동의합니다 <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPrivacyPolicyOpen(!isPrivacyPolicyOpen)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    aria-label={isPrivacyPolicyOpen ? '접기' : '펼치기'}
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        isPrivacyPolicyOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 상세 내용 (접기/펼치기) */}
              <AnimatePresence>
                {isPrivacyPolicyOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden pl-7"
                  >
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 mt-2">
                      <div className="text-xs text-gray-700 leading-relaxed space-y-2.5">
                        <p className="flex items-start gap-2">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span>이벤트 신청 확인 및 결과물 전달을 위해 개인정보를 수집·이용합니다.</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span>이벤트 종료 및 결과물 전달 완료 후 업로드된 영상 파일과 입력하신 신청 내용은 즉시 파기됩니다.</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span>이벤트를 통해 완성된 결과물은 릴스탬프의 홍보 및 마케팅을 위해 활용될 수 있습니다.</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 에러 메시지 */}
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}


          {/* 버튼 */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-[#EB48B1] to-[#F59A39] text-white font-semibold rounded-lg hover:from-[#D93D9F] hover:to-[#E6892F] transition-all shadow-md hover:shadow-lg max-w-xs mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '처리 중...' : '신청하기'}
            </button>
          </div>
        </form>
      </div>

      {/* 로딩 오버레이 */}
      <LoadingOverlay isVisible={isSubmitting} text={loadingText} progress={uploadProgress} />

      {/* 신청 완료 모달 */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="신청 완료"
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

