// 나의 릴스 페이지: 생성중인 시나리오 및 완료된 시나리오 목록
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/api/auth';
import MyReelsClient from '@/app/my-reels/MyReelsClient';

// 캐시 방지 및 실시간 인증 상태 확인을 위해 강제 동적 렌더링 설정
export const dynamic = 'force-dynamic';

interface GeneratingScenario {
  id: string;
  title: string;
  progress: number; // 0-100
}

interface CompletedScenario {
  id: string;
  title: string;
  date: string; // YYYY.MM.DD
}

export default async function MyReelsPage() {
  // 서버 사이드에서 로그인 여부 확인
  const user = await getCurrentUser();
  
  // 로그인하지 않았으면 로그인 페이지로 리다이렉트 (원래 경로를 쿼리 파라미터로 전달)
  if (!user) {
    redirect('/login?returnUrl=' + encodeURIComponent('/my-reels'));
  }
  
  // TODO: 이후 실제 데이터 연동 시 작업중 / 완료된 프로젝트 리스트를 API에서 가져오기
  // 예: const scenarios = await fetchUserScenarios(user.id);
  const generatingScenarios: GeneratingScenario[] = [
    { id: '1', title: '시나리오 타이틀', progress: 30 }
  ];
  
  const completedScenarios: CompletedScenario[] = [
    { id: '1', title: '완료된 시나리오 타이틀1', date: '2025.01.21' },
    { id: '2', title: '완료된 시나리오 타이틀2', date: '2025.01.20' },
    { id: '3', title: '완료된 시나리오 타이틀3', date: '2025.01.19' },
    { id: '4', title: '완료된 시나리오 타이틀4', date: '2025.01.18' },
    { id: '5', title: '완료된 시나리오 타이틀5', date: '2025.01.17' },
    { id: '6', title: '완료된 시나리오 타이틀6', date: '2025.01.16' },
    { id: '7', title: '완료된 시나리오 타이틀7', date: '2025.01.15' },
  ];

  return (
    <MyReelsClient
      initialGeneratingScenarios={generatingScenarios}
      initialCompletedScenarios={completedScenarios}
    />
  );
}
