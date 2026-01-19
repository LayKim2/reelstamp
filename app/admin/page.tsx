// 관리자 페이지: 대본 생성 내역 관리
'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, X, Calendar, Search, Filter, User, Tag, ChevronDown, RefreshCw } from 'lucide-react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { useAdminRevisions } from '@/app/hooks/useAdminRevisions';
import { USER_ROLES } from '@/app/lib/constants/auth';
import ScriptTableRow from '@/app/components/features/script-creation/ScriptTableRow';
import { ScriptSegment } from '@/app/types/reels-creation';

// 카테고리 옵션 (Internal Type 값 사용)
const CATEGORY_OPTIONS = [
  { value: 'ALL', label: '전체 카테고리' },
  { value: 'information', label: '지식·정보' },
  { value: 'review', label: '리뷰·소개' },
  { value: 'vlog', label: '브이로그' },
  { value: 'other', label: '기타' },
];

// 사용자 타입 옵션
const USER_TYPE_OPTIONS = [
  { value: 'ALL', label: '전체 사용자' },
  { value: USER_ROLES.ADMIN, label: '관리자' },
  { value: USER_ROLES.USER, label: '일반 사용자' },
];

// 헬퍼: 카테고리 라벨 가져오기
const getCategoryLabel = (value: string) => 
  CATEGORY_OPTIONS.find(opt => opt.value === value)?.label || value;

// 대본을 세그먼트로 파싱하는 함수
function parseScriptToSegments(script: string): ScriptSegment[] {
  if (!script) return [];

  const lines = script.split('\n');
  const segments: ScriptSegment[] = [];
  let isTableStarted = false;

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    // 테이블 시작 감지
    if (trimmedLine.includes('구간') && trimmedLine.includes('시간') && trimmedLine.includes('|')) {
      isTableStarted = true;
      return;
    }

    // 구분선 무시
    if (trimmedLine.includes('---') && trimmedLine.includes('|')) {
      isTableStarted = true;
      return;
    }

    // 데이터 행 처리
    if (isTableStarted && trimmedLine.includes('|')) {
      const cleanLine = trimmedLine.replace(/^\||\|$/g, '');
      const cells = cleanLine.split('|').map(cell => cell.trim());
      
      if (cells.length >= 5) {
        segments.push({
          id: `segment-${segments.length + 1}`,
          section: cells[0].replace(/\*\*/g, '').trim(),
          timeline: cells[1].trim(),
          script: cells[2].trim(),
          visualSource: cells[3].trim(),
          designReason: cells.slice(4).join(' | ').trim()
        });
      }
    }
  });

  // 테이블 형식이 아닐 경우 폴백
  if (segments.length === 0) {
    segments.push({
      id: 'segment-1',
      section: '전체',
      timeline: '0~30s',
      script: script,
      visualSource: '전체 대본에 맞는 화면 구성',
      designReason: '제공된 정보를 바탕으로 구성되었습니다.'
    });
  }

  return segments;
}

// visualSource 파싱 헬퍼 함수
function parseVisualSource(visualSource: string) {
  const vsText = visualSource || '';
  const screenContent = vsText
    .replace(/^원본\s*영상\s*:\s*/, '')
    .replace(/^원본\s*\(.*?\)\s*:\s*/, '')
    .replace(/^원본\s*:\s*/, '')
    .replace(/(?!^)(원본[A-Z])/g, '<br>$1')
    .trim();
  return { screenContent };
}

// HTML 태그를 렌더링 가능한 형태로 변환
function renderHtml(text: string) {
  if (!text) return '';
  return text.replace(/<br\s*\/?>/gi, '\n');
}

// 테이블 헤더 컴포넌트
const TableHeader = ({ title, className }: { title: string; className: string }) => (
  <div className={`bg-[#373A46] text-white py-3 px-4 rounded-xl text-center font-bold text-sm ${className}`}>
    {title}
  </div>
);

