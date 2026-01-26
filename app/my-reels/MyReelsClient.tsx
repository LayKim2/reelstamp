'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, Loader2 } from 'lucide-react';
import { JOB_STATUS } from '@/app/lib/constants/reels-creation';

interface GeneratingScenario {
  id: string;
  jobId: string;
  title: string;
  progress: number;
  displayProgress: number;
  status?: string;
  isFailed?: boolean;
}

interface CompletedScenario {
  id: string;
  title: string;
  date: string;
}

interface InitialGeneratingScenario {
  id: string;
  jobId: string;
  title: string;
  progress: number;
  status?: string;
  isFailed?: boolean;
}

interface MyReelsClientProps {
  initialGeneratingScenarios: InitialGeneratingScenario[];
  initialCompletedScenarios: CompletedScenario[];
}

interface JobStatusResponse {
  success: boolean;
  status: number;
  message: string;
  errorCode: string | null;
  data: {
    jobId: string;
    status: string;
    progressPercentage: number;
    errorMessage?: string;
  } | null;
}

export default function MyReelsClient({
  initialGeneratingScenarios,
  initialCompletedScenarios,
}: MyReelsClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [generatingScenarios, setGeneratingScenarios] = useState<GeneratingScenario[]>(
    initialGeneratingScenarios.map((s) => ({ ...s, displayProgress: s.progress }))
  );
  const pollingIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const animationIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const generatingAnimationsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const filteredScenarios = searchQuery
    ? initialCompletedScenarios.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : initialCompletedScenarios;

  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredScenarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedScenarios = filteredScenarios.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const animateProgress = (jobId: string, start: number, end: number) => {
    const existingInterval = animationIntervalsRef.current.get(jobId);
    if (existingInterval) {
      clearInterval(existingInterval);
    }
    
    const duration = 1000;
    const steps = 30;
    const stepTime = duration / steps;
    const stepValue = (end - start) / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(
        Math.round(start + stepValue * currentStep),
        end
      );
      
      setGeneratingScenarios((prev) =>
        prev.map((s) =>
          s.jobId === jobId ? { ...s, displayProgress: currentProgress } : s
        )
      );
      
      if (currentStep >= steps || currentProgress >= end) {
        clearInterval(interval);
        animationIntervalsRef.current.delete(jobId);
        setGeneratingScenarios((prev) =>
          prev.map((s) =>
            s.jobId === jobId ? { ...s, displayProgress: end } : s
          )
        );
      }
    }, stepTime);
    
    animationIntervalsRef.current.set(jobId, interval);
  };

  useEffect(() => {
    const pollJobStatus = async (jobId: string) => {
      try {
        console.log('[Polling Request]', { jobId, url: `/api/script/revisions/jobs/${jobId}` });
        const response = await fetch(`/api/script/revisions/jobs/${jobId}`);
        
        if (!response.ok) {
          // jobId 에러면 polling 중단
          console.error(`[Polling Error] Job ${jobId} not found`, { status: response.status });
          stopPolling(jobId);
          return;
        }

        const data: JobStatusResponse = await response.json();
        
        if (data.success && data.data) {
          const { status, progressPercentage } = data.data;
          
          if (status === JOB_STATUS.FAILED) {
            stopPolling(jobId);
            setGeneratingScenarios((prev) =>
              prev.map((s) =>
                s.jobId === jobId
                  ? {
                      ...s,
                      progress: progressPercentage,
                      status: status,
                      isFailed: true,
                    }
                  : s
              )
            );
            return;
          }
          
          setGeneratingScenarios((prev) => {
            const scenario = prev.find((s) => s.jobId === jobId);
            
            if (status === JOB_STATUS.GENERATING && !generatingAnimationsRef.current.has(jobId)) {
              const startProgress = scenario?.displayProgress || 40;
              const endProgress = 90;
              const totalDuration = 30000;
              let currentProgress = startProgress;
              const startTime = Date.now();
              
              setGeneratingScenarios((prev) =>
                prev.map((s) =>
                  s.jobId === jobId
                    ? { ...s, progress: 40, displayProgress: startProgress, status: status, isFailed: false }
                    : s
                )
              );
              
              const updateProgress = () => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= totalDuration) {
                  generatingAnimationsRef.current.delete(jobId);
                  setGeneratingScenarios((prev) =>
                    prev.map((s) =>
                      s.jobId === jobId ? { ...s, progress: 90, displayProgress: 90 } : s
                    )
                  );
                  return;
                }
                
                // 랜덤하게 증가
                const randomIncrement = Math.random() * 3;
                const shouldIncrement = Math.random() > 0.1;
                const bigJump = Math.random() < 0.05;
                
                if (shouldIncrement) {
                  const increment = bigJump ? 3 + Math.random() * 2 : randomIncrement;
                  currentProgress = Math.min(
                    Math.round(currentProgress + increment),
                    endProgress
                  );
                }
                
                // 랜덤한 간격으로 업데이트
                const nextInterval = 300 + Math.random() * 1200;
                
                setGeneratingScenarios((prev) =>
                  prev.map((s) =>
                    s.jobId === jobId ? { ...s, progress: currentProgress, displayProgress: currentProgress } : s
                  )
                );
                
                const timeout = setTimeout(updateProgress, nextInterval);
                generatingAnimationsRef.current.set(jobId, timeout);
              };
              
              const initialTimeout = setTimeout(updateProgress, 300 + Math.random() * 1200);
              generatingAnimationsRef.current.set(jobId, initialTimeout);
            }
            
            if (status !== JOB_STATUS.GENERATING && generatingAnimationsRef.current.has(jobId)) {
              const timeout = generatingAnimationsRef.current.get(jobId);
              if (timeout) {
                clearTimeout(timeout);
                generatingAnimationsRef.current.delete(jobId);
              }
            }
            
            const targetProgress = status === JOB_STATUS.GENERATING 
              ? (scenario?.progress || progressPercentage)
              : progressPercentage;
            
            const updated = prev.map((s) =>
              s.jobId === jobId
                ? {
                    ...s,
                    progress: targetProgress,
                    status: status,
                    isFailed: false,
                  }
                : s
            );
            
            const updatedScenario = updated.find((s) => s.jobId === jobId);
            if (updatedScenario) {
              if (status !== JOB_STATUS.GENERATING && updatedScenario.progress !== updatedScenario.displayProgress) {
                animateProgress(jobId, updatedScenario.displayProgress, updatedScenario.progress);
              }
              
              if (status === JOB_STATUS.SUCCEEDED && progressPercentage >= 100) {
                stopPolling(jobId);
                generatingAnimationsRef.current.delete(jobId);
                setTimeout(() => {
                  setGeneratingScenarios((prev) => prev.filter((s) => s.jobId !== jobId));
                  router.refresh();
                }, 1000);
              }
            }
            
            return updated;
          });
        }
      } catch (error) {
        stopPolling(jobId);
      }
    };

    const startPolling = (jobId: string) => {
      if (pollingIntervalsRef.current.has(jobId)) {
        return;
      }

      pollJobStatus(jobId);
      const interval = setInterval(() => {
        pollJobStatus(jobId);
      }, 2000);

      pollingIntervalsRef.current.set(jobId, interval);
    };

    const stopPolling = (jobId: string) => {
      const interval = pollingIntervalsRef.current.get(jobId);
      if (interval) {
        clearInterval(interval);
        pollingIntervalsRef.current.delete(jobId);
      }
    };

    initialGeneratingScenarios.forEach((scenario) => {
      startPolling(scenario.jobId);
    });

    return () => {
      pollingIntervalsRef.current.forEach((interval) => {
        clearInterval(interval);
      });
      pollingIntervalsRef.current.clear();
      
      animationIntervalsRef.current.forEach((interval) => {
        clearInterval(interval);
      });
      animationIntervalsRef.current.clear();
      
      generatingAnimationsRef.current.forEach((interval) => {
        clearInterval(interval);
      });
      generatingAnimationsRef.current.clear();
    };
  }, [initialGeneratingScenarios, router]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 생성중인 시나리오 섹션 */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            생성중인 시나리오
          </h2>
          
          {generatingScenarios.length > 0 ? (
            <div className="space-y-4">
              {generatingScenarios.map((scenario, index) => (
                <div
                  key={`generating-${scenario.id}-${index}`}
                  className="bg-[#FFF0F3] rounded-xl px-6 py-4 flex items-center justify-between"
                >
                  <span
                    className={`text-base sm:text-lg font-medium ${
                      scenario.isFailed ? 'text-red-700' : 'text-gray-900'
                    }`}
                  >
                    {scenario.isFailed ? `[Failed] ${scenario.title}` : scenario.title}
                  </span>
                  <div className="flex items-center gap-3">
                    {!scenario.isFailed && (
                      <Loader2 className="w-5 h-5 text-[#FF4081] animate-spin" />
                    )}
                    <span
                      className={`text-base sm:text-lg font-bold ${
                        scenario.isFailed ? 'text-red-700' : 'text-[#FF4081]'
                      }`}
                    >
                      {scenario.isFailed ? '실패' : `생성 중 ${scenario.displayProgress}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#FFF0F3] rounded-xl px-6 py-4 text-center text-gray-600 text-sm sm:text-base">
              생성중인 시나리오가 없습니다.
            </div>
          )}
        </section>

        {/* 완료된 시나리오 섹션 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              완료된 시나리오 {initialCompletedScenarios.length}
            </h2>
            
            {/* 검색 바 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF496D]/20 focus:border-[#FF496D] w-48"
              />
            </div>
          </div>

          {/* 시나리오 리스트 */}
          <div className="space-y-0">
            {paginatedScenarios.length > 0 ? (
              paginatedScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  onClick={() => router.push(`/contents/script-creation/result?sessionId=${scenario.id}`)}
                  className={`my-reels-scenario-item flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0`}
                >
                  <span className="text-base sm:text-lg font-medium text-gray-900">
                    {scenario.title}
                  </span>
                  <span className="text-base sm:text-lg font-medium text-gray-600">
                    {scenario.date}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-600 text-sm sm:text-base">
                검색 결과가 없습니다.
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm sm:text-base font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-[#FF496D] text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {page}
                </button>
              ))}
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
