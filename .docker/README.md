# Docker 설정 가이드

## 프로덕션 빌드

### 빌드 및 실행

**중요**: docker-compose는 기본적으로 `.env` 파일만 읽습니다. `.env.local`을 사용하려면 다음 중 하나를 선택하세요:

**방법 1: .env 파일 생성 (가장 간단)**
```bash
# .env.local을 .env로 복사
cp .env.local .env

# docker-compose로 빌드 및 실행
docker-compose up -d --build
```

**방법 2: 빌드 스크립트 사용**
```bash
# .env.local 파일을 읽어서 빌드
./docker-build.sh

# 빌드 후 실행
docker-compose up -d
```

**방법 3: 환경 변수 직접 export**
```bash
# .env.local 파일을 export
export $(cat .env.local | grep -v '^#' | grep -v '^$' | xargs)

# docker-compose로 빌드 및 실행
docker-compose up -d --build
```

**참고**: `.env` 파일은 Git에 커밋하지 않도록 `.gitignore`에 포함되어 있습니다.

**방법 4: docker buildx build 사용 (OCI Registry 푸시용)**

**빌드 스크립트 사용 (권장):**
```bash
# 기본 사용 (linux/amd64, push 없음)
./docker-buildx.sh

# 커스텀 태그 및 플랫폼
PLATFORM=linux/amd64 IMAGE_TAG=yny.ocir.io/axscfm7prhsr/reelstamp-front:2026-01-11-1 PUSH=true ./docker-buildx.sh
```

**직접 빌드:**
```bash
# 환경 변수 export
export $(cat .env.local | grep -v '^#' | grep -v '^$' | xargs)

# docker buildx build
docker buildx build \
  --platform linux/amd64 \
  --provenance=false \
  --sbom=false \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
  --build-arg NEXT_PUBLIC_AI_API_BASE_URL="${NEXT_PUBLIC_AI_API_BASE_URL}" \
  --build-arg NEXT_PUBLIC_WEB_API_BASE_URL="${NEXT_PUBLIC_WEB_API_BASE_URL}" \
  --build-arg NEXT_PUBLIC_GA_MEASUREMENT_ID="${NEXT_PUBLIC_GA_MEASUREMENT_ID}" \
  --build-arg NEXT_PUBLIC_BASE_URL="${NEXT_PUBLIC_BASE_URL}" \
  --build-arg NEXT_PUBLIC_KAKAO_JS_KEY="${NEXT_PUBLIC_KAKAO_JS_KEY}" \
  --build-arg NEXT_PUBLIC_NAVER_CLIENT_ID="${NEXT_PUBLIC_NAVER_CLIENT_ID}" \
  -t yny.ocir.io/axscfm7prhsr/reelstamp-front:2026-01-11-1 \
  --push \
  .
```

**방법 5: 일반 docker build (로컬 테스트용)**
```bash
# 환경 변수 export 후
export $(cat .env.local | grep -v '^#' | grep -v '^$' | xargs)

# 직접 빌드
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
  --build-arg NEXT_PUBLIC_AI_API_BASE_URL="${NEXT_PUBLIC_AI_API_BASE_URL}" \
  --build-arg NEXT_PUBLIC_WEB_API_BASE_URL="${NEXT_PUBLIC_WEB_API_BASE_URL}" \
  --build-arg NEXT_PUBLIC_GA_MEASUREMENT_ID="${NEXT_PUBLIC_GA_MEASUREMENT_ID}" \
  --build-arg NEXT_PUBLIC_BASE_URL="${NEXT_PUBLIC_BASE_URL}" \
  --build-arg NEXT_PUBLIC_KAKAO_JS_KEY="${NEXT_PUBLIC_KAKAO_JS_KEY}" \
  --build-arg NEXT_PUBLIC_NAVER_CLIENT_ID="${NEXT_PUBLIC_NAVER_CLIENT_ID}" \
  -t reelstamp:latest .

# 컨테이너 실행
docker run -p 3000:3000 --env-file .env.local reelstamp:latest
```

### 환경 변수 설정
`.env.local` 파일에 다음 환경 변수를 설정하세요:

**빌드 시 필수 (NEXT_PUBLIC_*):**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL (필수)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon Key (필수)
- `NEXT_PUBLIC_AI_API_BASE_URL`: AI API 기본 URL (선택, 기본값 있음)
- `NEXT_PUBLIC_WEB_API_BASE_URL`: Web API 기본 URL (선택, 기본값 있음)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics 측정 ID (선택)
- `NEXT_PUBLIC_BASE_URL`: 애플리케이션 기본 URL (선택)
- `NEXT_PUBLIC_KAKAO_JS_KEY`: 카카오 JavaScript 키 (선택)
- `NEXT_PUBLIC_NAVER_CLIENT_ID`: 네이버 클라이언트 ID (선택)

**런타임 시 필요:**
- `PAYAPP_USERID`: PayApp 사용자 ID
- `PAYAPP_LINKKEY`: PayApp 링크 키
- 기타 서버 사이드 환경 변수들

## 개발 환경

### 개발 모드 실행
```bash
# 개발 모드로 실행
docker-compose -f docker-compose.dev.yml up

# 백그라운드 실행
docker-compose -f docker-compose.dev.yml up -d
```

## 유용한 명령어

### 컨테이너 로그 확인
```bash
docker-compose logs -f web
```

### 컨테이너 중지 및 제거
```bash
docker-compose down
```

### 이미지 재빌드
```bash
# 빌드 스크립트 사용
./docker-build.sh --no-cache

# 또는 환경 변수 export 후
export $(cat .env.local | grep -v '^#' | xargs)
docker-compose build --no-cache
```

### 컨테이너 내부 접속
```bash
docker-compose exec web sh
```
