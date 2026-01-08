-- Supabase 테이블 마이그레이션: creators 테이블 생성
-- 실행 방법: Supabase 대시보드 → SQL Editor → New Query → 아래 SQL 복사 후 실행
-- 목적: 오늘의 크리에이터 섹션에 표시할 데이터 저장

-- creators 테이블 생성
CREATE TABLE IF NOT EXISTS public.creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 크리에이터 기본 정보
  name TEXT NOT NULL,                      -- 크리에이터 이름 (예: "김철수")
  instagram_id TEXT NOT NULL,             -- 인스타그램 ID (예: "@creator123")
  
  -- 분석 영상 정보
  analysis_reel_shortcode TEXT NOT NULL,  -- 분석 영상 Instagram shortcode (예: "ABC123")
  followers TEXT,                         -- 팔로워 수 (nullable, 예: "12만")
  
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

-- ============================================
-- creator_reels 테이블 생성 (Top 3 영상)
-- ============================================

-- creator_reels 테이블 생성
CREATE TABLE IF NOT EXISTS public.creator_reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  
  -- 영상 정보
  shortcode TEXT NOT NULL,                 -- Instagram shortcode (예: "VIDEO1")
  views TEXT NOT NULL,                     -- 조회수 숫자 (문자열, 예: "4500000") - 표시 시 K/M으로 포맷팅
  title TEXT,                              -- 영상 제목 (nullable)
  instagram_id TEXT NOT NULL,             -- 인스타그램 ID (예: "@creator123")
  
  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_creator_reels_creator_id 
ON public.creator_reels(creator_id);

-- 조회수 기준 정렬을 위한 인덱스 (내림차순 정렬 최적화)
CREATE INDEX IF NOT EXISTS idx_creator_reels_views 
ON public.creator_reels(creator_id, views DESC);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE public.creator_reels ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 설정
CREATE POLICY "creator_reels_select_policy" 
ON public.creator_reels
FOR SELECT
USING (true);

-- updated_at 트리거 생성
CREATE TRIGGER update_creator_reels_updated_at
BEFORE UPDATE ON public.creator_reels
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
