'use client';

// 관리자 대본 생성 이력 조회 훅: /api/admin/revisions를 React Query로 호출
import { useQuery } from '@tanstack/react-query';

interface AdminRevisionUser {
  userId: number;
  email: string;
  nickname: string;
  socialNickname: string;
  profileImageUrl: string;
  role: string;
}

export interface AdminRevision {
  revisionId: string;
  sessionId: string;
  revisionIndex: number;
  parentRevisionId: string | null;
  source: string;
  reelType: string;
  reelTopic: string;
  userRequest: string;
  extraRequest: string;
  reelLengthLabel: string;
  finalLengthSeconds: number;
  lengthReason: string;
  templateName: string;
  scriptText: string;
  updateRequest: string;
  videoProvided: boolean;
  videoSourceMode: string;
  videoSourceMap: string;
  isApplied: boolean;
  selectedStructureId: string;
  selectedStructureName: string;
  createdAt: string;
  user: AdminRevisionUser;
}

interface AdminRevisionsResponse {
  success: boolean;
  status: number;
  message: string;
  errorCode: string | null;
  data: {
    revisions: AdminRevision[];
    totalCount: number;
  } | null;
}

async function fetchAdminRevisions(): Promise<AdminRevisionsResponse> {
  const res = await fetch('/api/admin/revisions', {
    method: 'GET',
  });

  const json = (await res.json()) as AdminRevisionsResponse;

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || '관리자 대본 생성 이력을 가져오는 데 실패했습니다.');
  }

  return json;
}

export function useAdminRevisions() {
  return useQuery({
    queryKey: ['admin', 'revisions'],
    queryFn: fetchAdminRevisions,
    staleTime: 5 * 60 * 1000,
  });
}

