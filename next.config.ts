// Next.js 설정 파일: 빌드, 이미지 최적화, 리다이렉트 등 Next.js 동작을 제어
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화 설정
  images: {
    // 이미지 최적화 활성화
    formats: ['image/avif', 'image/webp'],
    // 외부 도메인 이미지 허용 (소셜 로그인 프로필 이미지 등)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // 이미지 최적화 품질 (1-100, 기본값 75)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 압축 설정
  compress: true,
};

export default nextConfig;
