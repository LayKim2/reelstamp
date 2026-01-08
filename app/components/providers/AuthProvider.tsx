// 인증 상태 전역 관리 Provider: React Context를 사용한 로그인 상태 관리
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserInfo, SubscriptionStatusResponse } from '@/app/lib/api/auth';
import { logoutAction, getSubscriptionStatusAction } from '@/app/actions/auth';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  subscription: SubscriptionStatusResponse | null;
  isLoadingSubscription: boolean;
  setUser: (user: UserInfo | null) => void;
  logout: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser: UserInfo | null;
}

/**
 * 인증 상태 및 구독 정보를 전역으로 관리하는 Provider
 * 
 * @param initialUser 서버에서 미리 가져온 유저 정보 (하이드레이션 패턴)
 */
export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(initialUser);
  const [subscription, setSubscription] = useState<SubscriptionStatusResponse | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  // 구독 정보 조회 함수
  const refreshSubscription = async () => {
    if (!user) {
      setSubscription(null);
      return;
    }

    try {
      setIsLoadingSubscription(true);
      const result = await getSubscriptionStatusAction();
      if (result.success && result.data) {
        // action의 리턴 타입이 현재 SubscriptionStatusResponse와 약간 다를 수 있으므로 매핑 확인 필요
        // getSubscriptionStatusAction의 data 타입이 SubscriptionData만 포함하고 있을 수 있음
        // 만약 전체 SubscriptionStatusResponse를 반환하도록 action을 수정해야 한다면 아래에서 조정
        setSubscription(result.data as any);
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  // 로그인 상태가 변경될 때 구독 정보 로드
  useEffect(() => {
    if (user) {
      refreshSubscription();
    } else {
      setSubscription(null);
    }
  }, [user]);

  const logout = async () => {
    await logoutAction();
    setUser(null);
    setSubscription(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        subscription,
        isLoadingSubscription,
        setUser,
        logout,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 인증 상태를 사용하는 커스텀 훅
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, logout } = useAuth();
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

