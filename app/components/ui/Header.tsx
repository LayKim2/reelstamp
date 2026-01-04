// 공통 헤더 컴포넌트: 브랜드 로고, 메뉴 영역, 가입/로그인 버튼을 포함하는 상단 네비게이션
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// 메뉴 항목 타입 정의
interface MenuItem {
  href: string;
  label: string;
  matchPattern?: (pathname: string) => boolean;
}

// 메뉴 항목 상수
const MENU_ITEMS: MenuItem[] = [
  {
    href: '/contents/script-creation',
    label: '릴스 제작',
    matchPattern: (pathname) => pathname.startsWith('/contents'),
  },
  {
    href: '/ranking',
    label: '인기 급상승 릴스',
  },
];

// 헤더 컴포넌트
export default function Header() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 현재 경로가 메뉴와 일치하는지 확인하는 함수 (메모이제이션)
  const isActive = useCallback((item: MenuItem) => {
    if (item.matchPattern) {
      return item.matchPattern(pathname);
    }
    return pathname === item.href;
  }, [pathname]);

  // 스크롤 핸들러 (메모이제이션)
  const handleScroll = useCallback(() => {
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
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full pl-4 pr-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-18">
          {/* 좌측: 브랜드 로고 (타이포그래피) */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span 
                className="text-[26px] md:text-[32px] font-bold leading-[150%] tracking-[-0.05em]"
                style={{ 
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  color: '#FF496D',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Reelstamp
              </span>
            </Link>
          </div>

          {/* 중앙: 메뉴 영역 (PC) */}
          <nav className="hidden md:flex items-center gap-8">
            {MENU_ITEMS.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-medium transition-all relative ${
                    active
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#EB48B1] to-[#F59A39] font-bold scale-105'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#EB48B1] to-[#F59A39] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 우측: 가입/로그인 버튼 및 모바일 메뉴 */}
          <div className="flex items-center gap-3">
            {/* 모바일 햄버거 메뉴 버튼 */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg bg-gradient-to-r from-[#EB48B1] to-[#F59A39] hover:from-[#D93D9F] hover:to-[#E6892F] transition-all shadow-sm hover:shadow-md"
              aria-label="메뉴"
            >
              <div className="w-5 h-4 flex flex-col justify-between items-end">
                <motion.span
                  className="block h-[2px] bg-white rounded-full"
                  style={{ width: isMobileMenuOpen ? '100%' : '75%' }}
                  animate={isMobileMenuOpen ? { rotate: 45, y: 6.5, width: '100%' } : { rotate: 0, y: 0, width: '75%' }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-[2px] bg-white rounded-full"
                  style={{ width: '100%' }}
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-[2px] bg-white rounded-full"
                  style={{ width: isMobileMenuOpen ? '100%' : '50%' }}
                  animate={isMobileMenuOpen ? { rotate: -45, y: -6.5, width: '100%' } : { rotate: 0, y: 0, width: '50%' }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </button>
            {/* 로그인/회원가입 버튼 (PC만 표시) */}
            <div className="hidden md:flex items-center gap-4">
              {/* 가입 버튼 (텍스트) */}
              <Link
                href="/login"
                className="px-5 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all flex items-center justify-center"
                aria-label="회원가입"
              >
                가입
              </Link>
              {/* 로그인 버튼 */}
              <Link
                href="/login"
                className="px-5 py-2 text-base font-medium text-white rounded-xl transition-all hover:bg-[#1F2128] hover:shadow-lg flex items-center justify-center"
                style={{ backgroundColor: '#2B2D37' }}
                aria-label="로그인"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 (전체 화면) - Portal로 body에 직접 렌더링 */}
      {mounted && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="fixed top-[72px] left-0 right-0 bottom-0 z-[9999] bg-white md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="h-full flex flex-col p-6">
                <div className="flex-1 flex flex-col space-y-2">
                  {MENU_ITEMS.map((item) => {
                    const active = isActive(item);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`w-full block px-5 py-3.5 text-base font-medium rounded-xl transition-all relative ${
                          active
                            ? 'bg-gradient-to-r from-[#EB48B1]/10 to-[#F59A39]/10 font-bold shadow-sm'
                            : 'text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                        }`}
                      >
                        <span className={active ? 'bg-gradient-to-r from-[#EB48B1] to-[#F59A39] bg-clip-text text-transparent' : ''}>
                          {item.label}
                        </span>
                        {active && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#EB48B1] to-[#F59A39] rounded-r-full"></span>
                        )}
                      </Link>
                    );
                  })}
                </div>
                {/* 화면 맨 밑에 버튼 배치 */}
                <div className="w-full flex flex-col gap-3 mt-auto pt-6">
                  {/* 가입 버튼 */}
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-5 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all border border-gray-300 text-center"
                    aria-label="회원가입"
                  >
                    가입
                  </Link>
                  {/* 로그인 버튼 */}
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-5 py-2 text-base font-medium text-white rounded-xl transition-all hover:bg-[#1F2128] hover:shadow-lg text-center"
                    style={{ backgroundColor: '#2B2D37' }}
                    aria-label="로그인"
                  >
                    로그인
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}

