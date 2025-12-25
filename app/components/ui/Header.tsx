// 공통 헤더 컴포넌트: 브랜드 로고, 메뉴 영역, 가입/로그인 버튼을 포함하는 상단 네비게이션
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 헤더 컴포넌트
export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤이 맨 위에 있거나 위로 스크롤하면 헤더 표시
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // 아래로 스크롤하면 헤더 숨김
        setIsVisible(false);
      } else {
        // 위로 스크롤하면 헤더 표시
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white border-b border-gray-100 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full pl-0 pr-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* 좌측: 브랜드 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo_main.svg"
                alt="BooQuest"
                width={140}
                height={60}
                className="h-[60px] w-auto"
                priority
              />
            </Link>
          </div>

          {/* 중앙: 메뉴 영역 (추후 추가 예정) */}
          <nav className="hidden md:flex items-center gap-8">
            {/* 메뉴 항목들이 여기에 추가될 예정 */}
          </nav>

          {/* 우측: 가입/로그인 버튼 */}
          <div className="flex items-center gap-3">
            {/* 가입 버튼 */}
            <Link
              href="/auth/register"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              가입
            </Link>
            {/* 로그인 버튼 */}
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#EB48B1] to-[#F59A39] rounded-lg hover:from-[#D93D9F] hover:to-[#E6892F] transition-all shadow-md hover:shadow-lg"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

