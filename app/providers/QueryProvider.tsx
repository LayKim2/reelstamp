// React Query Provider: 서버 상태 관리 및 데이터 페칭을 위한 QueryClient 제공
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // QueryClient 인스턴스 생성 (상태로 관리하여 재생성 방지)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 에러 재시도 설정
            retry: 1,
            // 데이터 stale 시간 (5분)
            staleTime: 5 * 60 * 1000,
            // 캐시 시간 (10분)
            gcTime: 10 * 60 * 1000,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

