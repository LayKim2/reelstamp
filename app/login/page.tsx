// 로그인 페이지: 네이버/카카오 소셜 로그인 제공
import { redirect } from 'next/navigation';
import LoginClient from './LoginClient';
import { getCurrentUser } from '@/app/lib/api/auth';

// 캐시 방지 및 실시간 인증 상태 확인을 위해 강제 동적 렌더링 설정
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  // 서버 사이드에서 로그인 여부 확인
  const user = await getCurrentUser();
  
  // 이미 로그인된 경우 메인으로 리다이렉트 (로그인 페이지 접근 절대 차단)
  if (user) {
    console.log(`[LoginPage SSR] 이미 로그인된 사용자(${user.nickname}), 리다이렉트 수행`);
    redirect('/');
  }

  return <LoginClient />;
}
