-- Supabase 테이블 마이그레이션: creators 테이블 생성
-- 실행 방법: Supabase 대시보드 → SQL Editor → New Query → 아래 SQL 복사 후 실행
-- 목적: 오늘의 크리에이터 섹션에 표시할 데이터 저장

-- creators 테이블 생성
CREATE TABLE IF NOT EXISTS public.creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 크리에이터 기본 정보
  title TEXT NOT NULL,                    -- 크리에이터 이름/제목 (예: "김철수")
  instagram_id TEXT NOT NULL,             -- 인스타그램 ID (예: "@creator123")
  
  -- 분석 영상 정보
  analysis_reel_url TEXT NOT NULL,        -- 분석 영상 Instagram URL
  views TEXT NOT NULL,                    -- 조회수 (문자열로 표시, 예: "10만")
  followers TEXT,                         -- 팔로워 수 (nullable, 예: "12만")
  
  -- Top 3 영상 정보 (JSONB 배열로 저장)
  top_videos JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Top 3 영상 배열
  -- 각 영상 구조: { url, views, title, instagram_id, view_count }
  
  -- 메타데이터
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성: created_at 기준으로 최신 데이터 조회 최적화
CREATE INDEX IF NOT EXISTS idx_creators_created_at 
ON public.creators(created_at DESC);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 설정
CREATE POLICY "creators_select_policy" 
ON public.creators
FOR SELECT
USING (true);

-- 관리자만 INSERT 가능하도록 정책 설정 (필요시 수정)
-- CREATE POLICY "creators_insert_policy" 
-- ON public.creators
-- FOR INSERT
-- WITH CHECK (auth.role() = 'authenticated');

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER update_creators_updated_at
BEFORE UPDATE ON public.creators
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 테이블 생성 확인 쿼리 (선택사항)
-- SELECT 
--   column_name, 
--   data_type, 
--   is_nullable,
--   column_default
-- FROM information_schema.columns 
-- WHERE table_name = 'creators'
-- ORDER BY ordinal_position;

-- 샘플 데이터 삽입 예시 (테스트용)
/*
INSERT INTO public.creators (
  title,
  instagram_id,
  analysis_reel_url,
  views,
  followers,
  top_videos
) VALUES (
  '김철수',
  '@creator123',
  'https://www.instagram.com/reel/ABC123/',
  '10만',
  '12만',
  '[
    {
      "url": "https://www.instagram.com/reel/VIDEO1/",
      "views": "50만",
      "title": "인기 영상 1",
      "instagram_id": "@creator123",
      "view_count": "500000"
    },
    {
      "url": "https://www.instagram.com/reel/VIDEO2/",
      "views": "30만",
      "title": "인기 영상 2",
      "instagram_id": "@creator123",
      "view_count": "300000"
    },
    {
      "url": "https://www.instagram.com/reel/VIDEO3/",
      "views": "20만",
      "title": "인기 영상 3",
      "instagram_id": "@creator123",
      "view_count": "200000"
    }
  ]'::jsonb
);
*/

