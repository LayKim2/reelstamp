#!/bin/bash
# Docker buildx 빌드 스크립트: .env.local 파일을 읽어서 빌드 인자로 전달

set -e

# 기본값 설정
PLATFORM=${PLATFORM:-linux/amd64}
IMAGE_TAG=${IMAGE_TAG:-reelstamp-front:latest}
PUSH=${PUSH:-false}

# 환경 변수 로드 함수 (NEXT_PUBLIC_* 변수만 선별적으로 로드)
load_env_file() {
  local file=$1
  if [ ! -f "$file" ]; then
    return 1
  fi
  
  echo "Loading NEXT_PUBLIC_* environment variables from $file..."
  
  # 필요한 환경 변수 목록
  local vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "NEXT_PUBLIC_AI_API_BASE_URL"
    "NEXT_PUBLIC_WEB_API_BASE_URL"
    "NEXT_PUBLIC_GA_MEASUREMENT_ID"
    "NEXT_PUBLIC_BASE_URL"
    "NEXT_PUBLIC_KAKAO_JS_KEY"
    "NEXT_PUBLIC_NAVER_CLIENT_ID"
  )
  
  # 각 변수를 개별적으로 읽기
  for var in "${vars[@]}"; do
    # grep으로 변수 찾기 (주석 제외, 첫 번째 = 이후의 모든 값 포함)
    local value=$(grep -E "^[[:space:]]*${var}[[:space:]]*=" "$file" 2>/dev/null | head -1 | sed "s/^[^=]*=[[:space:]]*//" | sed 's/^["'\'']//; s/["'\'']$//')
    
    if [ -n "$value" ]; then
      export "$var=$value"
      echo "  ✓ $var loaded"
    fi
  done
  
  echo "Environment variables loaded successfully."
}

# .env.local 또는 .env 파일 로드
if [ -f .env.local ]; then
  load_env_file .env.local
elif [ -f .env ]; then
  load_env_file .env
else
  echo "Warning: .env.local or .env file not found. Make sure to set environment variables."
fi

# 빌드 인자 준비
BUILD_ARGS=(
  --platform "$PLATFORM"
  --provenance=false
  --sbom=false
  --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
  --build-arg NEXT_PUBLIC_AI_API_BASE_URL="${NEXT_PUBLIC_AI_API_BASE_URL}"
  --build-arg NEXT_PUBLIC_WEB_API_BASE_URL="${NEXT_PUBLIC_WEB_API_BASE_URL}"
  --build-arg NEXT_PUBLIC_GA_MEASUREMENT_ID="${NEXT_PUBLIC_GA_MEASUREMENT_ID}"
  --build-arg NEXT_PUBLIC_BASE_URL="${NEXT_PUBLIC_BASE_URL}"
  --build-arg NEXT_PUBLIC_KAKAO_JS_KEY="${NEXT_PUBLIC_KAKAO_JS_KEY}"
  --build-arg NEXT_PUBLIC_NAVER_CLIENT_ID="${NEXT_PUBLIC_NAVER_CLIENT_ID}"
  -t "$IMAGE_TAG"
)

# push 옵션 추가
if [ "$PUSH" = "true" ]; then
  BUILD_ARGS+=(--push)
fi

# 현재 디렉토리 추가
BUILD_ARGS+=(.)

# Docker buildx 빌드 실행
echo "Building Docker image with buildx..."
echo "Platform: $PLATFORM"
echo "Image Tag: $IMAGE_TAG"
echo "Push: $PUSH"
echo ""

docker buildx build "${BUILD_ARGS[@]}"

echo ""
echo "Build completed successfully!"
