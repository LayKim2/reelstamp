// Analytics 유틸리티: 나중에 여러 analytics 도구를 쉽게 추가할 수 있도록 추상화 레이어 제공

// Google Analytics 4 이벤트 추적
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// 페이지뷰 추적 (자동으로 처리되지만 필요시 수동 호출 가능)
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
    });
  }
};

// 전환 추적
export const trackConversion = (conversionId: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: 'KRW',
    });
  }
};

// 사용자 속성 설정
export const setUserProperty = (propertyName: string, value: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', {
      [propertyName]: value,
    });
  }
};

// 타입 정의
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string | Record<string, any>,
      config?: Record<string, any>
    ) => void;
  }
}

