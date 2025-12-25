// Google API 유틸리티 함수: private key 처리 등 공통 기능 제공

/**
 * Vercel 환경 변수에서 private key를 올바른 형식으로 변환
 * 여러 형식의 줄바꿈 문자를 처리
 */
export function normalizePrivateKey(privateKey: string | undefined): string {
  if (!privateKey) {
    throw new Error('GOOGLE_PRIVATE_KEY 환경 변수가 설정되지 않았습니다.');
  }

  // 공백 제거 (앞뒤 공백)
  let normalized = privateKey.trim();
  
  // 따옴표 제거 (.env 파일에서 따옴표로 감싼 경우 처리)
  // Vercel 환경 변수에서는 따옴표가 포함될 수 있으므로 제거
  if ((normalized.startsWith('"') && normalized.endsWith('"')) || 
      (normalized.startsWith("'") && normalized.endsWith("'"))) {
    normalized = normalized.slice(1, -1);
  }

  // BEGIN/END 마커 확인 (먼저 확인하여 형식 검증)
  if (!normalized.includes('-----BEGIN')) {
    throw new Error('Private key 형식이 올바르지 않습니다. BEGIN 마커가 없습니다.');
  }

  if (!normalized.includes('-----END')) {
    throw new Error('Private key 형식이 올바르지 않습니다. END 마커가 없습니다.');
  }

  // 이미 올바른 형식인 경우 (실제 줄바꿈 포함하고 BEGIN/END가 각각 줄의 시작/끝에 있음)
  if (normalized.includes('\n') && normalized.match(/^-----BEGIN/)) {
    return normalized;
  }

  // Vercel 환경 변수에서 `\n` 문자열로 저장된 경우 처리
  // 여러 패턴 시도: \\n, \n, 실제 줄바꿈
  normalized = normalized
    .replace(/\\n/g, '\n')      // \\n -> \n (가장 일반적)
    .replace(/\\\\n/g, '\n')    // \\\\n -> \n (이중 이스케이프)
    .replace(/\\r\\n/g, '\n')   // \\r\\n -> \n
    .replace(/\r\n/g, '\n')     // Windows 줄바꿈
    .replace(/\r/g, '\n');      // Mac 줄바꿈

  // BEGIN과 END 사이의 내용 정리
  // BEGIN PRIVATE KEY----- 다음에 줄바꿈이 없으면 추가
  normalized = normalized.replace(/-----BEGIN PRIVATE KEY-----([^\n])/g, '-----BEGIN PRIVATE KEY-----\n$1');
  // END PRIVATE KEY----- 앞에 줄바꿈이 없으면 추가
  normalized = normalized.replace(/([^\n])-----END PRIVATE KEY-----/g, '$1\n-----END PRIVATE KEY-----');

  // 연속된 공백이나 특수 문자 정리
  normalized = normalized.replace(/\n{3,}/g, '\n\n'); // 연속된 줄바꿈 정리

  // 최종 검증: BEGIN과 END가 각각 줄의 시작/끝에 있어야 함
  const lines = normalized.split('\n');
  const beginLine = lines.find(line => line.includes('-----BEGIN'));
  const endLine = lines.find(line => line.includes('-----END'));

  if (!beginLine || !beginLine.startsWith('-----BEGIN')) {
    throw new Error('Private key 형식이 올바르지 않습니다. BEGIN 마커가 올바른 위치에 없습니다.');
  }

  if (!endLine || !endLine.startsWith('-----END')) {
    throw new Error('Private key 형식이 올바르지 않습니다. END 마커가 올바른 위치에 없습니다.');
  }

  return normalized;
}

