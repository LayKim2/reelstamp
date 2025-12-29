# BooQuest 프로젝트 가이드라인

이 문서는 BooQuest 웹 프로젝트의 전체 가이드라인을 정의합니다.

## 📋 목차
1. [프로젝트 구조](#프로젝트-구조)
2. [API 라우트 가이드라인](#api-라우트-가이드라인)
3. [데이터베이스 처리 방식](#데이터베이스-처리-방식)
4. [코딩 컨벤션](#코딩-컨벤션)
5. [컴포넌트 구조](#컴포넌트-구조)

---

## 프로젝트 구조

### 기술 스택
- **프레임워크**: Next.js 13+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS (기본 스타일링 및 레이아웃)
- **UI 라이브러리**: Chakra UI (보완적 사용 - 빠른 컴포넌트 및 접근성)
- **백엔드**: Supabase (인증, DB, 스토리지)
- **상태 관리**: React Query (서버 상태 + 데이터 페칭)
- **HTTP 클라이언트**: Axios
- **아키텍처**: 클린 아키텍처 원칙

### 디렉토리 구조
```
booquest_web/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # 인증 관련 라우트 그룹
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/            # 대시보드 라우트 그룹
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                    # Next.js API Routes (제한적 사용)
│   │   └── [간단한 서버 로직만]
│   ├── components/              # 공통 재사용 컴포넌트
│   │   ├── ui/                 # 기본 UI 컴포넌트
│   │   └── features/           # 기능별 컴포넌트
│   ├── lib/                    # 유틸리티 및 설정
│   │   ├── supabase/           # Supabase 클라이언트 설정
│   │   ├── api/                # API 호출 함수 (Axios)
│   │   └── utils/              # 유틸리티 함수
│   ├── hooks/                  # 커스텀 React Hooks
│   ├── types/                  # TypeScript 타입 정의
│   ├── providers/              # Context Providers (React Query 등)
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈 페이지
│   ├── error.tsx               # 에러 바운더리
│   ├── not-found.tsx           # 404 페이지
│   ├── loading.tsx             # 로딩 UI
│   ├── globals.css             # 전역 스타일
│   └── middleware.ts           # 미들웨어 (인증/인가)
├── docs/                       # 프로젝트 문서
├── public/                     # 정적 파일
├── .env.local                  # 환경 변수 (로컬)
├── .env.example                # 환경 변수 예시
└── ...
```

### 폴더 구조 원칙

#### 1. 기능별 라우팅 (Feature-based Routing)
- **원칙**: URL 구조와 폴더 구조를 일치시킴
- **예시**: 
  - `app/auth/login/page.tsx` → `/auth/login`
  - `app/dashboard/settings/page.tsx` → `/dashboard/settings`
- **라우트 그룹**: `(auth)`, `(dashboard)` 사용으로 레이아웃 분리
- **목적**: 유지보수와 확장성을 쉽게 하기 위함

#### 2. 컴포넌트 구조
- **`app/components/ui/`**: 기본 UI 컴포넌트 (Button, Input, Card 등)
- **`app/components/features/`**: 기능별 컴포넌트 (UserProfile, ProductList 등)
- **페이지 전용 컴포넌트**: 해당 페이지 폴더 내 `components/`에 배치 가능
  - 예: `app/dashboard/components/DashboardCard.tsx`

#### 3. 라이브러리 및 설정
- **`app/lib/supabase/`**: 
  - Supabase 클라이언트 초기화
  - 인증 헬퍼 함수
  - DB 쿼리 헬퍼 함수
- **`app/lib/api/`**: 
  - Axios 인스턴스 설정
  - API 호출 함수 (Supabase API 호출)
  - 에러 처리 유틸리티
- **`app/lib/utils/`**: 순수 유틸리티 함수 (날짜 포맷팅, 문자열 처리 등)

#### 4. 타입 정의
- **`app/types/`**: 전역 타입 정의
  - Supabase 타입
  - API 응답 타입
  - 공통 인터페이스
- **컴포넌트/기능 전용 타입**: 해당 파일 내부에 정의 가능

#### 5. 커스텀 훅
- **`app/hooks/`**: 재사용 가능한 커스텀 훅
  - React Query 훅 (useQuery, useMutation 래퍼)
  - 비즈니스 로직 훅
  - UI 상태 관리 훅

#### 6. 프로바이더
- **`app/providers/`**: Context Provider
  - React Query Provider
  - 테마 Provider (필요시)
  - 기타 전역 상태 Provider

#### 7. Next.js 특수 파일
- **`app/layout.tsx`**: 루트 레이아웃 (모든 페이지에 공통 적용)
- **`app/error.tsx`**: 에러 바운더리
- **`app/not-found.tsx`**: 404 페이지
- **`app/loading.tsx`**: 로딩 UI
- **`app/middleware.ts`**: 미들웨어 (인증/인가, 리다이렉트 등)

### 파일 네이밍 규칙
- **컴포넌트**: PascalCase (예: `UserProfile.tsx`, `DashboardCard.tsx`)
- **페이지**: Next.js 규칙 준수 (`page.tsx`, `layout.tsx`, `loading.tsx`)
- **유틸리티/훅**: camelCase (예: `formatDate.ts`, `useAuth.ts`)
- **타입**: camelCase (예: `userTypes.ts`, `apiTypes.ts`)
- **폴더명**: kebab-case (예: `user-profile/`, `api-client/`)

### 아키텍처 원칙 (클린 아키텍처)

#### 1. 계층 분리
- **Presentation Layer**: `app/`, `components/`
  - UI 컴포넌트 및 페이지
  - 사용자 인터랙션 처리
- **Application Layer**: `hooks/`, `lib/api/`
  - 비즈니스 로직
  - 데이터 페칭 및 상태 관리
- **Domain Layer**: `types/`, `lib/utils/`
  - 도메인 모델 및 타입
  - 순수 유틸리티 함수
- **Infrastructure Layer**: `lib/supabase/`
  - 외부 서비스 연동 (Supabase)
  - 데이터베이스 접근

#### 2. 의존성 방향
- 상위 계층은 하위 계층에 의존
- 하위 계층은 상위 계층을 알지 못함
- 예: 컴포넌트 → 훅 → API 함수 → Supabase 클라이언트

#### 3. 비즈니스 로직 처리
- **대부분의 비즈니스 로직**: Supabase API에 위임
- **Next.js API Routes**: 간단한 서버 로직에만 제한적 사용
  - 파일 업로드 전처리
  - 웹훅 처리
  - 서버 사이드 검증 등
- **목적**: 구조 단순화 및 유지보수성 향상

---

## API 라우트 가이드라인

### API 라우트 위치
- `app/api/` 디렉토리에 생성
- RESTful API 원칙 준수

### 예시 구조
```
app/api/
├── auth/
│   ├── login/
│   │   └── route.ts
│   └── logout/
│       └── route.ts
├── users/
│   └── route.ts
└── ...
```

### 사용 원칙
- **제한적 사용**: 간단한 서버 로직에만 사용
- **대부분의 비즈니스 로직**: Supabase API에 위임
- **사용 사례**:
  - 파일 업로드 전처리
  - 웹훅 처리
  - 서버 사이드 검증
  - 외부 API 프록시
  - 복잡한 서버 사이드 계산

### 에러 처리 방식

#### 표준 에러 응답
```typescript
// 성공 응답
return NextResponse.json(
  { success: true, data: result },
  { status: 200 }
);

// 에러 응답
return NextResponse.json(
  { success: false, error: { message: 'Error message', code: 'ERROR_CODE' } },
  { status: 400 }
);
```

#### HTTP 상태 코드
- **200**: 성공
- **400**: 클라이언트 에러 (잘못된 요청)
- **401**: 인증 실패
- **403**: 권한 없음
- **404**: 리소스 없음
- **500**: 서버 에러

#### 에러 처리 예시
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 로직 처리
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
```

### 응답 형식

#### 표준 응답 구조
```typescript
// 성공 응답
{
  success: true,
  data: { ... }
}

// 에러 응답
{
  success: false,
  error: {
    message: string,
    code?: string
  }
}
```

#### 타입 정의
```typescript
// app/types/apiTypes.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
```

### 인증/인가 처리

#### 인증 확인
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  
  // 세션 확인
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json(
      { success: false, error: { message: 'Unauthorized' } },
      { status: 401 }
    );
  }
  
  // 로직 처리
  return NextResponse.json({ success: true, data: result });
}
```

#### 권한 확인
- Supabase RLS (Row Level Security) 정책 활용
- 서버 사이드에서 추가 권한 검증 필요 시 Service Role Key 사용

### 파일 구조 예시

#### 단일 라우트
```typescript
// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 웹훅 처리 로직
  return NextResponse.json({ success: true });
}
```

#### 동적 라우트
```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  // 로직 처리
  return NextResponse.json({ success: true, data: result });
}
```

### 주의사항
- **클라이언트에서 직접 호출**: 대부분의 경우 클라이언트에서 Supabase 클라이언트를 직접 사용
- **API Routes는 최소화**: 필요한 경우에만 사용하여 구조 단순화
- **타입 안정성**: TypeScript로 요청/응답 타입 정의
- **환경 변수**: 서버 사이드에서만 사용되는 환경 변수는 `NEXT_PUBLIC_` 접두사 없이 사용

---

## 데이터베이스 처리 방식

### DB 클라이언트
- **Supabase Client**: Supabase JavaScript 클라이언트 사용
- **위치**: `app/lib/supabase/`에서 클라이언트 초기화 및 관리
- **특징**: BaaS 서비스로 별도 ORM 불필요, Supabase 클라이언트로 직접 쿼리

### 데이터베이스 스키마

#### 스키마 관리
- **Supabase Dashboard**: 스키마는 Supabase 대시보드에서 직접 관리
- **마이그레이션**: Supabase SQL Editor 또는 마이그레이션 파일로 관리
- **타입 생성**: Supabase CLI로 TypeScript 타입 자동 생성 (선택사항)
  - 생성된 타입은 `app/types/supabase.ts`에 저장

#### 스키마 파일 위치 (선택사항)
- **마이그레이션 파일**: `supabase/migrations/` (Supabase CLI 사용 시)
- **타입 정의**: `app/types/supabase.ts` (자동 생성된 타입)

#### 스키마 정의 원칙
- 테이블명: snake_case (예: `user_profiles`, `product_items`)
- 컬럼명: snake_case
- Primary Key: `id` (UUID 또는 BigInt)
- Timestamps: `created_at`, `updated_at` 자동 관리

### 쿼리 패턴

#### Supabase 쿼리 작성
- **위치**: `app/lib/supabase/` 또는 `app/hooks/`에서 React Query와 함께 사용
- **방식**: Supabase JavaScript 클라이언트의 메서드 체이닝 사용

#### 기본 쿼리 패턴
```typescript
// SELECT 쿼리
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false });

// INSERT 쿼리
const { data, error } = await supabase
  .from('users')
  .insert([{ name: 'John', email: 'john@example.com' }])
  .select();

// UPDATE 쿼리
const { data, error } = await supabase
  .from('users')
  .update({ name: 'Jane' })
  .eq('id', userId)
  .select();

// DELETE 쿼리
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', userId);
```

#### React Query와 함께 사용
```typescript
// app/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      if (error) throw error;
      return data;
    }
  });
}
```

#### Supabase 데이터 페칭 필수 규칙
- **항상 Hook으로 구현**: Supabase에서 데이터를 가져올 때는 반드시 `app/hooks/`에 커스텀 Hook을 만들어서 `useQuery`와 함께 사용
- **useQuery 필수 사용**: `useState`와 `useEffect`로 직접 구현하지 않고, React Query의 `useQuery`를 사용하여 서버 상태 관리
- **staleTime 설정 필수**: 모든 Supabase 쿼리에는 적절한 `staleTime`을 설정하여 캐싱 최적화
  - 기본값: `staleTime: 5 * 60 * 1000` (5분)
  - 데이터 특성에 따라 조정 가능 (예: 자주 변경되는 데이터는 짧게, 거의 변경되지 않는 데이터는 길게)
- **쿼리 키 명확히 지정**: `queryKey`에 의미 있는 키를 지정하여 캐시 관리 (예: `['ranking', category]`)

```typescript
// ✅ 올바른 예시
// app/hooks/useRankingData.ts
export function useRankingData(category: Category) {
  return useQuery({
    queryKey: ['ranking', category],
    queryFn: () => fetchRankingData(category),
    staleTime: 5 * 60 * 1000, // 필수: 캐싱 최적화
  });
}

// ❌ 잘못된 예시 - 직접 useState/useEffect 사용
export default function RankingPage() {
  const [data, setData] = useState([]);
  useEffect(() => {
    supabase.from('reels_exports').select('*').then(...);
  }, []);
}
```

#### 쿼리 작성 규칙
- **에러 처리**: 항상 `error` 체크 후 처리
- **타입 안정성**: TypeScript 타입 활용 (Supabase 타입 자동 생성)
- **필터링**: `.eq()`, `.neq()`, `.gt()`, `.lt()` 등 메서드 활용
- **정렬**: `.order()` 메서드 사용
- **페이지네이션**: `.range()` 메서드 사용
- **관계 조인**: `.select()`에서 관계 테이블 포함 (예: `select('*, profiles(*)')`)

#### RLS (Row Level Security)
- Supabase RLS 정책으로 데이터 접근 제어
- 클라이언트에서 RLS 정책 자동 적용
- 서버 사이드 작업은 Service Role Key 사용

---

## 코딩 컨벤션

### 네이밍 규칙
- 컴포넌트: PascalCase (예: `UserProfile.tsx`)
- 함수/변수: camelCase (예: `getUserData`)
- 상수: UPPER_SNAKE_CASE (예: `API_BASE_URL`)
- 파일명: 컴포넌트는 PascalCase, 그 외는 kebab-case

### TypeScript
- 모든 파일은 TypeScript 사용
- `any` 타입 사용 금지
- 인터페이스는 `I` 접두사 없이 사용

### 주석
- 모든 함수/컴포넌트에 기능 설명 주석 추가
- 복잡한 로직은 인라인 주석으로 설명

---

## 컴포넌트 구조

### 컴포넌트 파일 구조
```typescript
// 1. Imports
import ...

// 2. Types/Interfaces
interface Props {
  ...
}

// 3. Component
export default function ComponentName({ ... }: Props) {
  // 4. Hooks
  // 5. Logic
  // 6. Render
  return (...)
}
```

### Server Component vs Client Component

#### Server Component (기본)
- **기본값**: Next.js App Router에서 컴포넌트는 기본적으로 Server Component
- **특징**: 서버에서 렌더링, 번들 크기 감소, 데이터베이스 직접 접근 가능
- **사용 시기**:
  - 데이터 페칭
  - 백엔드 리소스 접근
  - 민감한 정보 (API 키 등)
  - 큰 의존성 사용

#### Client Component
- **지시어**: 파일 상단에 `'use client'` 추가
- **특징**: 클라이언트에서 렌더링, 인터랙티브 기능 사용 가능
- **사용 시기**:
  - `useState`, `useEffect` 등 React Hooks 사용
  - 이벤트 리스너 (`onClick`, `onChange` 등)
  - 브라우저 API 사용
  - React Query 사용 (클라이언트 사이드 데이터 페칭)

#### 예시
```typescript
// Server Component (기본)
// app/components/UserList.tsx
import { supabase } from '@/lib/supabase/server';

export default async function UserList() {
  const { data } = await supabase.from('users').select('*');
  return <div>{/* 렌더링 */}</div>;
}

// Client Component
// app/components/UserForm.tsx
'use client';

import { useState } from 'react';

export default function UserForm() {
  const [name, setName] = useState('');
  return <form>{/* 폼 렌더링 */}</form>;
}
```

### 컴포넌트 파일 구조 (상세)

#### Server Component 구조
```typescript
// 1. Imports (React, Next.js, 라이브러리)
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase/server';

// 2. Types/Interfaces
interface Props {
  userId: string;
  className?: string;
}

// 3. Component
export default async function UserProfile({ userId, className }: Props) {
  // 4. 데이터 페칭 (서버 사이드)
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  // 5. Render
  return (
    <div className={className}>
      {/* JSX */}
    </div>
  );
}
```

#### Client Component 구조
```typescript
'use client';

// 1. Imports
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/lib/api/users';

// 2. Types/Interfaces
interface UserProfileProps {
  userId: string;
  className?: string;
}

// 3. Component
export default function UserProfile({ userId, className }: UserProfileProps) {
  // 4. Hooks
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const [isEditing, setIsEditing] = useState(false);

  // 5. Logic
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 6. Render
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <div className={className}>
      {/* JSX */}
    </div>
  );
}
```

### 컴포넌트 작성 원칙

#### 1. 단일 책임 원칙
- 하나의 컴포넌트는 하나의 책임만 가짐
- 복잡한 컴포넌트는 작은 컴포넌트로 분리

#### 2. Props 타입 정의
- 모든 Props는 TypeScript 인터페이스로 정의
- Optional props는 `?` 사용
- 기본값은 destructuring에서 설정

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  // ...
}
```

#### 3. 컴포넌트 분리 기준
- **재사용성**: 여러 곳에서 사용되면 별도 컴포넌트로 분리
- **복잡도**: 100줄 이상이면 분리 고려
- **관심사 분리**: UI와 로직이 섞이면 커스텀 훅으로 로직 분리

#### 4. 네이밍 규칙
- **컴포넌트명**: PascalCase
- **파일명**: 컴포넌트명과 동일 (예: `UserProfile.tsx`)
- **Props 인터페이스**: `{ComponentName}Props` (예: `UserProfileProps`)

#### 5. 스타일링
- **Tailwind CSS**: 인라인 클래스 사용
- **조건부 스타일**: `clsx` 또는 `cn` 유틸리티 사용
- **반응형**: Tailwind 브레이크포인트 활용

```typescript
import { clsx } from 'clsx';

interface CardProps {
  variant?: 'default' | 'outlined';
  className?: string;
}

export default function Card({ variant = 'default', className }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg p-4',
        variant === 'outlined' && 'border border-gray-300',
        className
      )}
    >
      {/* 내용 */}
    </div>
  );
}
```

### 컴포넌트 폴더 구조

#### UI 컴포넌트
```
app/components/ui/
├── Button.tsx
├── Input.tsx
├── Card.tsx
└── Modal.tsx
```

#### 기능별 컴포넌트
```
app/components/features/
├── UserProfile.tsx
├── ProductList.tsx
└── DashboardCard.tsx
```

#### 페이지 전용 컴포넌트
```
app/dashboard/
├── components/
│   ├── DashboardStats.tsx
│   └── RecentActivity.tsx
└── page.tsx
```

### React Query 사용 패턴

#### 커스텀 훅으로 분리
```typescript
// app/hooks/useUser.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/lib/api/users';

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });
}

