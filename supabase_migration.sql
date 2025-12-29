-- Supabase 테이블 마이그레이션: reels_exports 테이블에 title 컬럼 추가
-- 실행 방법: Supabase 대시보드 → SQL Editor → New Query → 아래 SQL 복사 후 실행

-- title 컬럼 추가 (nullable, 기존 데이터는 null로 설정)
ALTER TABLE public.reels_exports 
ADD COLUMN IF NOT EXISTS title text;

-- 컬럼 추가 확인 (선택사항)
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'reels_exports' AND column_name = 'title';

