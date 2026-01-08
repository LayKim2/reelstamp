-- 오늘의 크리에이터 데이터 삽입 쿼리
-- 실행 방법: Supabase 대시보드 → SQL Editor → New Query → 아래 SQL 복사 후 실행

-- ============================================
-- 방법 1: 한 번에 실행 (권장) - CTE 사용
-- ============================================
WITH inserted_creator AS (
  INSERT INTO public.creators (
    name,
    instagram_id,
    analysis_reel_shortcode,
    followers
  ) VALUES (
    '백억남',
    'billionman10',
    'DSFRCeNk7cs',
    '343K'
  ) RETURNING id
)
INSERT INTO public.creator_reels (
  creator_id,
  shortcode,
  views,
  title,
  instagram_id
)
SELECT 
  inserted_creator.id,
  reel_data.shortcode,
  reel_data.views,
  reel_data.title,
  reel_data.instagram_id
FROM inserted_creator
CROSS JOIN (VALUES
  ('C4puukivWTy', '4500000', NULL, 'billionman10'),
  ('C212FAXPQQP', '4400000', NULL, 'billionman10'),
  ('C2wu7XuP1Mn', '1600000', NULL, 'billionman10')
) AS reel_data(shortcode, views, title, instagram_id);

-- ============================================
-- 방법 2: 단계별 실행 (선택사항)
-- ============================================

-- 1단계: 크리에이터 데이터 삽입
/*
INSERT INTO public.creators (
  name,
  instagram_id,
  analysis_reel_shortcode,
  followers
) VALUES (
  '백억남',
  'billionman10',
  'DSFRCeNk7cs',
  '343K'
) RETURNING id;
*/

-- 2단계: 위 쿼리 실행 후 반환된 creator_id를 확인하고 아래 쿼리 실행
-- (또는 instagram_id로 자동 조회)
/*
INSERT INTO public.creator_reels (
  creator_id,
  shortcode,
  views,
  title,
  instagram_id
) VALUES 
  ((SELECT id FROM public.creators WHERE instagram_id = 'billionman10' ORDER BY created_at DESC LIMIT 1), 
   'C4puukivWTy', 
   '4500000', 
   NULL, 
   'billionman10'),
  ((SELECT id FROM public.creators WHERE instagram_id = 'billionman10' ORDER BY created_at DESC LIMIT 1), 
   'C212FAXPQQP', 
   '4400000', 
   NULL, 
   'billionman10'),
  ((SELECT id FROM public.creators WHERE instagram_id = 'billionman10' ORDER BY created_at DESC LIMIT 1), 
   'C2wu7XuP1Mn', 
   '1600000', 
   NULL, 
   'billionman10');
*/

-- ============================================
-- 데이터 확인 쿼리
-- ============================================
SELECT 
  c.id,
  c.name,
  c.instagram_id,
  c.analysis_reel_shortcode,
  c.followers,
  c.created_at,
  json_agg(
    json_build_object(
      'shortcode', cr.shortcode,
      'views', cr.views,
      'title', cr.title,
      'instagram_id', cr.instagram_id
    ) ORDER BY cr.views::numeric DESC
  ) as top_videos
FROM public.creators c
LEFT JOIN public.creator_reels cr ON c.id = cr.creator_id
WHERE c.instagram_id = 'billionman10'
  AND c.created_at = (SELECT MAX(created_at) FROM public.creators WHERE instagram_id = 'billionman10')
GROUP BY c.id, c.name, c.instagram_id, c.analysis_reel_shortcode, c.followers, c.created_at;
