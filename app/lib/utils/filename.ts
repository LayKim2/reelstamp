/**
 * 파일명을 URL-safe하게 변환하는 유틸리티 함수
 * 한글, 특수문자를 제거하고 영문/숫자/하이픈/언더스코어만 남깁니다.
 * 
 * @param filename 원본 파일명
 * @returns URL-safe한 파일명
 */
export function sanitizeFilename(filename: string): string {
  // 확장자 분리
  const lastDotIndex = filename.lastIndexOf('.');
  const name = lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
  const extension = lastDotIndex > 0 ? filename.substring(lastDotIndex) : '';

  // 파일명 부분을 URL-safe하게 변환
  let sanitized = name
    .replace(/\s+/g, '_') // 공백을 언더스코어로
    .replace(/[^a-zA-Z0-9_-]/g, '') // 영문/숫자/하이픈/언더스코어만 남기기
    .replace(/[_-]+/g, (match) => match[0]) // 연속된 언더스코어/하이픈을 하나로
    .replace(/^[_-]+|[_-]+$/g, ''); // 앞뒤 언더스코어/하이픈 제거

  if (!sanitized) {
    sanitized = 'video';
  }

  return sanitized + extension;
}
