// Instagram Embed 컴포넌트: Instagram 릴스를 embed 형태로 표시
'use client';

import { useEffect, useRef, useState } from 'react';

// Instagram 스크립트와 React DOM의 removeChild 에러를 무시하는 전역 에러 핸들러 설정
if (typeof window !== 'undefined') {
  // 기존 에러 핸들러가 이미 설정되어 있는지 확인
  if (!(window as any).__instagramEmbedErrorHandlerSet) {
    (window as any).__instagramEmbedErrorHandlerSet = true;
    
    const originalErrorHandler = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      // removeChild 에러는 Instagram 스크립트나 React DOM에서 발생할 수 있으므로 무시
      if (typeof message === 'string' && (
        message.includes('removeChild') || 
        message.includes('Failed to execute \'removeChild\'')
      )) {
        return true; // 에러 처리 완료, 기본 에러 핸들러 호출하지 않음
      }
      // 다른 에러는 기존 핸들러 호출
      if (originalErrorHandler) {
        return originalErrorHandler.call(this, message, source, lineno, colno, error);
      }
      return false;
    };
    
    // unhandledrejection도 처리
    window.addEventListener('unhandledrejection', function(event) {
      if (event.reason) {
        const reasonStr = typeof event.reason === 'string' 
          ? event.reason 
          : (event.reason instanceof Error ? event.reason.message : String(event.reason));
        if (reasonStr && (
          reasonStr.includes('removeChild') || 
          reasonStr.includes('Failed to execute \'removeChild\'')
        )) {
          event.preventDefault(); // 에러 무시
        }
      }
    });
    
    // React의 에러도 처리
    const originalConsoleError = console.error;
    console.error = function(...args: any[]) {
      const message = args.join(' ');
      if (message.includes('removeChild') || message.includes('Failed to execute \'removeChild\'')) {
        return; // 에러 무시
      }
      originalConsoleError.apply(console, args);
    };
  }
}

interface InstagramEmbedProps {
  url: string; // Instagram 릴스 URL
  className?: string; // 추가 CSS 클래스
  onLoadComplete?: () => void; // 로딩 완료 콜백
}