// 커스텀 드롭다운 컴포넌트
const CustomSelect = ({ 
  icon: Icon, 
  label,
  value, 
  onChange, 
  options, 
  className = "" 
}: { 
  icon: any, 
  label: string,
  value: string, 
  onChange: (val: string) => void, 
  options: {value: string, label: string}[],
  className?: string
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative flex items-center group">
      <div className="absolute left-4 text-gray-400 group-hover:text-[#FF496D] transition-colors pointer-events-none">
        <Icon className="w-4 h-4" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 pl-11 pr-10 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-700 focus:bg-white focus:border-[#FF496D] focus:ring-4 focus:ring-pink-100 transition-all appearance-none cursor-pointer hover:bg-gray-100 shadow-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  </div>
);

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { data, isLoading, error, refetch } = useAdminRevisions();

  const isAdmin = isAuthenticated && user?.role?.toUpperCase() === USER_ROLES.ADMIN;
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedRevisionId, setSelectedRevisionId] = useState<string | null>(null);
  const [selectedScriptText, setSelectedScriptText] = useState<string>('');
  const [expandedDesignReasons, setExpandedDesignReasons] = useState<Set<string>>(new Set());
  const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());
  const [hoveredDesignReason, setHoveredDesignReason] = useState<string | null>(null);

  // Admin 권한 없으면 리다이렉트
  useEffect(() => {
    if (!isAdmin) {
      router.replace('/');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="admin-page-guard flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const revisions = useMemo(() => data?.data?.revisions ?? [], [data]);

  const filteredRevisions = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return revisions.filter((rev) => {
      // 카테고리 필터
      if (categoryFilter !== 'ALL' && rev.reelType !== categoryFilter) return false;

      // 사용자 타입 필터
      if (userTypeFilter !== 'ALL' && (rev.user?.role || USER_ROLES.USER) !== userTypeFilter) return false;

      // 날짜 필터
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (new Date(rev.createdAt) < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(rev.createdAt) > end) return false;
      }

      // 검색어 필터
      if (!keyword) return true;

      const haystack = [
        rev.reelTopic,
        rev.reelType,
        rev.templateName,
        rev.userRequest,
        rev.extraRequest,
        rev.updateRequest,
        rev.user?.email,
        rev.user?.nickname,
        rev.user?.socialNickname,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [revisions, searchKeyword, categoryFilter, userTypeFilter, startDate, endDate]);

  // 결과 대본 팝업 열기
  const handleOpenResult = useCallback((revisionId: string, scriptText: string) => {
    setSelectedRevisionId(revisionId);
    setSelectedScriptText(scriptText);
  }, []);

  // 결과 대본 팝업 닫기
  const handleCloseResult = useCallback(() => {
    setSelectedRevisionId(null);
    setSelectedScriptText('');
    setExpandedDesignReasons(new Set());
    setHoveredDesignReason(null);
  }, []);

  // 요청 내용 확장 토글
  const toggleRequestExpand = useCallback((revisionId: string) => {
    setExpandedRequests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(revisionId)) {
        newSet.delete(revisionId);
      } else {
        newSet.add(revisionId);
      }
      return newSet;
    });
  }, []);

  // 선택된 대본의 세그먼트 파싱
  const selectedSegments = useMemo(() => {
    if (!selectedScriptText) return [];
    return parseScriptToSegments(selectedScriptText);
  }, [selectedScriptText]);

  // Vercel Blob URL 구성
  const getBlobUrl = (filename: any) => {
    if (!filename || typeof filename !== 'string') return '';
    if (filename.startsWith('http')) return filename;
    return `https://hjnzn0ds2q0s3fs2.public.blob.vercel-storage.com/${filename}`;
  };

  return (
    <div className="admin-page-container bg-gradient-to-b from-white to-pink-50/30 min-h-screen">
      <div className="w-full pt-8 sm:pt-12 pb-4">
        <section className="admin-page-section mb-16">
          {/* 페이지 헤더 */}
          <div className="admin-page-header px-4 sm:px-6 lg:px-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">관리자 센터</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => refetch()}
                className="p-3 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-2xl border border-gray-100 shadow-sm transition-all active:scale-95"
                title="새로고침"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <div className="bg-white/80 backdrop-blur px-5 py-3 rounded-2xl border border-pink-100 shadow-sm flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-black text-gray-700">전체 {filteredRevisions.length}건</span>
              </div>
            </div>
          </div>

          {/* 탭 */}
          <div className="admin-page-tab-wrapper px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex border-b-2 border-pink-100 bg-white/40 rounded-t-3xl p-1.5 pb-0">
              <button
                className="admin-page-tab px-10 py-4 text-base font-black transition-all relative rounded-t-2xl whitespace-nowrap text-[#FF496D] bg-white shadow-[0_-4px_20px_rgba(255,73,109,0.08)] border-b-2 border-b-white"
                style={{ marginBottom: '-2px', zIndex: 10 }}
              >
                대본 생성 이력
              </button>
            </div>
          </div>

          {/* 콘텐츠 */}
          <div className="admin-page-content px-4 sm:px-6 lg:px-8">
            {isLoading && (
              <div className="admin-page-loading flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-[#FF496D]" />
                  <p className="text-gray-400 font-bold animate-pulse">데이터를 불러오는 중입니다...</p>
                </div>
              </div>
            )}

            {error && !isLoading && (
              <div className="admin-page-error bg-white rounded-[40px] p-16 shadow-2xl border border-red-50 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100">
                  <X className="w-10 h-10" />
                </div>
                <p className="text-2xl font-black text-gray-900 mb-2">데이터를 불러오지 못했습니다.</p>
                <p className="text-gray-500 mb-8 font-medium">네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요.</p>
                <button 
                  onClick={() => refetch()}
                  className="px-8 py-3.5 rounded-2xl bg-gray-900 text-white text-base font-black hover:bg-gray-800 transition-all shadow-xl active:scale-95"
                >
                  다시 시도하기
                </button>
              </div>
            )}

            {!isLoading && !error && revisions.length === 0 && (
              <div className="admin-page-empty bg-white rounded-[40px] p-24 shadow-sm text-center border border-gray-100">
                <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-[35px] flex items-center justify-center mx-auto mb-8">
                  <Filter className="w-12 h-12" />
                </div>
                <p className="text-2xl font-black text-gray-900 mb-3">아직 생성된 내역이 없습니다.</p>
                <p className="text-gray-400 font-bold">사용자가 대본을 생성하면 이곳에서 확인하실 수 있습니다.</p>
              </div>
            )}

            {/* 필터 & 검색 영역 */}
            {!isLoading && !error && revisions.length > 0 && (
              <div className="admin-page-filters mb-10 bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-pink-500/5 border border-white p-8 flex flex-col gap-8">
                <div className="flex flex-col xl:flex-row gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                    <CustomSelect 
                      icon={User}
                      label="User Type"
                      value={userTypeFilter}
                      onChange={setUserTypeFilter}
                      options={USER_TYPE_OPTIONS}
                    />
                    <CustomSelect 
                      icon={Tag}
                      label="Category"
                      value={categoryFilter}
                      onChange={setCategoryFilter}
                      options={CATEGORY_OPTIONS}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Date Range</label>
                    <div className="flex items-center gap-3 bg-gray-50/80 p-1.5 rounded-[22px] border border-transparent focus-within:border-[#FF496D]/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-pink-50 transition-all h-14 shadow-inner group">
                      <div className="flex items-center gap-3 px-4 flex-1">
                        <Calendar className="w-4 h-4 text-gray-400 group-focus-within:text-[#FF496D] transition-colors flex-shrink-0" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-transparent border-none text-sm font-black text-gray-700 focus:ring-0 p-0 w-full cursor-pointer"
                        />
                      </div>
                      <div className="w-px h-5 bg-gray-200"></div>
                      <div className="flex items-center gap-3 px-4 flex-1">
                        <Calendar className="w-4 h-4 text-gray-400 group-focus-within:text-[#FF496D] transition-colors flex-shrink-0" />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-transparent border-none text-sm font-black text-gray-700 focus:ring-0 p-0 w-full cursor-pointer"
                        />
                      </div>
                      {(startDate || endDate) && (
                        <button
                          onClick={() => { setStartDate(''); setEndDate(''); }}
                          className="p-2.5 text-gray-400 hover:text-[#FF496D] transition-all rounded-xl hover:bg-white shadow-sm mr-1.5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Smart Search</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF496D] transition-all group-focus-within:scale-110">
                      <Search className="w-6 h-6" />
                    </div>
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="주제, 내용, 요청 사항, 사용자 이메일 등 자유롭게 검색하세요..."
                      className="w-full h-16 pl-14 pr-8 rounded-[25px] border border-transparent bg-gray-50 text-base font-bold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#FF496D] focus:ring-4 focus:ring-pink-100 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 리스트 영역 */}
            {!isLoading && !error && filteredRevisions.length > 0 && (
              <div className="overflow-x-auto pb-10 custom-scrollbar-horizontal -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                <div className="admin-page-list space-y-6 min-w-[1200px]">
                  {filteredRevisions.map((item) => {
                  const userInfo = item.user;
                  const userDisplayName = userInfo?.nickname || userInfo?.socialNickname || userInfo?.email || '알 수 없음';
                  const isUserAdmin = userInfo?.role === USER_ROLES.ADMIN;

                  // videoSourceMap 파싱
                  let videos: { label: string; filename: string }[] = [];
                  try {
                    const rawMap = typeof item.videoSourceMap === 'string' 
                      ? JSON.parse(item.videoSourceMap || '[]') 
                      : (item.videoSourceMap || []);
                    videos = Array.isArray(rawMap) ? rawMap : 
                             (typeof rawMap === 'object' ? Object.entries(rawMap).map(([label, filename]) => ({ label, filename: String(filename) })) : []);
                  } catch (e) {
                    console.error('videoSourceMap 파싱 실패:', e);
                  }

                  return (
                    <article
                      key={item.revisionId}
                      className="admin-revision-card bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 group relative"
                    >
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${isUserAdmin ? 'from-purple-400 to-indigo-400' : 'from-[#FF496D] to-orange-400'}`}></div>

                      <div className="admin-revision-header px-10 py-8 bg-gradient-to-r from-gray-50/50 to-white border-b border-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
                        <div className="flex items-center gap-6 min-w-0 flex-1">
                          <div className={`admin-revision-avatar w-16 h-16 rounded-[24px] bg-gradient-to-br flex items-center justify-center text-2xl font-black text-white shadow-xl flex-shrink-0 group-hover:scale-110 transition-all duration-500 ${isUserAdmin ? 'from-purple-500 to-indigo-500 shadow-purple-200' : 'from-[#FF496D] to-[#FF8E9E] shadow-pink-200'}`}>
                            {userDisplayName[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 mb-1.5">
                              <p className="text-xl font-black text-gray-900 truncate tracking-tight">{userDisplayName}</p>
                              <span className={`px-3 py-1 rounded-xl text-[10px] font-black border uppercase tracking-widest ${isUserAdmin ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>
                                {getCategoryLabel(item.reelType)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-400">
                              <p className="text-xs font-bold truncate">{userInfo?.email || '이메일 정보 없음'}</p>
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${isUserAdmin ? 'text-purple-400' : 'text-gray-400'}`}>{userInfo?.role || USER_ROLES.USER}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em] mb-1.5">Generated Time</p>
                            <p className="text-sm font-black text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                              {new Date(item.createdAt).toLocaleString('ko-KR', {
                                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenResult(item.revisionId, item.scriptText || '')}
                            className="admin-revision-open-result h-14 px-10 rounded-2xl bg-gray-900 text-white text-base font-black hover:bg-gray-800 transition-all shadow-2xl shadow-gray-200 active:scale-95 flex items-center gap-3 group/btn"
                          >
                            결과 대본 보기
                            <ChevronDown className="w-5 h-5 group-hover/btn:translate-y-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>

                      <div className="admin-revision-main px-10 py-10">
                        <div className="flex gap-16">
                            <div className="flex-shrink-0 w-72">
                              <div className="flex items-center gap-3 mb-5">
                                <div className="w-2.5 h-6 bg-[#FF496D] rounded-full shadow-lg shadow-pink-100"></div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">릴스 주제</p>
                              </div>
                              <p className="text-lg text-gray-900 font-black leading-tight tracking-tight">{item.reelTopic || <span className="text-gray-200 font-medium italic">주제 미입력</span>}</p>
                            </div>

                            <div className="flex-1 min-w-0 border-l border-gray-100 pl-16">
                              <div className="flex items-center gap-3 mb-5">
                                <div className="w-2.5 h-6 bg-orange-400 rounded-full shadow-lg shadow-orange-100"></div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">릴스 내용</p>
                              </div>
                              <div className="relative">
                                <p className={`text-[15px] text-gray-700 leading-relaxed font-bold ${expandedRequests.has(item.revisionId) ? '' : 'line-clamp-3'}`}>
                                  {item.userRequest || <span className="text-gray-200 font-medium italic">내용 없음</span>}
                                </p>
                                {item.userRequest && item.userRequest.length > 100 && (
                                  <button onClick={() => toggleRequestExpand(item.revisionId)} className="mt-2 text-xs font-black text-[#FF496D] hover:underline flex items-center gap-1">
                                    {expandedRequests.has(item.revisionId) ? <>접기 <ChevronDown className="w-3 h-3 rotate-180" /></> : <>더보기 <ChevronDown className="w-3 h-3" /></>}
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="flex-shrink-0 w-72 border-l border-gray-100 pl-16">
                              <div className="flex items-center gap-3 mb-5">
                                <div className="w-2.5 h-6 bg-blue-400 rounded-full shadow-lg shadow-blue-100"></div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">추가 요청</p>
                              </div>
                              <div className="relative">
                                <p className={`text-[15px] text-gray-700 leading-relaxed font-bold ${expandedRequests.has(item.revisionId) ? '' : 'line-clamp-3'}`}>
                                  {item.extraRequest || <span className="text-gray-200 font-medium italic">추가 요청 없음</span>}
                                </p>
                                {item.extraRequest && item.extraRequest.length > 60 && (
                                  <button onClick={() => toggleRequestExpand(item.revisionId)} className="mt-2 text-xs font-black text-blue-500 hover:underline flex items-center gap-1">
                                    {expandedRequests.has(item.revisionId) ? <>접기 <ChevronDown className="w-3 h-3 rotate-180" /></> : <>더보기 <ChevronDown className="w-3 h-3" /></>}
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="flex-shrink-0 w-56 border-l border-gray-100 pl-16">
                              <div className="flex items-center gap-3 mb-5">
                                <div className="w-2.5 h-6 bg-purple-400 rounded-full shadow-lg shadow-purple-100"></div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">템플릿</p>
                              </div>
                              <div className="inline-flex px-4 py-1.5 rounded-xl bg-purple-50 border border-purple-100 shadow-sm">
                                <p className="text-base text-purple-700 font-black tracking-tight">{item.templateName || <span className="text-gray-300 font-medium italic">기본 템플릿</span>}</p>
                              </div>
                            </div>

                            {item.videoProvided && videos.length > 0 && (
                              <div className="flex-shrink-0 w-80 border-l border-gray-100 pl-16">
                                <div className="flex items-center gap-3 mb-5">
                                  <div className="w-2.5 h-6 bg-indigo-400 rounded-full shadow-lg shadow-indigo-100"></div>
                                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">업로드 영상</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                  {videos.map((v, idx) => (
                                    <a key={`${v.label}-${idx}`} href={getBlobUrl(v.filename)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-5 py-2.5 rounded-[18px] bg-indigo-50 text-indigo-700 text-xs font-black hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 shadow-sm active:scale-95 group/video">
                                      <RefreshCw className="w-3 h-3 mr-2 group-hover/video:rotate-180 transition-transform duration-500" />
                                      {v.label}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                  );
                })}
                </div>
              </div>
            )}

            {!isLoading && !error && filteredRevisions.length === 0 && revisions.length > 0 && (
              <div className="admin-page-empty bg-white rounded-[50px] p-32 shadow-2xl shadow-pink-500/5 text-center border border-gray-100">
                <div className="w-32 h-32 bg-pink-50 text-[#FF496D] rounded-[45px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <RefreshCw className="w-16 h-16 opacity-50" />
                </div>
                <p className="text-3xl font-black text-gray-900 mb-3">검색 결과가 없습니다.</p>
                <button onClick={() => { setSearchKeyword(''); setCategoryFilter('ALL'); setUserTypeFilter('ALL'); setStartDate(''); setEndDate(''); }} className="px-10 py-4 rounded-2xl bg-pink-50 text-[#FF496D] text-lg font-black hover:bg-[#FF496D] hover:text-white transition-all active:scale-95 shadow-sm">필터 초기화</button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 결과 대본 팝업 모달 */}
      {selectedRevisionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl transition-all duration-700">
          <div className="bg-white rounded-[50px] shadow-2xl w-full max-w-[1400px] max-h-[94vh] flex flex-col overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-between px-12 py-10 border-b border-gray-50 bg-gray-50/40">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#FF496D] rounded-[24px] flex items-center justify-center shadow-xl shadow-pink-100"><Tag className="w-8 h-8 text-white" /></div>
                <div>
                  <h2 className="text-4xl font-black text-gray-900 mb-1 tracking-tight">결과 대본 상세</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Revision Identifier</span>
                    <span className="px-3 py-1 rounded-lg bg-gray-200/50 text-[11px] font-black text-gray-600">{selectedRevisionId}</span>
                  </div>
                </div>
              </div>
              <button onClick={handleCloseResult} className="p-6 rounded-[30px] hover:bg-white hover:shadow-2xl transition-all group active:scale-90 shadow-sm border border-transparent hover:border-gray-100" aria-label="닫기"><X className="w-8 h-8 text-gray-400 group-hover:text-gray-900 transition-colors" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              {selectedSegments.length > 0 ? (
                <>
                  <div className="hidden xl:block">
                    <div className="overflow-visible custom-scrollbar">
                      <div className="grid grid-cols-12 gap-6 mb-10">
                        <TableHeader title="타임라인(초)" className="col-span-2 shadow-xl bg-gray-900 text-base py-4 rounded-2xl" />
                        <TableHeader title="대본" className="col-span-3 shadow-xl bg-gray-900 text-base py-4 rounded-2xl" />
                        <TableHeader title="화면 설계 및 상세 연출" className="col-span-7 shadow-xl bg-gray-900 text-base py-4 rounded-2xl" />
                      </div>
                      <div className="space-y-6 pr-4">
                        {selectedSegments.map((segment, index) => (
                          <ScriptTableRow
                            key={segment.id}
                            segment={{ ...segment, script: renderHtml(segment.script || '') }}
                            index={index}
                            screenContent={renderHtml(parseVisualSource(segment.visualSource || '').screenContent)}
                            expandedDesignReasons={expandedDesignReasons}
                            hoveredDesignReason={hoveredDesignReason}
                            onMouseEnter={setHoveredDesignReason}
                            onMouseLeave={() => setHoveredDesignReason(null)}
                            onToggleDesignReason={(id) => setExpandedDesignReasons(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
                              return newSet;
                            })}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="xl:hidden space-y-10 max-w-4xl mx-auto">
                    {selectedSegments.map((segment) => (
                      <div key={segment.id} className="bg-white border border-gray-100 rounded-[45px] p-10 shadow-xl space-y-8 hover:shadow-2xl transition-all duration-500">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{segment.section}</div>
                            <div className="inline-flex items-center px-5 py-2 rounded-2xl bg-pink-50 text-sm font-black text-[#FF496D] border border-pink-100 shadow-sm"><Calendar className="w-4 h-4 mr-2" />{segment.timeline}</div>
                          </div>
                        </div>
                        <div className="border-t border-gray-50 pt-8">
                          <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">대본 내용</p>
                          <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap font-bold">{renderHtml(segment.script || '')}</p>
                        </div>
                        <div className="border-t border-gray-50 pt-8">
                          <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">화면 구성 및 연출</p>
                          <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap font-bold">{renderHtml(parseVisualSource(segment.visualSource || '').screenContent)}</p>
                        </div>
                        {segment.designReason && (
                          <div className="border-t border-gray-50 pt-8">
                            <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">기획 및 설계 의도</p>
                            <div className="bg-gray-50/80 p-6 rounded-[30px] border border-gray-100">
                              <p className="text-base text-gray-600 leading-relaxed font-bold italic">"{segment.designReason}"</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-48 bg-gray-50 rounded-[50px] border-4 border-dashed border-gray-100">
                  <RefreshCw className="w-20 h-20 text-gray-200 mx-auto mb-6 opacity-50" />
                  <p className="text-gray-300 text-2xl font-black">표시할 대본 데이터가 존재하지 않습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F3F4F6; border-radius: 30px; border: 3px solid transparent; background-clip: content-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E5E7EB; background-clip: content-box; }
        .custom-scrollbar-horizontal::-webkit-scrollbar { height: 10px; }
        .custom-scrollbar-horizontal::-webkit-scrollbar-track { background: #F9FAFB; border-radius: 30px; }
        .custom-scrollbar-horizontal::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 30px; border: 2px solid transparent; background-clip: content-box; }
        .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover { background: #D1D5DB; background-clip: content-box; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
