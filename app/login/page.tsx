// 로그인 페이지: 네이버/카카오 소셜 로그인 제공
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { loginWithSocialAction } from '@/app/actions/auth';
import { useAuth } from '@/app/components/providers/AuthProvider';
import LoadingOverlay from '@/app/components/ui/LoadingOverlay';

// 카카오 SDK 타입 정의
declare global {
  interface Window {
    Kakao: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isLoadingKakao, setIsLoadingKakao] = useState(false);
  const [isLoadingNaver, setIsLoadingNaver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('로그인 중...');

  // 카카오 SDK 초기화
  const initKakao = () => {
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
      if (!kakaoKey) {
        console.warn('NEXT_PUBLIC_KAKAO_JS_KEY 환경 변수가 설정되지 않았습니다.');
        return;
      }
      window.Kakao.init(kakaoKey);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.Kakao) {
        initKakao();
        clearInterval(timer);
      }
    }, 1000);

    // URL 파라미터 확인 (인가 코드 처리)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code) {
      // state가 있으면 네이버, 없으면 카카오로 판단
      if (state) {
        handleNaverCode(code, state);
      } else {
        handleKakaoCode(code);
      }
    }

    return () => clearInterval(timer);
  }, []);

  // [카카오] 인가 코드를 액세스 토큰으로 교환
  const handleKakaoCode = async (code: string) => {
    setIsLoadingKakao(true);
    setLoadingText('카카오 로그인 처리 중...');
    setError(null);
    try {
      const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
      if (!kakaoKey) throw new Error('카카오 API 키가 설정되지 않았습니다.');

      const redirectUri = `${window.location.origin}/login`;
      const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: kakaoKey,
          redirect_uri: redirectUri,
          code: code,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) throw new Error(tokenData.error_description || '카카오 토큰 교환 실패');

      await processLogin(tokenData.access_token, 'KAKAO', setIsLoadingKakao);
    } catch (err: any) {
      setError(err.message);
      setIsLoadingKakao(false);
    }
  };

  // [네이버] 인가 코드를 액세스 토큰으로 교환
  const handleNaverCode = async (code: string, state: string) => {
    setIsLoadingNaver(true);
    setLoadingText('네이버 로그인 처리 중...');
    setError(null);
    try {
      const response = await fetch('/api/auth/naver-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '네이버 토큰 교환 실패');

      await processLogin(data.access_token, 'NAVER', setIsLoadingNaver);
    } catch (err: any) {
      setError(err.message);
      setIsLoadingNaver(false);
    }
  };

  // 공통 로그인 처리 로직: Server Action 사용 (httpOnly 쿠키에 토큰 저장)
  const processLogin = async (
    accessToken: string,
    provider: 'KAKAO' | 'NAVER',
    setLoading: (loading: boolean) => void
  ) => {
    try {
      setLoadingText('로그인 완료 중...');
      const result = await loginWithSocialAction(accessToken, provider);
      
      if (!result.success) {
        setError(result.message);
        setLoading(false);
        return;
      }

      if (result.userInfo) {
        setUser(result.userInfo);
      }

      const previousPath = sessionStorage.getItem('previousPath') || '/';
      sessionStorage.removeItem('previousPath');
      router.push(previousPath);
    } catch (err: any) {
      setError(err.message || '로그인 처리 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // 카카오 로그인 핸들러
  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      setError('카카오 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      initKakao();
    }

    setIsLoadingKakao(true);
    setLoadingText('카카오 로그인 중...');
    setError(null);

    window.Kakao.Auth.authorize({
      redirectUri: `${window.location.origin}/login`,
    });
  };

  // 네이버 로그인 핸들러
  const handleNaverLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    if (!clientId) {
      setError('네이버 API 키가 설정되지 않았습니다.');
      return;
    }

    const redirectUri = encodeURIComponent(`${window.location.origin}/login`);
    const state = Math.random().toString(36).substring(7);
    
    setIsLoadingNaver(true);
    setLoadingText('네이버 로그인 중...');
    setError(null);

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
    window.location.href = naverAuthUrl;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start px-4 pt-20 sm:pt-32">
      {/* 카카오 SDK 스크립트 */}
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
        strategy="afterInteractive"
        onLoad={initKakao}
        onError={() => {
          setError('카카오 SDK를 불러오는 데 실패했습니다.');
        }}
      />

      <div className="w-full max-w-md space-y-8">
        {/* 상단 텍스트 */}
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-3 md:mb-6">
            100만뷰 릴스 제작 파트너
          </p>
          
          {/* 메인 로고 */}
          <div className="mb-6 md:mb-12">
            <span 
              className="text-5xl md:text-6xl font-bold leading-[150%] tracking-[-0.05em] block"
              style={{ 
                fontFamily: 'Helvetica, Arial, sans-serif',
                color: '#FF496D',
              }}
            >
              Reelstamp
            </span>
          </div>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="space-y-2 md:space-y-3">
          {/* 네이버 로그인 버튼 */}
          <button
            type="button"
            className={`w-full h-14 rounded-xl transition-all ${
              isLoadingNaver
                ? 'opacity-70 cursor-not-allowed pointer-events-none'
                : 'cursor-pointer active:scale-[0.98] hover:opacity-90'
            }`}
            aria-label="네이버로 로그인"
            onClick={handleNaverLogin}
            disabled={isLoadingNaver}
          >
            <Image
              src="/images/login_naver.png"
              alt="네이버로 로그인"
              width={400}
              height={56}
              className="w-full h-full object-contain rounded-xl"
              priority
            />
          </button>

          {/* 카카오톡 로그인 버튼 */}
          <button
            type="button"
            className={`w-full h-14 rounded-xl transition-all ${
              isLoadingKakao
                ? 'opacity-70 cursor-not-allowed pointer-events-none'
                : 'cursor-pointer active:scale-[0.98] hover:opacity-90'
            }`}
            aria-label="카카오톡으로 로그인"
            onClick={handleKakaoLogin}
            disabled={isLoadingKakao}
          >
            <Image
              src="/images/login_kakao.png"
              alt="카카오톡으로 로그인"
              width={400}
              height={56}
              className="w-full h-full object-contain rounded-xl"
              priority
            />
          </button>
        </div>

        {error && (
          <p className="text-center text-red-500 text-sm mt-4 font-medium">{error}</p>
        )}
      </div>

      {/* 로딩 오버레이 */}
      <LoadingOverlay isVisible={isLoadingKakao || isLoadingNaver} text={loadingText} />
    </div>
  );
}