export default function InstagramEmbed({ url, className = '', onLoadComplete }: InstagramEmbedProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const embedWrapperRef = useRef<HTMLDivElement>(null);
  const blockquoteIdRef = useRef<string>(`instagram-embed-${Math.random().toString(36).substr(2, 9)}`);

  // 클라이언트에서만 마운트 (Hydration 에러 방지)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // URL이 변경되면 로딩 상태 리셋
    setIsLoading(true);

    // 현재 처리 중인 URL 저장 (cleanup 시 확인용)
    const currentUrl = url;

    // Instagram embed script가 로드되었는지 확인하고 처리
    const processEmbed = () => {
      // 해당 blockquote가 DOM에 있는지 확인 (고유 ID로 정확히 식별)
      const blockquote = containerRef.current?.querySelector(`#${blockquoteIdRef.current}`);
      if (!blockquote) {
        return false; // 아직 DOM에 없으면 나중에 다시 시도
      }
      
      // 현재 URL과 일치하는지 확인 (URL이 변경되었을 수 있음)
      const blockquoteUrl = blockquote.getAttribute('data-instgrm-permalink');
      if (blockquoteUrl !== currentUrl) {
        return false; // URL이 변경되었으면 처리하지 않음
      }
      
      if (typeof window !== 'undefined' && (window as any).instgrm) {
        // URL이 변경되었는지 다시 확인
        const currentBlockquote = containerRef.current?.querySelector(`#${blockquoteIdRef.current}`);
        if (!currentBlockquote || currentBlockquote.getAttribute('data-instgrm-permalink') !== currentUrl) {
          return false;
        }
        
        // Instagram embed 처리 (에러는 무시 - Instagram 스크립트 내부 에러일 수 있음)
        try {
          (window as any).instgrm.Embeds.process();
        } catch (error: any) {
          // removeChild 에러 등은 무시 (Instagram 스크립트 내부에서 발생할 수 있음)
          if (error && error.message && error.message.includes('removeChild')) {
            // 에러 무시하고 계속 진행
            return true;
          }
          return false;
        }
        
        // iframe이 로드된 후 높이 조정 및 스타일 적용
        const applyStyles = () => {
          // 해당 blockquote만 정확히 찾기
          const blockquote = containerRef.current?.querySelector(`#${blockquoteIdRef.current}`);
          if (!blockquote) return;
          
          // 해당 blockquote 내부의 iframe만 찾기 (다른 embed의 iframe과 구분)
          const iframe = blockquote.querySelector('iframe');
          
          // iframe 스타일 적용
          if (iframe && iframe.src && iframe.src.includes('instagram.com')) {
            const containerHeight = containerRef.current?.offsetHeight || 0;
            if (containerHeight > 0) {
              iframe.style.height = `${containerHeight}px`;
            }
            iframe.style.maxHeight = '100%';
            iframe.style.width = '100%';
            iframe.style.borderRadius = '8px';
            iframe.style.overflow = 'hidden';
            iframe.style.display = 'block';
            iframe.style.position = 'relative';
            iframe.style.zIndex = '1';
          }
          
          // blockquote 내부 요소 숨기기 (CSS로 대부분 처리되므로 최소한만)
          const linkParagraph = blockquote.querySelector('p');
          if (linkParagraph) {
            (linkParagraph as HTMLElement).style.display = 'none';
          }
        };
        
        // 각 embed의 iframe이 개별적으로 로드될 때까지 주기적으로 체크
        let iframeLoaded = false;
        const checkInterval = setInterval(() => {
          // URL이 변경되었는지 확인
          const blockquote = containerRef.current?.querySelector(`#${blockquoteIdRef.current}`);
          if (!blockquote || blockquote.getAttribute('data-instgrm-permalink') !== currentUrl) {
            clearInterval(checkInterval);
            return; // URL이 변경되었으면 중단
          }
          
          // 해당 blockquote 내부의 iframe만 확인 (다른 embed의 iframe과 구분)
          const iframe = blockquote.querySelector('iframe');
          
          // iframe이 생성되고 실제로 로드되었는지 확인
          if (iframe && iframe.src && iframe.src.includes('instagram.com') && !iframeLoaded) {
            // iframe의 load 이벤트를 기다려서 실제 콘텐츠가 로드될 때까지 대기
            const handleIframeLoad = () => {
              iframeLoaded = true;
              clearInterval(checkInterval);
              
              // 스타일 적용
              applyStyles();
              
              // 로딩 완료 처리
              setIsLoading(false);
              if (onLoadComplete) {
                onLoadComplete();
              }
            };
            
            // 이미 로드되었는지 확인
            if (iframe.contentDocument || iframe.contentWindow) {
              // 이미 로드된 경우
              handleIframeLoad();
            } else {
              // 로드 이벤트 대기
              iframe.addEventListener('load', handleIframeLoad, { once: true });
              
              // 타임아웃: 2초 후 강제로 로딩 완료 (iframe이 생성되었으므로)
              setTimeout(() => {
                if (!iframeLoaded) {
                  handleIframeLoad();
                }
              }, 2000);
            }
          }
          
          // 스타일 적용
          applyStyles();
        }, 100);
        
        // 타임아웃: 5초 후 강제로 로딩 완료 (10초 -> 5초로 단축)
        setTimeout(() => {
          clearInterval(checkInterval);
          setIsLoading(false);
          if (onLoadComplete) {
            onLoadComplete();
          }
        }, 5000); // 10000ms -> 5000ms로 단축
        
        return true;
      }
      return false;
    };

    // 스크립트 로드 후 처리 함수 (이벤트 기반 최적화)
    const tryProcess = () => {
      // Instagram embed 직접 처리 시도
      if (processEmbed()) {
        return true;
      }
      return false;
    };

    // 스크립트가 이미 로드되었으면 즉시 처리
    if ((window as any).__instagramScriptLoaded || (window as any).instgrm) {
      // 다음 틱에서 처리 (DOM 업데이트 대기)
      const immediateTimeout = setTimeout(() => {
        tryProcess();
      }, 0);

      // 최종 타임아웃
      const finalTimeout = setTimeout(() => {
        setIsLoading(false);
        if (onLoadComplete) {
          onLoadComplete();
        }
      }, 3000);

      return () => {
        clearTimeout(immediateTimeout);
        clearTimeout(finalTimeout);
      };
    }

    // 스크립트 로드 이벤트 리스너 (이벤트 기반 - setInterval 최소화)
    let processed = false;
    const handleScriptLoad = () => {
      if (!processed) {
        processed = tryProcess();
      }
    };

    window.addEventListener('instagram-script-loaded', handleScriptLoad);

    // 폴백: 짧은 간격으로 최대 10회만 체크 (기존 무한 setInterval 대신)
    let checkCount = 0;
    const maxChecks = 10;
    const checkInterval = setInterval(() => {
      checkCount++;
      if (tryProcess() || checkCount >= maxChecks) {
        clearInterval(checkInterval);
        processed = true;
      }
    }, 100);

    // 최종 타임아웃: 3초 후 강제 표시
    const finalTimeout = setTimeout(() => {
      clearInterval(checkInterval);
      setIsLoading(false);
      if (onLoadComplete) {
        onLoadComplete();
      }
    }, 3000);

    return () => {
      window.removeEventListener('instagram-script-loaded', handleScriptLoad);
      clearInterval(checkInterval);
      clearTimeout(finalTimeout);
    };
  }, [url, isMounted, onLoadComplete]);

  // SSR 중에는 로딩 상태만 표시
  if (!isMounted) {
    return (
      <div className={`instagram-embed-container ${className}`}>
        <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 rounded-lg aspect-[9/16] min-h-[400px] animate-pulse">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <div className="text-gray-400 text-sm font-medium">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`instagram-embed-container ${className}`}
      style={{
        overflow: 'hidden',
        borderRadius: '8px',
        position: 'relative',
        height: '100%',
        width: '100%',
        maxHeight: '100%',
      }}
    >
      {/* 로딩 오버레이 - 각 embed마다 개별 로딩 표시 */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <div className="text-gray-400 text-sm font-medium">로딩 중...</div>
          </div>
        </div>
      )}
      
      <div
        ref={embedWrapperRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          opacity: isLoading ? 0 : 1, // 로딩 중에는 투명하게
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <blockquote
          key={url}
          id={blockquoteIdRef.current}
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{
            background: '#FFF',
            border: '0',
            borderRadius: '3px',
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
            margin: '1px',
            maxWidth: '100%',
            minWidth: '326px',
            padding: '0',
            width: '99.375%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
        <div style={{ padding: '16px' }}>
          <a
            href={url}
            style={{
              background: '#FFFFFF',
              lineHeight: '0',
              padding: '0 0',
              textAlign: 'center',
              textDecoration: 'none',
              width: '100%',
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div
                style={{
                  backgroundColor: '#F4F4F4',
                  borderRadius: '50%',
                  flexGrow: 0,
                  height: '40px',
                  marginRight: '14px',
                  width: '40px',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
                <div
                  style={{
                    backgroundColor: '#F4F4F4',
                    borderRadius: '4px',
                    flexGrow: 0,
                    height: '14px',
                    marginBottom: '6px',
                    width: '100px',
                  }}
                />
                <div
                  style={{
                    backgroundColor: '#F4F4F4',
                    borderRadius: '4px',
                    flexGrow: 0,
                    height: '14px',
                    width: '60px',
                  }}
                />
              </div>
            </div>
            <div style={{ padding: '19% 0' }} />
            <div style={{ display: 'block', height: '50px', margin: '0 auto 12px', width: '50px' }}>
              <svg
                width="50px"
                height="50px"
                viewBox="0 0 60 60"
                version="1.1"
                xmlns="https://www.w3.org/2000/svg"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                    <g>
                      <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631" />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <div style={{ paddingTop: '8px' }}>
              <div
                style={{
                  color: '#3897f0',
                  fontFamily: 'Arial,sans-serif',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 550,
                  lineHeight: '18px',
                }}
              >
                이 게시물 보기
              </div>
            </div>
            <div style={{ padding: '19% 0' }} />
          </a>
          <p
            style={{
              color: '#c9c8cd',
              fontFamily: 'Arial,sans-serif',
              fontSize: '14px',
              lineHeight: '17px',
              marginBottom: 0,
              marginTop: '8px',
              overflow: 'hidden',
              padding: '8px 0 7px',
              textAlign: 'center',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <a
              href={url}
              style={{
                color: '#c9c8cd',
                fontFamily: 'Arial,sans-serif',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 'normal',
                lineHeight: '17px',
                textDecoration: 'none',
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram에서 이 게시물 보기
            </a>
          </p>
        </div>
        </blockquote>
      </div>
    </div>
  );
}

