// Supabase 클라이언트 초기화: 클라이언트 사이드에서 Supabase 데이터베이스 접근을 위한 클라이언트 생성
import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수 검증
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL 환경 변수가 설정되지 않았습니다.');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY 환경 변수가 설정되지 않았습니다.');
}

// Supabase 클라이언트 생성 및 export
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

