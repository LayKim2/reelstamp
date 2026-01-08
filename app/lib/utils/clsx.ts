// 조건부 클래스명 유틸리티 함수: Tailwind CSS 조건부 스타일링을 위한 헬퍼 함수
// 여러 클래스명을 조건부로 결합하여 사용할 수 있게 해줌

type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean };

/**
 * 클래스명을 조건부로 결합하는 유틸리티 함수
 * @param inputs - 클래스명 또는 조건부 객체
 * @returns 결합된 클래스명 문자열
 * 
 * @example
 * clsx('foo', 'bar') // 'foo bar'
 * clsx({ foo: true, bar: false }) // 'foo'
 * clsx('foo', { bar: true, baz: false }) // 'foo bar'
 */
export function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = clsx(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

