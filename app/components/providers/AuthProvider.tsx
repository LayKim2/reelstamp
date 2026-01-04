// 인증 상태 전역 관리 Provider: React Context를 사용한 로그인 상태 관리
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { UserInfo } from '@/app/lib/api/auth';
import { logoutAction } from '@/app/actions/auth';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  setUser: (user: UserInfo | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser: UserInfo | null;
}

/**
 * 인증 상태를 전역으로 관리하는 Provider
 * 
 * @param initialUser 서버에서 미리 가져온 유저 정보 (하이드레이션 패턴)
 */
export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(initialUser);

  const logout = async () => {
    await logoutAction();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        logout,
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

