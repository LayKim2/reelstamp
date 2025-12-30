// 루트 레이아웃 컴포넌트: 모든 페이지에 공통으로 적용되는 최상위 레이아웃
// 헤더와 메인 콘텐츠 영역을 포함하는 기본 구조
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/app/components/ui/Header";
import Footer from "@/app/components/ui/Footer";
import QueryProvider from "@/app/providers/QueryProvider";

// Geist Sans 폰트 설정: 기본 sans-serif 폰트
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist Mono 폰트 설정: 코드용 monospace 폰트
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 메타데이터 설정: SEO 및 브라우저 탭에 표시되는 정보
export const metadata: Metadata = {
  title: "릴스탬프 - 100만 조회수 터지는 릴스 제작하기",
  description: "100만뷰 이상 성공 릴스 분석을 바탕으로 릴스 기획·대본을 제공합니다. 인기 급상승 릴스 랭킹과 제작 가이드를 확인하세요.",
  icons: {
    icon: '/images/logo.ico',
  },
};

// 루트 레이아웃: 헤더 + 메인 콘텐츠 구조
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="ko" className="bg-gradient-to-br from-pink-50/20 via-white to-orange-50/20">
      <head>
        {/* Instagram 도메인 사전 연결 - 로딩 속도 최적화 */}
        <link rel="preconnect" href="https://www.instagram.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <link rel="preconnect" href="https://static.cdninstagram.com" />
        <link rel="dns-prefetch" href="https://static.cdninstagram.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gradient-to-br from-pink-50/20 via-white to-orange-50/20`}
      >
        <QueryProvider>
          {/* 공통 헤더 */}
          <Header />
          
          {/* 메인 콘텐츠 영역 */}
          <main className="flex-1">
        {children}
          </main>

          {/* 공통 푸터 */}
          <Footer />
        </QueryProvider>

        {/* Google Analytics 4 */}
        {gaMeasurementId && (
          <GoogleAnalytics gaId={gaMeasurementId} />
        )}

        {/* Instagram Embed Script - beforeInteractive로 빠른 로딩 */}
        
      </body>
    </html>
  );
}
