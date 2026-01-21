// 나의 릴스 페이지: 작업 중 / 완료된 프로젝트를 나누어 보여주는 대시보드 기본 뼈대
import React from 'react';
import { Folder } from 'lucide-react';

export default function MyReelsPage() {
  // TODO: 이후 실제 데이터 연동 시 작업중 / 완료된 프로젝트 리스트를 주입
  const inProgressProjects: any[] = [];
  const completedProjects: any[] = [];

  return (
    <div className="my-reels-page-container min-h-[70vh] w-full bg-gradient-to-b from-[#050816] to-[#02010A]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* 헤더 영역 */}
        <header className="my-reels-header mb-10 sm:mb-14">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            나의 릴스
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-400 font-medium">
            최근에 생성한 릴스 대본과 프로젝트 진행 상태를 한눈에 확인해보세요.
          </p>
        </header>

        <div className="my-reels-content space-y-14 sm:space-y-16">
          {/* 작업중인 프로젝트 섹션 */}
          <section className="my-reels-section my-reels-section-in-progress">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-6">
              작업중인 프로젝트
            </h2>

            {inProgressProjects.length === 0 ? (
              <div className="my-reels-empty-in-progress rounded-2xl border border-white/5 bg-white/5 px-6 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/70 to-orange-400/70 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-black">AI</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-semibold text-white">
                    아직 작업중인 릴스 프로젝트가 없습니다.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 font-medium">
                    릴스 제작 페이지에서 대본 생성을 시작하면 이곳에서 진행 상태를 확인할 수 있어요.
                  </p>
                </div>
              </div>
            ) : (
              <div className="my-reels-grid-in-progress grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* TODO: 이후 실제 카드 컴포넌트로 교체 */}
              </div>
            )}
          </section>

          {/* 완료된 프로젝트 섹션 */}
          <section className="my-reels-section my-reels-section-completed">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-6">
              완료된 프로젝트
            </h2>

            {completedProjects.length === 0 ? (
              <div className="my-reels-empty-completed flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-black/40 py-14 sm:py-16 px-4 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/10 border border-yellow-400/40">
                  <Folder className="h-9 w-9 text-yellow-300" />
                </div>
                <p className="text-base sm:text-lg font-semibold text-white mb-2">
                  아직 완료된 프로젝트가 없습니다
                </p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">
                  릴스 제작에서 대본 생성을 완료하고 적용하면, 이곳에서 완성된 프로젝트들을 모아서 볼 수 있어요.
                </p>
              </div>
            ) : (
              <div className="my-reels-grid-completed grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* TODO: 이후 실제 완료된 프로젝트 카드로 교체 */}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}