// app/components/UserProfile.tsx
'use client';

import { useUser } from '@/hooks/useUser';

export default function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId);
  // ...
}
```

### 주석 작성 규칙
- **컴포넌트 상단**: 컴포넌트의 목적과 사용법 설명
- **복잡한 로직**: 인라인 주석으로 설명
- **Props**: JSDoc 스타일 주석 (선택사항)

```typescript
// 사용자 프로필을 표시하는 컴포넌트
// userId를 받아서 사용자 정보를 조회하고 표시
export default function UserProfile({ userId }: UserProfileProps) {
  // ...
}
```

---

## 기타 가이드라인

### 환경 변수 관리

#### 파일 구조
- **`.env.local`**: 로컬 개발 환경 변수 (Git에 커밋하지 않음)
- **`.env.example`**: 환경 변수 예시 파일 (Git에 커밋)
- **`.env.production`**: 프로덕션 환경 변수 (배포 시 사용)

#### Supabase 환경 변수
```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### 네이밍 규칙
- **클라이언트에서 사용**: `NEXT_PUBLIC_` 접두사 필수
- **서버에서만 사용**: 접두사 없이 작성
- **대문자와 언더스코어 사용**: `NEXT_PUBLIC_API_BASE_URL`

#### 사용 방법
```typescript
// 클라이언트/서버 모두
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// 서버에서만
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

### 에러 처리 전략

#### 전역 에러 처리
- **`app/error.tsx`**: 페이지 레벨 에러 바운더리
- **`app/not-found.tsx`**: 404 에러 처리
- **React Query 에러**: `onError` 콜백으로 처리

#### 에러 타입 정의
```typescript
// app/types/errorTypes.ts
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}
```

#### API 에러 처리
- **Axios 인터셉터**: `app/lib/api/`에서 전역 에러 처리
- **Supabase 에러**: Supabase 클라이언트에서 자동 처리
- **에러 로깅**: 개발 환경에서는 콘솔, 프로덕션에서는 에러 트래킹 서비스

#### 컴포넌트 에러 처리
```typescript
// React Query 사용 시
const { data, error, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  onError: (error) => {
    // 에러 처리 로직
  }
});
```

### 상수 관리

#### 파일 위치
- **`app/lib/constants/`**: 전역 상수 정의
- **예시 파일**:
  - `app/lib/constants/api.ts`: API 관련 상수
  - `app/lib/constants/routes.ts`: 라우트 경로 상수
  - `app/lib/constants/config.ts`: 설정 상수

#### 네이밍 규칙
- **상수명**: UPPER_SNAKE_CASE
- **타입**: `const` 또는 `export const`

#### 예시
```typescript
// app/lib/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
} as const;

