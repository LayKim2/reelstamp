// 콘텐츠 제작 페이지: 다양한 콘텐츠 제작 도구 목록
'use client';

import Link from 'next/link';
import { FileText, Video, ArrowRight } from 'lucide-react';

export default function ContentsPage() {
  return (
    <div className="bg-gradient-to-br from-pink-50/30 via-white to-orange-50/30 min-h-screen">
      <div className="w-full pt-8 sm:pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              릴스 제작
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto whitespace-nowrap overflow-hidden text-ellipsis">
                100만 이상 조회수의 릴스로 훈련된 AI 기반 도구로 더 쉽고 빠르게 나만의 릴스를 만들어보세요.
            </p>
          </div>

          {/* 도구 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* 기획·대본 제작 카드 */}
            <Link
              href="/contents/script-creation"
              className="group relative bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-[1.03] hover:border-transparent transition-all duration-500 ease-out overflow-hidden"
            >
              {/* 그라데이션 테두리 효과 */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#EB48B1]/0 via-[#EB48B1]/0 to-[#F59A39]/0 group-hover:from-[#EB48B1]/20 group-hover:via-[#EB48B1]/10 group-hover:to-[#F59A39]/20 transition-all duration-500 pointer-events-none opacity-0 group-hover:opacity-100 blur-xl" />
              
              {/* 카드 내용 */}
              <div className="relative p-7 flex flex-col h-full bg-white/80 backdrop-blur-sm">
                {/* 상단: 아이콘 + 배지 */}
                <div className="flex items-start justify-between mb-5">
                  {/* 아이콘 영역 - 더 세련된 디자인 */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#EB48B1] to-[#F59A39] rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EB48B1] to-[#F59A39] flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <FileText className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                </div>

                {/* 제목 */}
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-[#EB48B1] group-hover:to-[#F59A39] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  기획·대본 제작
                </h3>

                {/* 설명 */}
                <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-6 line-clamp-3">
                  나만의 릴스 기획과 대본 생성해주는 도구
                </p>

                {/* 하단: CTA 버튼 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-pink-200/50 transition-colors">
                  <span className="text-xs font-semibold text-gray-500 group-hover:text-[#EB48B1] transition-colors">
                    시작하기
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EB48B1] to-[#F59A39] flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                </div>

                {/* 호버 시 배경 그라데이션 효과 */}
                <div className="absolute -inset-1 bg-gradient-to-br from-[#EB48B1]/10 via-transparent to-[#F59A39]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl" />
              </div>
            </Link>

            {/* 영상 편집 카드 */}
            <div
              className="relative bg-white rounded-3xl shadow-lg border border-gray-200 opacity-60 cursor-not-allowed overflow-hidden"
            >
              {/* 그라데이션 테두리 효과 */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 blur-xl" />
              
              {/* 카드 내용 */}
              <div className="relative p-7 flex flex-col h-full bg-white/80 backdrop-blur-sm">
                {/* 상단: 아이콘 + 배지 */}
                <div className="flex items-start justify-between mb-5">
                  {/* 아이콘 영역 - 더 세련된 디자인 */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#EB48B1] to-[#F59A39] rounded-2xl blur-md opacity-50" />
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EB48B1] to-[#F59A39] flex items-center justify-center shadow-lg">
                      <Video className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                </div>

                {/* 제목 */}
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                  영상 편집
                </h3>

                {/* 설명 */}
                <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-6 line-clamp-3">
                  자동 편집 도구로 빠르고 쉽게 릴스 영상을 완성해주는 편집 솔루션
                </p>

                {/* 하단: CTA 버튼 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-500">
                    시작하기
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EB48B1] to-[#F59A39] flex items-center justify-center shadow-md">
                    <ArrowRight className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                </div>

                {/* 호버 시 배경 그라데이션 효과 */}
                <div className="absolute -inset-1 bg-gradient-to-br from-[#EB48B1]/10 via-transparent to-[#F59A39]/10 rounded-3xl opacity-0 -z-10 blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

