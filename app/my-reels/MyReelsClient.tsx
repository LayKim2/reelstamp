'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';

interface GeneratingScenario {
  id: string;
  title: string;
  progress: number;
}

interface CompletedScenario {
  id: string;
  title: string;
  date: string;
}

interface MyReelsClientProps {
  initialGeneratingScenarios: GeneratingScenario[];
  initialCompletedScenarios: CompletedScenario[];
}

export default function MyReelsClient({
  initialGeneratingScenarios,
  initialCompletedScenarios,
}: MyReelsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 검색 필터링 (전체 리스트에서)
  const filteredScenarios = searchQuery
    ? initialCompletedScenarios.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : initialCompletedScenarios;

  // 페이지네이션 (필터링된 결과에서)
  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredScenarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedScenarios = filteredScenarios.slice(startIndex, startIndex + itemsPerPage);

  // 검색 시 첫 페이지로 리셋
  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 생성중인 시나리오 섹션 */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            생성중인 시나리오
          </h2>
          
          {initialGeneratingScenarios.length > 0 ? (
            <div className="space-y-4">
              {initialGeneratingScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-[#FFF0F3] rounded-xl px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-base sm:text-lg font-bold text-[#FF4081]">
                      생성 중 {scenario.progress}%
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-medium text-gray-900">
                    {scenario.title}
                  </span>
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
              paginatedScenarios.map((scenario, index) => (
                <div
                  key={scenario.id}
                  className={`flex items-center justify-between py-4 ${
                    index < paginatedScenarios.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
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
