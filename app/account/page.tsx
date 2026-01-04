// 계정 설정 페이지: 유저 정보, Upgrade plan, Settings 메뉴 제공
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import SettingsModal from '@/app/components/ui/SettingsModal';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-2xl mx-auto px-4 py-6 flex-1 flex flex-col w-full">
        {/* 페이지 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Account</h1>

        {/* 유저 정보 섹션 */}
        <div className="mb-8">
          <div className="px-6 py-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border-2 border-gray-200">
                {user.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt="프로필"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-orange-200">
                    <span className="text-2xl font-semibold text-gray-700">
                      {user.nickname?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {user.nickname || user.socialNickname || '사용자'}
                </p>
                {user.email && (
                  <p className="text-sm text-gray-500 truncate mt-1">{user.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 메뉴 항목 */}
        <div className="space-y-2 flex-1">
          <button
            onClick={() => {
              // Upgrade plan 기능 구현 필요
            }}
            className="w-full px-5 py-4 text-base font-medium text-gray-900 rounded-xl transition-all hover:bg-gray-50 hover:shadow-sm flex items-center gap-3 border border-gray-200"
          >
            <Sparkles className="w-5 h-5 text-gray-400" />
            <span>Upgrade plan</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full px-5 py-4 text-base font-medium text-gray-900 rounded-xl transition-all hover:bg-gray-50 hover:shadow-sm flex items-center gap-3 border border-gray-200"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span>Settings</span>
          </button>
        </div>

        {/* 로그아웃 버튼 (맨 밑) */}
        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full px-5 py-4 text-base font-medium text-white rounded-xl transition-all hover:bg-[#1F2128] hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#2B2D37' }}
          >
            <LogOut className="w-5 h-5" />
            <span>{isLoggingOut ? '로그아웃 중...' : 'Log out'}</span>
          </button>
        </div>
      </div>

      {/* Settings 모달 */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

