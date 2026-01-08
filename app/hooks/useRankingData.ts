// 랭킹 데이터 페칭 훅: Supabase에서 카테고리별 랭킹 데이터를 가져오는 커스텀 훅
'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/app/lib/supabase/client';
import { Category, RankingItem } from '@/app/types/ranking';
import { ReelsExport } from '@/app/types/supabase';

// 조회수를 포맷팅하는 함수 (예: 1700000 -> "1.7M", 52000 -> "52K")
function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(0)}K`;
  }
  return views.toString();
}

// shortcode로부터 Instagram embed URL 생성: 릴스 shortcode를 Instagram embed URL로 변환
// Instagram embed는 data-instgrm-permalink에 일반 URL을 사용하지만, 
// embed를 위한 표준 URL 형식으로 생성 (reel/{shortcode}/)
function createInstagramUrl(shortcode: string): string {
  // shortcode가 이미 URL 형식인 경우 그대로 반환
  if (shortcode.startsWith('http://') || shortcode.startsWith('https://')) {
    return shortcode;
  }
  // shortcode만 있는 경우 릴스 embed URL 형식으로 변환
  // Instagram embed는 /embed/ 없이 일반 URL 형식 사용
  return `https://www.instagram.com/reel/${shortcode}/`;
}

// Supabase 데이터를 RankingItem으로 변환하는 함수
function transformReelsExportToRankingItem(
  data: ReelsExport[],
  category: Category
): RankingItem[] {
  return data.map((item, index) => ({
    rank: index + 1, // 순위는 정렬된 순서대로 1부터 시작
    instagramUrl: createInstagramUrl(item.shortcode), // shortcode로부터 URL 생성
    title: item.title || ``,
    instagramId: item.account,
    views: formatViews(item.views),
    category: category as Category,
  }));
}

// 카테고리별 랭킹 데이터를 가져오는 함수
async function fetchRankingData(category: Category): Promise<RankingItem[]> {
  // Supabase에서 카테고리별 데이터 조회 (views 내림차순, updated_at 내림차순)
  const { data, error } = await supabase
    .from('reels_exports')
    .select('*')
    .eq('category', category)
    .order('views', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(8); // 상위 8개 가져오기

  if (error) {
    console.error('랭킹 데이터 조회 오류:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      category: category,
      fullError: error,
    });
    throw new Error(`랭킹 데이터 조회 실패 (${category}): ${error.message || '알 수 없는 오류'}`);
  }

  // 데이터가 없으면 빈 배열 반환
  if (!data || data.length === 0) {
    return [];
  }

  // ReelsExport 타입으로 변환 후 RankingItem으로 변환
  return transformReelsExportToRankingItem(data as ReelsExport[], category);
}

// 랭킹 데이터 페칭 훅
export function useRankingData(category: Category) {
  return useQuery({
    queryKey: ['ranking', category], // 쿼리 키: 카테고리별로 캐시 관리
    queryFn: () => fetchRankingData(category),
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
  });
}

