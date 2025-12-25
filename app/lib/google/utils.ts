// Google API 유틸리티 함수: private key 처리 등 공통 기능 제공

/**
 * Private key의 줄바꿈 문자 처리
 */
export function normalizePrivateKey(privateKey: string | undefined): string {
  if (!privateKey) {
    throw new Error('GOOGLE_PRIVATE_KEY 환경 변수가 설정되지 않았습니다.');
  }

  // \n 문자열을 실제 줄바꿈으로 변환
  return privateKey.replace(/\\n/g, '\n');
}

