#!/bin/bash
# Docker 빌드 스크립트: .env.local 파일을 읽어서 빌드 인자로 전달

set -e

# .env.local 파일이 있으면 로드
if [ -f .env.local ]; then
  echo "Loading environment variables from .env.local..."
  # 주석과 빈 줄 제거 후 export
  export $(grep -v '^#' .env.local | grep -v '^$' | xargs)
  echo "Environment variables loaded successfully."
else
  echo "Warning: .env.local file not found. Make sure to set environment variables."
fi

# Docker Compose로 빌드
echo "Building Docker image..."
docker-compose build "$@"

echo "Build completed successfully!"
