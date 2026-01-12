# Next.js 프로덕션 빌드를 위한 멀티 스테이지 Dockerfile

# Stage 1: 의존성 설치
FROM node:20-alpine AS deps
WORKDIR /app

# 패키지 매니저 파일 복사
COPY package.json package-lock.json* ./

# 의존성 설치
RUN npm ci

# Stage 2: 빌드
FROM node:20-alpine AS builder
WORKDIR /app

# 의존성 복사
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 빌드 시 필요한 환경 변수 (ARG로 받아서 ENV로 설정)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_AI_API_BASE_URL
ARG NEXT_PUBLIC_WEB_API_BASE_URL
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_KAKAO_JS_KEY
ARG NEXT_PUBLIC_NAVER_CLIENT_ID

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_AI_API_BASE_URL=$NEXT_PUBLIC_AI_API_BASE_URL
ENV NEXT_PUBLIC_WEB_API_BASE_URL=$NEXT_PUBLIC_WEB_API_BASE_URL
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_KAKAO_JS_KEY=$NEXT_PUBLIC_KAKAO_JS_KEY
ENV NEXT_PUBLIC_NAVER_CLIENT_ID=$NEXT_PUBLIC_NAVER_CLIENT_ID
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js 빌드
RUN npm run build

# Stage 3: 프로덕션 런타임
FROM node:20-alpine AS runner
WORKDIR /app

# Alpine에서 Next.js 및 네이티브 모듈(sharp 등) 호환성을 위한 패키지
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 시스템 사용자 생성 (보안)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 빌드된 파일 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 소유권 변경
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
