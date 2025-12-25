// Google API 유틸리티 함수: private key 처리 등 공통 기능 제공

/**
 * Vercel 환경 변수에서 private key를 올바른 형식으로 변환
 * 여러 형식의 줄바꿈 문자를 처리
 */
export function normalizePrivateKey(privateKey: string | undefined): string {
  if (!privateKey) {
    throw new Error('GOOGLE_PRIVATE_KEY 환경 변수가 설정되지 않았습니다.');
  }

  // 이미 올바른 형식인 경우 (실제 줄바꿈 포함)
  if (privateKey.includes('\n') && !privateKey.includes('\\n')) {
    return privateKey;
  }

  // Vercel 환경 변수에서 `\n` 문자열로 저장된 경우 처리
  // 여러 패턴 시도: \\n, \n, 실제 줄바꿈
  let normalized = privateKey
    .replace(/\\n/g, '\n')  // \\n -> \n
    .replace(/\\\\n/g, '\n') // \\\\n -> \n (이중 이스케이프)
    .replace(/\r\n/g, '\n')  // Windows 줄바꿈
    .replace(/\r/g, '\n');    // Mac 줄바꿈

  // BEGIN/END 마커 확인
  if (!normalized.includes('-----BEGIN')) {
    throw new Error('Private key 형식이 올바르지 않습니다. BEGIN 마커가 없습니다.');
  }

  if (!normalized.includes('-----END')) {
    throw new Error('Private key 형식이 올바르지 않습니다. END 마커가 없습니다.');
  }

  return normalized;
}

