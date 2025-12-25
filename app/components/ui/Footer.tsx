// 공통 푸터 컴포넌트: 사이트 하단에 표시되는 공통 정보 영역
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-2">
        {/* 모바일: 상단 - 로고와 소셜 미디어 같은 줄 */}
        <div className="flex md:hidden justify-between items-center mb-1 pt-2">
          {/* 왼쪽: 브랜드 로고 */}
          <div className="transform translate-x-[20%] -my-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="BooQuest"
                width={150}
                height={65}
                className="h-[65px] w-auto"
              />
            </Link>
          </div>

          {/* 오른쪽: 소셜 미디어 링크 */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/reelstamp/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-900"
            >
              <Image
                src="/images/insta_logo.png"
                alt="Instagram"
                width={40}
                height={28}
                className="w-10 h-7"
              />
              <span className="text-xs">Instagram</span>
            </a>
            <a
              href="https://www.youtube.com/@%EB%A6%B4%EC%8A%A4%ED%83%AC%ED%94%84"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-900"
            >
              <Image
                src="/images/youtube_logo.png"
                alt="YouTube"
                width={32}
                height={40}
                className="w-8 h-10"
              />
              <span className="text-xs">Youtube</span>
            </a>
          </div>
        </div>

        {/* 모바일: 하단 - Copyright 중앙 */}
        <div className="flex md:hidden justify-center pb-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Reelstamp. All rights reserved.
          </p>
        </div>

        {/* 데스크톱: 기존 구조 유지 */}
        <div className="hidden md:flex justify-between items-center gap-4">
          {/* 왼쪽: 브랜드 로고 */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="BooQuest"
                width={160}
                height={70}
                className="h-[70px] w-auto"
              />
            </Link>
          </div>

          {/* 가운데: Copyright */}
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Reelstamp. All rights reserved.
            </p>
          </div>

          {/* 오른쪽: 소셜 미디어 링크 */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/reelstamp/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Image
                src="/images/insta_logo.png"
                alt="Instagram"
                width={40}
                height={28}
                className="w-10 h-7"
              />
              <span>Instagram</span>
            </a>
            <a
              href="https://www.youtube.com/@%EB%A6%B4%EC%8A%A4%ED%83%AC%ED%94%84"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Image
                src="/images/youtube_logo.png"
                alt="YouTube"
                width={32}
                height={40}
                className="w-8 h-10"
              />
              <span>Youtube</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

