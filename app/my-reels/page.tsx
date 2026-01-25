// 나의 릴스 페이지: 생성중인 시나리오 및 완료된 시나리오 목록
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/api/auth';
import MyReelsClient from '@/app/my-reels/MyReelsClient';
import { JOB_STATUS } from '@/app/lib/constants/reels-creation';

// 캐시 방지 및 실시간 인증 상태 확인을 위해 강제 동적 렌더링 설정
export const dynamic = 'force-dynamic';

interface GeneratingScenario {
  id: string;
  jobId: string;
  title: string;
  progress: number;
  status?: string;
  isFailed?: boolean;
}

interface CompletedScenario {
  id: string;
  title: string;
  date: string; // YYYY.MM.DD
}

interface RevisionResponse {
  sessionId: string;
  reelTopic: string;
  status: string;
  jobId: string;
  createdAt: string;
}

interface ScriptRevisionsResponse {
  success: boolean;
  status: number;
  message: string;
  errorCode: string | null;
  data: {
    revisions: RevisionResponse[];
    totalCount: number;
  } | null;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export default async function MyReelsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login?returnUrl=' + encodeURIComponent('/my-reels'));
  }
  
  let generatingScenarios: GeneratingScenario[] = [];
  let completedScenarios: CompletedScenario[] = [];
  
  try {
    const { getServerApiClient } = await import('@/app/lib/api/server-client');
    const apiClient = await getServerApiClient();
    
    const response = await apiClient.get<ScriptRevisionsResponse>('/api/script/revisions');
    
    if (response.data.success && response.data.data?.revisions) {
      generatingScenarios = response.data.data.revisions
        .filter((revision) => revision.status === JOB_STATUS.PENDING)
        .map((revision) => ({
          id: revision.sessionId,
          jobId: revision.jobId,
          title: revision.reelTopic || '',
          progress: 0,
          status: revision.status,
        }));
      
      completedScenarios = response.data.data.revisions
        .filter((revision) => revision.status !== JOB_STATUS.PENDING)
        .map((revision) => ({
          id: revision.sessionId,
          title: revision.reelTopic || '',
          date: formatDate(revision.createdAt),
        }))
        .sort((a, b) => {
          const dateA = a.date.split('.').join('');
          const dateB = b.date.split('.').join('');
          return dateB.localeCompare(dateA);
        });
    }
  } catch (error: any) {
    console.error('[MyReelsPage] API 호출 실패:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }

  return (
    <MyReelsClient
      initialGeneratingScenarios={generatingScenarios}
      initialCompletedScenarios={completedScenarios}
    />
  );
}