// app/lib/constants/api.ts
export const API_ENDPOINTS = {
  USERS: '/api/users',
  AUTH: '/api/auth',
} as const;
```

### 상태 관리 방식

#### 서버 상태 관리
- **React Query**: 서버 데이터 페칭 및 캐싱
- **사용 위치**: `app/hooks/`에서 커스텀 훅으로 래핑
- **캐시 관리**: React Query가 자동으로 관리

#### 클라이언트 상태 관리
- **로컬 상태**: `useState`, `useReducer` 사용
- **전역 상태**: Context API 또는 Zustand (필요시)
- **폼 상태**: React Hook Form (필요시)

#### 상태 관리 원칙
- 서버 상태는 React Query로 관리
- UI 상태는 로컬 상태로 관리
- 전역 상태는 최소화

### 스타일링 규칙

#### UI 라이브러리 사용 원칙

##### Tailwind CSS (기본)
- **역할**: 기본 스타일링과 레이아웃 처리
- **우선순위**: 대부분의 스타일링은 Tailwind CSS로 처리
- **사용 범위**:
  - 레이아웃 (Grid, Flexbox)
  - 간단한 컴포넌트 스타일링
  - 반응형 디자인
  - 커스텀 디자인 시스템

##### Chakra UI (보완적)
- **역할**: 빠르고 접근성 좋은 컴포넌트 제공
- **사용 시기**:
  - 복잡한 UI 컴포넌트가 빠르게 필요할 때
  - 접근성(A11y)이 중요한 컴포넌트
  - 폼 컴포넌트 (FormControl, Input, Select 등)
  - 모달, 토스트, 드로어 등 복잡한 컴포넌트
- **사용 원칙**:
  - Tailwind로 충분하면 Tailwind 사용
  - Chakra UI는 필요한 경우에만 보완적으로 사용
  - 두 라이브러리를 함께 사용 가능 (Chakra 컴포넌트에 Tailwind 클래스 적용 가능)

#### Tailwind CSS 사용
- **유틸리티 클래스 우선**: 인라인 스타일 최소화
- **커스텀 클래스**: `@apply` 지시어 사용 (제한적)
- **반응형 디자인**: `sm:`, `md:`, `lg:` 등 브레이크포인트 활용

#### Chakra UI 사용
- **Provider 설정**: `app/providers/`에서 ChakraProvider 설정
- **테마 커스터마이징**: 필요시 `app/lib/chakra/theme.ts`에서 테마 수정
- **컴포넌트 import**: `@chakra-ui/react`에서 필요한 컴포넌트만 import
- **Tailwind와 함께 사용**: Chakra 컴포넌트에 `className` prop으로 Tailwind 클래스 추가 가능

#### 컴포넌트 스타일링
- **기본**: Tailwind CSS 유틸리티 클래스 사용
- **복잡한 컴포넌트**: Chakra UI 컴포넌트 사용
- **조건부 스타일**: `clsx` 또는 `cn` 유틸리티 함수 사용
- **다크 모드**: Tailwind `dark:` 접두사 또는 Chakra UI ColorMode 사용

#### 스타일 파일
- **전역 스타일**: `app/globals.css`에만 정의
- **컴포넌트별 CSS**: 가능한 한 Tailwind 클래스로 처리
- **Chakra UI 스타일**: Chakra 컴포넌트의 style props 사용

#### 사용 예시
```typescript
// Tailwind CSS 사용 (기본)
export default function Card() {
  return (
    <div className="rounded-lg p-4 bg-white shadow-md">
      <h2 className="text-xl font-bold">Title</h2>
    </div>
  );
}

// Chakra UI 사용 (보완적)
'use client';

import { Box, Button, Modal, ModalOverlay, ModalContent } from '@chakra-ui/react';

export default function UserModal() {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {/* 모달 내용 */}
      </ModalContent>
    </Modal>
  );
}

// Tailwind와 Chakra UI 함께 사용
import { Box } from '@chakra-ui/react';

export default function HybridComponent() {
  return (
    <Box className="rounded-lg p-4">
      {/* Chakra 컴포넌트에 Tailwind 클래스 적용 */}
    </Box>
  );
}
```

---

## 업데이트 이력
- 2025-01-XX: 초기 가이드라인 작성

