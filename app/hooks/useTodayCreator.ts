// 오늘의 크리에이터 데이터 페칭 훅: Supabase에서 가장 최근 크리에이터 데이터를 가져오는 커스텀 훅
'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/app/lib/supabase/client';
import { Creator, CreatorReel } from '@/app/types/supabase';

// shortcode로부터 Instagram embed URL 생성
function createInstagramUrl(shortcode: string): string {
  // shortcode가 이미 URL 형식인 경우 그대로 반환
  if (shortcode.startsWith('http://') || shortcode.startsWith('https://')) {
    return shortcode;
  }
  // shortcode만 있는 경우 릴스 embed URL 형식으로 변환
  return `https://www.instagram.com/reel/${shortcode}/`;
}

// 조회수를 포맷팅하는 함수 (예: "4500000" -> "4.5M", "52000" -> "52K")
function formatViews(views: string): string {
  const viewCount = parseInt(views, 10);
  if (isNaN(viewCount)) {
    return views; // 숫자가 아니면 그대로 반환
  }
  
  if (viewCount >= 1000000) {
    return `${(viewCount / 1000000).toFixed(1)}M`;
  } else if (viewCount >= 1000) {
    return `${(viewCount / 1000).toFixed(0)}K`;
  }
  return viewCount.toString();
}

// 컴포넌트에서 사용할 데이터 타입
export interface TodayCreatorData {
  analysisReel: {
    url: string;
    title: string;
    instagramId: string;
    views: string;
    followers?: string;
  };
  topVideos: Array<{
    url: string;
    views: string;
    title: string;
    instagramId: string;
    viewCount: string;
  }>;
}

// Supabase에서 오늘의 크리에이터 데이터를 가져오는 함수
async function fetchTodayCreator(): Promise<TodayCreatorData | null> {
  // 1. 가장 최근 created_at을 가진 크리에이터 조회
  const { data: creators, error: creatorError } = await supabase
    .from('creators')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (creatorError) {
    console.error('크리에이터 데이터 조회 오류:', creatorError);
    throw creatorError;
  }

  // 데이터가 없으면 null 반환
  if (!creators) {
    return null;
  }

  // 2. 해당 크리에이터의 Top 3 영상 조회 (조회수 내림차순으로 정렬)
  const { data: reels, error: reelsError } = await supabase
    .from('creator_reels')
    .select('*')
    .eq('creator_id', creators.id)
    .order('views', { ascending: false })
    .limit(3); // Top 3만 가져오기

  if (reelsError) {
    console.error('크리에이터 릴스 데이터 조회 오류:', reelsError);
    throw reelsError;
  }

  // 3. 데이터 변환
  const creator = creators as Creator;
  const creatorReels = (reels || []) as CreatorReel[];

  // Top 3 영상을 조회수 내림차순으로 정렬하여 변환 (이미 DB에서 정렬됨)
  const topVideos = creatorReels.map((reel) => ({
    url: createInstagramUrl(reel.shortcode),
    views: formatViews(reel.views), // views를 포맷팅하여 표시
    title: reel.title || '',
    instagramId: reel.instagram_id,
    viewCount: reel.views, // 원본 숫자 저장
  }));

  return {
    analysisReel: {
      url: createInstagramUrl(creator.analysis_reel_shortcode),
      title: creator.name,
      instagramId: creator.instagram_id,
      views: '', // 분석 영상의 조회수는 DB에 없으므로 빈 문자열
      followers: creator.followers || undefined,
    },
    topVideos,
  };
}

// 오늘의 크리에이터 데이터 페칭 훅
export function useTodayCreator() {
  return useQuery({
    queryKey: ['today-creator'], // 쿼리 키: 오늘의 크리에이터 데이터 캐시 관리
    queryFn: fetchTodayCreator,
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
  });
}

