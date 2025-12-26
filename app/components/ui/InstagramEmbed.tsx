// Instagram Embed 컴포넌트: Instagram 릴스를 embed 형태로 표시
'use client';

import { useEffect, useRef, useState } from 'react';

interface InstagramEmbedProps {
  url: string; // Instagram 릴스 URL
  className?: string; // 추가 CSS 클래스
}

export default function InstagramEmbed({ url, className = '' }: InstagramEmbedProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 클라이언트에서만 마운트 (Hydration 에러 방지)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Instagram embed script가 로드되었는지 확인하고 처리
    const processEmbed = () => {
      if (typeof window !== 'undefined' && (window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
        
        // iframe이 로드된 후 높이 조정 및 스타일 적용
        const applyStyles = () => {
          const iframe = containerRef.current?.querySelector('iframe');
          const blockquote = containerRef.current?.querySelector('.instagram-media');
          
          if (iframe) {
            // iframe의 높이를 컨테이너 높이에 맞게 설정
            const containerHeight = containerRef.current?.offsetHeight || 0;
            if (containerHeight > 0) {
              iframe.style.height = `${containerHeight}px`;
            }
            iframe.style.maxHeight = '100%';
            iframe.style.borderRadius = '8px';
            iframe.style.overflow = 'hidden';
            iframe.style.display = 'block';
          }
          
          // blockquote 내부 요소 숨기기
          if (blockquote) {
            // 하단 링크 영역 숨기기
            const linkParagraph = blockquote.querySelector('p');
            if (linkParagraph) {
              (linkParagraph as HTMLElement).style.display = 'none';
            }
            
            // 상단 프로필 영역 숨기기
            const profileDiv = blockquote.querySelector('div > a > div:first-child');
            if (profileDiv) {
              (profileDiv as HTMLElement).style.display = 'none';
            }
            
            // 하단 여백 제거
            const lastDiv = blockquote.querySelector('div > a > div:last-child');
            if (lastDiv) {
              (lastDiv as HTMLElement).style.display = 'none';
            }
            
            // "이 게시물 보기" 텍스트 숨기기
            const viewMoreDiv = blockquote.querySelector('div > a > div:nth-child(3)');
            if (viewMoreDiv) {
              (viewMoreDiv as HTMLElement).style.display = 'none';
            }
            
            // Instagram 아이콘 숨기기
            const iconDiv = blockquote.querySelector('div > a > div:nth-child(2)');
            if (iconDiv) {
              (iconDiv as HTMLElement).style.display = 'none';
            }
            
            // 모든 div 요소 중 하단에 있는 것들 숨기기
            const allDivs = blockquote.querySelectorAll('div');
            allDivs.forEach((div, index) => {
              // 하단 부분의 div들 숨기기 (마지막 몇 개)
              if (index >= allDivs.length - 3) {
                (div as HTMLElement).style.display = 'none';
              }
            });
          }
          
          // iframe 내부의 하단 요소들도 숨기기 시도
          if (iframe && iframe.contentDocument) {
            try {
              const iframeBody = iframe.contentDocument.body;
              if (iframeBody) {
                // 하단 영역의 요소들 숨기기
                const bottomElements = iframeBody.querySelectorAll('[class*="view"], [class*="like"], [class*="comment"]');
                bottomElements.forEach((el) => {
                  (el as HTMLElement).style.display = 'none';
                });
              }
            } catch (e) {
              // cross-origin 에러 무시
            }
          }
          
          setIsLoading(false);
        };
        
        // 여러 번 시도 (iframe이 완전히 로드될 때까지)
        setTimeout(applyStyles, 2000);
        setTimeout(applyStyles, 3000);
        setTimeout(applyStyles, 4000);
        return true;
      }
      return false;
    };

    // 즉시 처리 시도
    if (processEmbed()) {
      return;
    }

    // 스크립트 로드 대기
    const checkInterval = setInterval(() => {
      if (processEmbed()) {
        clearInterval(checkInterval);
      }
    }, 100);

    // 5초 후 타임아웃
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      setIsLoading(false);
    }, 5000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [url, isMounted]);

  // SSR 중에는 로딩 상태만 표시
  if (!isMounted) {
    return (
      <div className={`instagram-embed-container ${className}`}>
        <div className="flex items-center justify-center bg-gray-100 rounded-lg aspect-[9/16] min-h-[400px]">
          <div className="text-gray-400 text-sm">로딩 중...</div>
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
        aspectRatio: '9/16', // 릴스 비율 유지
        position: 'relative',
        height: '100%',
        width: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isLoading && (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg aspect-[9/16] min-h-[400px]">
          <div className="text-gray-400 text-sm">로딩 중...</div>
        </div>
      )}
      <div
        style={{
          transform: 'translateY(-100px)', // 상단 프로필 영역 숨기기
          marginBottom: '-250px', // 하단 영역 더 많이 숨기기
          height: '100%', // 컨테이너 높이에 맞춤
          clipPath: 'inset(0 0 150px 0)', // 하단 150px 잘라내기
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
        }}
      >
        <blockquote
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

