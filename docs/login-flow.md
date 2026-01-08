# 소셜 로그인 프로세스

## 전체 흐름

```
[브라우저] → [소셜 인증(카카오/네이버)] → [인가 코드] → [액세스 토큰] → [Next.js Server Action] → [Spring API] → [httpOnly 쿠키]
```

## 1. 카카오 로그인 플로우

### 1.1. SDK 초기화 및 로그인 요청
- **SDK 초기화**: `app/login/page.tsx`에서 `initKakao()` 호출.
- **로그인 시작**: `window.Kakao.Auth.authorize()`를 사용하여 카카오 인증 페이지로 이동.

### 1.2. 토큰 교환 및 로그인 처리
- **인가 코드 수신**: 리다이렉트된 URL에서 `code` 추출.
- **액세스 토큰 교환**: `https://kauth.kakao.com/oauth/token` 호출.
- **로그인 처리**: 발급받은 토큰으로 `loginWithSocialAction(token, 'KAKAO')` 호출.

## 2. 네이버 로그인 플로우 (OAuth 2.0 직접 구현)

### 2.1. 인가 페이지 리다이렉트
- **로그인 시작**: `https://nid.naver.com/oauth2.0/authorize`로 이동.
- **파라미터**: `client_id`, `redirect_uri`, `state`, `response_type=code`.

### 2.2. 토큰 교환 및 로그인 처리
- **인가 코드 수신**: 리다이렉트된 URL에서 `code`와 `state` 추출.
- **액세스 토큰 교환**: 보안을 위해 내부 API Route(`app/api/auth/naver-token/route.ts`)를 통해 `https://nid.naver.com/oauth2.0/token` 호출.
- **로그인 처리**: 발급받은 토큰으로 `loginWithSocialAction(token, 'NAVER')` 호출.

## 3. 공통 처리 아키텍처

### 3.1. 통합 Server Action (`app/actions/auth.ts`)
`loginWithSocialAction(accessToken, provider)` 함수가 모든 소셜 로그인을 통합 처리합니다.

1. **Spring API 호출**: `POST /api/auth/login`에 토큰과 제공자 정보 전송.
2. **쿠키 저장**: 응답으로 받은 `accessToken`, `refreshToken`을 httpOnly 쿠키에 저장.
3. **상태 반환**: 로그인 성공 여부와 사용자 정보(`userInfo`) 반환.

### 3.2. 전역 상태 관리 (`AuthProvider`)
- 로그인 성공 시 반환된 `userInfo`를 `AuthContext`에 저장하여 앱 전체에서 참조 가능하게 합니다.

## 4. 환경 변수 설정 (`.env.local`)

```env
# 카카오
NEXT_PUBLIC_KAKAO_JS_KEY=...

# 네이버
NEXT_PUBLIC_NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
```

**주의**: `NAVER_CLIENT_SECRET`은 서버 사이드 전용이므로 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다.

### 6. 사용자 정보 출력

```typescript
if (result.userInfo) {
  console.log('사용자 정보:', result.userInfo);
}
```

**위치**: `app/login/page.tsx` - `processLogin()`

## 주요 파일

- **`app/login/page.tsx`**: 클라이언트 사이드 로그인 UI 및 카카오 SDK 처리
- **`app/actions/auth.ts`**: Server Action - Spring API 호출 및 httpOnly 쿠키 저장
- **`app/lib/api/server-client.ts`**: 서버 사이드 API 클라이언트 - 쿠키에서 토큰 자동 추출

## 환경 변수

- **`NEXT_PUBLIC_KAKAO_JS_KEY`**: 필수 (없으면 에러 발생)

## 보안 특징

- **httpOnly 쿠키**: JavaScript 접근 불가 (XSS 방어)
- **secure 옵션**: 프로덕션에서 HTTPS만 전송
- **sameSite: 'lax'**: CSRF 방어
- **서버 사이드 처리**: 토큰이 클라이언트에 노출되지 않음

