-- reels_exports 테이블에 shortcode UNIQUE 제약 추가
-- 실행 방법: Supabase 대시보드 → SQL Editor → New Query → 아래 SQL 복사 후 실행

-- 1단계: 기존 중복 데이터 확인 (선택사항)
-- SELECT shortcode, COUNT(*) as count
-- FROM public.reels_exports
-- GROUP BY shortcode
-- HAVING COUNT(*) > 1;

-- 2단계: 중복 데이터가 있다면 삭제 (필요시 주석 해제)
-- DELETE FROM public.reels_exports
-- WHERE id NOT IN (
--   SELECT MIN(id)
--   FROM public.reels_exports
--   GROUP BY shortcode
-- );

-- 3단계: shortcode에 UNIQUE 제약 추가
ALTER TABLE public.reels_exports 
ADD CONSTRAINT reels_exports_shortcode_unique UNIQUE (shortcode);

