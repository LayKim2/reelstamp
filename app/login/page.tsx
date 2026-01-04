// 로그인 페이지: 네이버/카카오 소셜 로그인 제공
'use client';

import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start px-4 pt-20 sm:pt-32">
      <div className="w-full max-w-md space-y-8">
        {/* 상단 텍스트 */}
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-3 md:mb-6">
            당신의 릴스 성공 공식
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
            className="w-full h-14 rounded-xl cursor-pointer"
            aria-label="네이버로 로그인"
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
            className="w-full h-14 rounded-xl cursor-pointer"
            aria-label="카카오톡으로 로그인"
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
      </div>
    </div>
  );
}

