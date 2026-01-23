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

export default function LoginClient() {
  const router = useRouter();
  const { setUser, isAuthenticated } = useAuth();
  const [isLoadingKakao, setIsLoadingKakao] = useState(false);
  const [isLoadingNaver, setIsLoadingNaver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('로그인 중...');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [allAgreed, setAllAgreed] = useState(false);

  // 초기 마운트 시 mounted 상태 설정
  useEffect(() => {
    setMounted(true);
  }, []);

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

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const returnUrl = urlParams.get('returnUrl');

    if (returnUrl && !sessionStorage.getItem('previousPath')) {
      sessionStorage.setItem('previousPath', returnUrl);
    }

    if (code && !isProcessing && !isAuthenticated) {
      setIsProcessing(true);
      
      const cleanUrl = window.location.pathname + (returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '');
      window.history.replaceState({}, '', cleanUrl);

      if (state) {
        handleNaverCode(code, state);
      } else {
        handleKakaoCode(code);
      }
    }

    return () => clearInterval(timer);
  }, [isProcessing, isAuthenticated]);

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

      const rawPath = sessionStorage.getItem('previousPath');
      const previousPath = rawPath && !rawPath.includes('/login') ? rawPath : '/';
      
      sessionStorage.removeItem('previousPath');
      
      // 리다이렉트 전에 로딩을 명시적으로 해제 (UX 개선)
      setLoading(false);
      
      try {
        router.replace(previousPath);
      } catch (pushError) {
        console.error('[processLogin] 리다이렉트 실패:', pushError);
      }
    } catch (err: any) {
      setError(err.message || '로그인 처리 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // 전체 동의 체크박스 핸들러
  const handleAllAgreed = (checked: boolean) => {
    setAllAgreed(checked);
    setTermsAgreed(checked);
    setPrivacyAgreed(checked);
  };

  // 개별 약관 체크 시 전체 동의 상태 업데이트
  useEffect(() => {
    setAllAgreed(termsAgreed && privacyAgreed);
  }, [termsAgreed, privacyAgreed]);

  // 약관 동의 여부 확인
  const isAllAgreed = termsAgreed && privacyAgreed;

  // 카카오 로그인 핸들러
  const handleKakaoLogin = () => {
    if (!isAllAgreed) {
      setError('약관에 동의해주세요.');
      return;
    }
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
    if (!isAllAgreed) {
      setError('약관에 동의해주세요.');
      return;
    }
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

  // 아직 마운트 전이면 아무것도 렌더링하지 않음
  if (!mounted) {
    return null;
  }

  // 로딩 오버레이 표시 여부 결정
  const showOverlay = isLoadingKakao || isLoadingNaver || isProcessing;

  return (
    <div className="bg-white flex flex-col items-center justify-start px-4 py-20 sm:py-20 md:py-28 lg:py-40 xl:py-48 min-h-[calc(100vh-80px)] relative overflow-x-hidden">
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
        strategy="afterInteractive"
        onLoad={initKakao}
        onError={() => {
          setError('카카오 SDK를 불러오는 데 실패했습니다.');
        }}
      />

      {/* 배경 디자인 - 모바일 */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none sm:hidden overflow-hidden"
        style={{ top: '60%', opacity: 0.25, left: 0, right: 0 }}
      >
        <span 
          className="text-[150px] font-bold whitespace-nowrap"
          style={{ 
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 700,
            lineHeight: '150%',
            letterSpacing: '-0.05em',
            background: 'linear-gradient(to bottom, #FFFFFF, #FFB4C7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Reelstamp
        </span>
      </div>

      {/* 배경 디자인 - 데스크톱 */}
      <div 
        className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none overflow-hidden"
        style={{ top: '30%', opacity: 0.25, left: 0, right: 0 }}
      >
        <span 
          className="text-[250px] md:text-[350px] lg:text-[450px] font-bold whitespace-nowrap"
          style={{ 
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 700,
            lineHeight: '150%',
            letterSpacing: '-0.05em',
            background: 'linear-gradient(to bottom, #FFFFFF, #FFB4C7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Reelstamp
        </span>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* 로그인 처리 중이 아닐 때만 실제 콘텐츠 노출 (깜빡임 방지) */}
        {!showOverlay ? (
          <>
            <div className="text-center">
              <p className="text-gray-700 text-lg mb-1 md:mb-1">
                100만뷰 릴스 제작 파트너
              </p>
              
              <div className="mb-12 md:mb-12">
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

            {/* 약관 동의 체크박스 */}
            <div className="space-y-3 mb-4 w-full">
              <div className="w-full">
                <div className="flex items-center pb-3 border-b border-gray-200 px-4 sm:px-6 md:px-16">
                  <input
                    type="checkbox"
                    id="all-agreement"
                    checked={allAgreed}
                    onChange={(e) => handleAllAgreed(e.target.checked)}
                    className="w-4 h-4 text-[#FF496D] border-gray-300 rounded focus:ring-[#FF496D] cursor-pointer"
                  />
                  <label htmlFor="all-agreement" className="ml-2 text-sm font-semibold text-gray-900 cursor-pointer">
                    전체 동의
                  </label>
                </div>
              </div>
              <div className="w-full space-y-2 px-4 sm:px-6 md:px-16">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms-agreement"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#FF496D] border-gray-300 rounded focus:ring-[#FF496D] cursor-pointer"
                  />
                  <label htmlFor="terms-agreement" className="ml-2 text-sm text-gray-700 cursor-pointer">
                    <a
                      href="/terms-of-service"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF496D] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      서비스 이용약관
                    </a>
                    에 동의합니다 (필수)
                  </label>
                </div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy-agreement"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#FF496D] border-gray-300 rounded focus:ring-[#FF496D] cursor-pointer"
                  />
                  <label htmlFor="privacy-agreement" className="ml-2 text-sm text-gray-700 cursor-pointer">
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF496D] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      개인정보 처리방침
                    </a>
                    에 동의합니다 (필수)
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <button
                type="button"
                className={`w-full h-14 rounded-xl transition-all active:scale-[0.98] ${
                  isAllAgreed
                    ? 'cursor-pointer hover:opacity-90'
                    : 'cursor-not-allowed opacity-50'
                }`}
                aria-label="네이버로 로그인"
                onClick={handleNaverLogin}
                disabled={!isAllAgreed}
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

              <button
                type="button"
                className={`w-full h-14 rounded-xl transition-all active:scale-[0.98] ${
                  isAllAgreed
                    ? 'cursor-pointer hover:opacity-90'
                    : 'cursor-not-allowed opacity-50'
                }`}
                aria-label="카카오톡으로 로그인"
                onClick={handleKakaoLogin}
                disabled={!isAllAgreed}
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
          </>
        ) : (
          /* 로딩 중일 때는 레이아웃 유지를 위한 빈 공간 */
          <div className="h-64" />
        )}
      </div>

      <LoadingOverlay isVisible={showOverlay} text={loadingText} />
    </div>
  );
}

