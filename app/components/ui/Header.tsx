// 공통 헤더 컴포넌트: 브랜드 로고, 메뉴 영역, 가입/로그인 버튼을 포함하는 상단 네비게이션
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import Modal from './Modal';
import { motion, AnimatePresence } from 'framer-motion';

// 헤더 컴포넌트
export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white border-b border-gray-100 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full pl-4 pr-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-18">
          {/* 좌측: 브랜드 로고 */}
          {/* 기존 링크 코드 (주석 처리)
          <Link 
            href="/" 
            className="flex items-center gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/images/logo.png"
              alt="BooQuest"
              width={220}
              height={100}
              className="h-[90px] w-auto"
              priority
            />
          </Link>
          */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="BooQuest"
                width={220}
                height={100}
                className="h-[90px] w-auto"
                priority
              />
            </div>
          </div>

          {/* 중앙: 메뉴 영역 (PC) */}
          {/* <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/ranking"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              인기 급상승 릴스
            </Link>
          </nav> */}

          {/* 우측: 가입/로그인 버튼 및 모바일 메뉴 */}
          <div className="flex items-center gap-3">
            {/* 모바일 햄버거 메뉴 버튼 */}
            {/* <button
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
            </button> */}
            {/* 로그인/회원가입 버튼 (PC만 표시) */}
            {/* <button
              type="button"
              onClick={() => setShowComingSoonModal(true)}
              className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#EB48B1] to-[#F59A39] rounded-lg hover:from-[#D93D9F] hover:to-[#E6892F] transition-all shadow-md hover:shadow-lg"
            >
              로그인/회원가입
            </button> */}
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 (전체 화면) - Portal로 body에 직접 렌더링 */}
      {/* {mounted && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="fixed top-[72px] left-0 right-0 bottom-0 z-[9999] bg-white md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="h-full flex flex-col p-6 space-y-4">
                <Link
                  href="/ranking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  인기 급상승 릴스
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowComingSoonModal(true);
                  }}
                  className="w-full px-6 py-4 text-base font-medium text-white bg-gradient-to-r from-[#EB48B1] to-[#F59A39] rounded-lg hover:from-[#D93D9F] hover:to-[#E6892F] transition-all shadow-md hover:shadow-lg"
                >
                  로그인/회원가입
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )} */}

      {/* 서비스 준비중 모달 */}
      <Modal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        title="서비스 준비중"
        description="곧 출시될 예정입니다."
        icon={
          <Image
            src="/images/logo.png"
            alt="BooQuest"
            width={120}
            height={120}
            className="w-[120px] h-[120px]"
          />
        }
      />
    </header>
  );
}

