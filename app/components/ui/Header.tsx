// 공통 헤더 컴포넌트: 브랜드 로고, 메뉴 영역, 가입/로그인 버튼을 포함하는 상단 네비게이션
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { User, Sparkles, Settings, LogOut, ChevronRight } from 'lucide-react';
import SettingsModal from '@/app/components/ui/SettingsModal';

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
  {
    href: '/pricing',
    label: '요금제',
    matchPattern: (pathname) => pathname.startsWith('/pricing'),
  },
];

// 헤더 컴포넌트
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  // 모바일 메뉴 열림/닫힘 시 body 스크롤 제어
  useEffect(() => {
    if (isMobileMenuOpen) {
      // 메뉴가 열렸을 때: body 스크롤 잠금
      document.body.style.overflow = 'hidden';
    } else {
      // 메뉴가 닫혔을 때: body 스크롤 복원
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      // 컴포넌트 언마운트 시 스크롤 복원
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // 프로필 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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
          <nav className="hidden md:flex items-center gap-12">
            {MENU_ITEMS.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-lg transition-colors ${
                    active
                      ? 'text-[#FF496D] font-extrabold'
                      : 'text-gray-700 hover:text-gray-900 font-medium'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* 우측: 가입/로그인 버튼 및 모바일 메뉴 */}
          <div className="flex items-center gap-3">
            {/* 영상 횟수 UI (모바일) */}
            <div className="md:hidden flex items-center gap-3 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
              {/* 재생 버튼 아이콘 */}
              <div className="w-5 h-5 bg-[#FF496D] rounded flex items-center justify-center flex-shrink-0">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-0.5">
                  <path d="M2 1L6 4L2 7V1Z" fill="white" />
                </svg>
              </div>
              {/* 숫자 */}
              <span className="text-base font-medium text-[#FF496D]">7</span>
            </div>
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
            {/* 로그인/회원가입 또는 프로필 이미지 (PC만 표시) */}
            <div className="hidden md:flex items-center gap-6">
              {/* 영상 횟수 UI (PC) */}
              <div className="flex items-center gap-4 px-4 py-2 bg-white border border-gray-200 rounded-lg min-w-[80px]">
                {/* 재생 버튼 아이콘 */}
                <div className="w-5 h-5 bg-[#FF496D] rounded flex items-center justify-center flex-shrink-0">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-0.5">
                    <path d="M2 1L6 4L2 7V1Z" fill="white" />
                  </svg>
                </div>
                {/* 숫자 */}
                <span className="text-base font-medium text-[#FF496D]">7</span>
              </div>
              {isAuthenticated ? (
                // 로그인 상태: 프로필 이미지 (클릭 시 메뉴 표시)
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="relative w-10 h-10 rounded-full overflow-hidden transition-all hover:ring-2 hover:ring-gray-300 flex items-center justify-center bg-gray-100 border-2 border-gray-200 shadow-sm hover:shadow-md"
                    aria-label="프로필 메뉴"
                  >
                    {user?.profileImageUrl ? (
                      <Image
                        src={user.profileImageUrl}
                        alt="프로필"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* 프로필 메뉴 팝업 */}
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                      >
                        {/* 유저 정보 섹션 */}
                        <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border-2 border-gray-200">
                              {user?.profileImageUrl ? (
                                <Image
                                  src={user.profileImageUrl}
                                  alt="프로필"
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-orange-200">
                                  <span className="text-lg font-semibold text-gray-700">
                                    {user?.nickname?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-semibold text-gray-900 truncate">
                                {user?.nickname || user?.socialNickname || '사용자'}
                              </p>
                              {user?.email && (
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 메뉴 항목 */}
                        <div className="py-2">

                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              setIsSettingsOpen(true);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Settings className="w-5 h-5 text-gray-400" />
                            <span className="text-base font-medium">Settings</span>
                          </button>

                          <div className="border-t border-gray-200 my-1"></div>

                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              handleLogout();
                            }}
                            disabled={isLoggingOut}
                            className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <LogOut className="w-5 h-5 text-gray-400" />
                            <span className="text-base font-medium">
                              {isLoggingOut ? '로그아웃 중...' : 'Log out'}
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // 비로그인 상태: 로그인/회원가입 버튼
                <Link
                  href="/login"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('previousPath', pathname);
                    }
                  }}
                  className="px-5 py-2 text-base font-medium text-white rounded-xl transition-all hover:bg-[#1F2128] hover:shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: '#2B2D37' }}
                  aria-label="로그인/회원가입"
                >
                  로그인/회원가입
                </Link>
              )}
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
                <nav className="h-full flex flex-col overflow-y-auto">
                  {/* 로그인 상태: 유저 정보 섹션 (클릭 시 Settings 모달 열기) */}
                  {isAuthenticated && user && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="w-full px-6 pt-6 pb-4 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border-2 border-gray-200">
                          {user.profileImageUrl ? (
                            <Image
                              src={user.profileImageUrl}
                              alt="프로필"
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-orange-200">
                              <span className="text-xl font-semibold text-gray-700">
                                {user.nickname?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900 truncate">
                            {user.nickname || user.socialNickname || '사용자'}
                          </p>
                          {user.email && (
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </button>
                  )}

                  <div className="flex-1 flex flex-col p-6">
                    <div className="flex flex-col space-y-2">
                      {MENU_ITEMS.map((item) => {
                        const active = isActive(item);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                              className={`w-full block px-5 py-3.5 text-lg rounded-xl transition-colors ${
                                active
                                  ? 'text-[#FF496D] font-extrabold bg-[#FF496D]/10 shadow-sm'
                                  : 'text-gray-900 font-medium hover:bg-gray-50'
                              }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                    {/* 화면 맨 밑에 버튼 배치 */}
                    <div className="w-full flex flex-col gap-3 mt-auto pt-6">
                      {isAuthenticated ? (
                    // 로그인 상태: 로그아웃 버튼
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      disabled={isLoggingOut}
                      className="w-full px-5 py-2 text-base font-medium text-white rounded-xl transition-all hover:bg-[#1F2128] hover:shadow-lg text-center disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#2B2D37' }}
                      aria-label="로그아웃"
                    >
                      {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                    </button>
                  ) : (
                    // 비로그인 상태: 로그인/회원가입 버튼
                    <Link
                      href="/login"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (typeof window !== 'undefined') {
                          sessionStorage.setItem('previousPath', pathname);
                        }
                      }}
                      className="w-full px-5 py-2 text-base font-medium text-white rounded-xl transition-all hover:bg-[#1F2128] hover:shadow-lg text-center"
                      style={{ backgroundColor: '#2B2D37' }}
                      aria-label="로그인/회원가입"
                    >
                      로그인/회원가입
                    </Link>
                  )}
                    </div>
                  </div>
                </nav>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Settings 모달 */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </header>
  );
}

