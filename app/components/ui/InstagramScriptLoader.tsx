// Instagram 스크립트 로드 감지 및 이벤트 발생 컴포넌트
// beforeInteractive로 로드된 Instagram 스크립트의 로드 완료를 감지하고 이벤트를 발생시킴
'use client';

import { useEffect } from 'react';

// 전역 타입 선언
declare global {
  interface Window {
    __instagramScriptLoaded?: boolean;
  }
}

export default function InstagramScriptLoader() {
  useEffect(() => {
    // 이미 로드 완료 표시되었으면 스킵
    if (window.__instagramScriptLoaded) {
      return;
    }

    // instgrm 객체가 이미 있으면 즉시 이벤트 발생
    if ((window as any).instgrm) {
      window.__instagramScriptLoaded = true;
      window.dispatchEvent(new Event('instagram-script-loaded'));
      return;
    }

    // instgrm 객체 등장을 감지 (짧은 간격, 최대 50회 = 2.5초)
    let checkCount = 0;
    const maxChecks = 50;
    const checkInterval = setInterval(() => {
      checkCount++;
      if ((window as any).instgrm) {
        window.__instagramScriptLoaded = true;
        window.dispatchEvent(new Event('instagram-script-loaded'));
        clearInterval(checkInterval);
      } else if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
      }
    }, 50);

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  // UI 없음
  return null;
}

