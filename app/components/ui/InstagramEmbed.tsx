// Instagram Embed 컴포넌트: 직접 iframe 방식
'use client';

import { useEffect, useState } from 'react';

interface InstagramEmbedProps {
  url: string; // Instagram 릴스 URL
  className?: string; // 추가 CSS 클래스
  onLoadComplete?: () => void; // 로딩 완료 콜백
}

export default function InstagramEmbed({ 
  url, 
  className = '', 
  onLoadComplete 
}: InstagramEmbedProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // URL에서 shortcode 추출
  const getShortcode = (url: string) => {
    const match = url.match(/\/reel\/([^/]+)/);
    return match ? match[1] : null;
  };

  const shortcode = getShortcode(url);
  const embedUrl = shortcode ? `https://www.instagram.com/reel/${shortcode}/embed/` : url;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // URL이 변경되면 로딩 상태 리셋
  useEffect(() => {
    setIsLoading(true);
    
    // 타임아웃: 5초 후 강제로 로딩 완료 (iframe이 로드되지 않아도)
    const timeout = setTimeout(() => {
      setIsLoading(false);
      if (onLoadComplete) {
        onLoadComplete();
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [url, onLoadComplete]);

  const handleIframeLoad = () => {
    // iframe이 로드된 후 약간의 지연을 두고 로딩 완료 처리
    // (Instagram 콘텐츠가 완전히 렌더링될 시간을 줌)
    setTimeout(() => {
      setIsLoading(false);
      if (onLoadComplete) {
        onLoadComplete();
      }
    }, 300);
  };

  // SSR 중에는 로딩 상태만 표시
  if (!isMounted) {
    return (
      <div className={`relative w-full h-full overflow-hidden rounded-lg bg-black ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <div className="text-gray-400 text-sm font-medium">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-lg bg-black ${className}`}>
      {/* 로딩 오버레이 - 각 embed마다 개별 로딩 표시 */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <div className="text-gray-400 text-sm font-medium">로딩 중...</div>
          </div>
        </div>
      )}

      {/* Instagram embed iframe */}
      <iframe
        src={embedUrl}
        className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        allowFullScreen={true}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        scrolling="no"
        onLoad={handleIframeLoad}
      />
    </div>
  );
}
