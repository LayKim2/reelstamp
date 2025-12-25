// 루트 레이아웃 컴포넌트: 모든 페이지에 공통으로 적용되는 최상위 레이아웃
// 헤더와 메인 콘텐츠 영역을 포함하는 기본 구조
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/app/components/ui/Header";
import Footer from "@/app/components/ui/Footer";

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
  title: "BooQuest - 부업 시작의 모든 것",
  description: "인스타그램 부업부터 다양한 수익 창출 방법까지, 부업 시작을 도와드립니다.",
};

// 루트 레이아웃: 헤더 + 메인 콘텐츠 구조
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="ko" className="bg-white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white`}
      >
        {/* 공통 헤더 */}
        <Header />
        
        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1">
          {children}
        </main>

        {/* 공통 푸터 */}
        <Footer />

        {/* Google Analytics 4 */}
        {gaMeasurementId && (
          <GoogleAnalytics gaId={gaMeasurementId} />
        )}
      </body>
    </html>
  );
}
