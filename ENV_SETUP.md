# 환경 변수 및 설정 가이드

이 문서는 Reelstamp 프로젝트를 실행하기 위해 필요한 모든 환경 변수와 설정을 정리한 것입니다.

## 📋 필수 환경 변수 목록

### 1. PayApp 결제 연동 (필수)

PayApp 정기결제 기능을 사용하기 위한 설정입니다.

```env
# PayApp 판매자 아이디 (PayApp 관리자 페이지에서 확인)
PAYAPP_USERID=your_payapp_userid

# PayApp API 연동 키 (PayApp 관리자 페이지 → 설정 → 연동 정보에서 확인)
PAYAPP_LINKKEY=your_payapp_linkkey
```

**설정 방법:**
1. [PayApp 관리자 페이지](https://payapp.kr) 로그인
2. **설정** 탭 → **연동 정보** 메뉴
3. `userid`와 `linkkey` 값을 복사하여 환경 변수에 설정

---

### 2. Vercel Blob 스토리지 (필수)

영상 업로드 기능을 사용하기 위한 설정입니다.

```env
# Vercel Blob 읽기/쓰기 토큰
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxxxxxxxxx
```

**설정 방법:**
1. **Vercel 대시보드** → 프로젝트 선택
2. **Storage** 탭 → **Create Database** → **Blob** 선택
3. Blob 스토어 생성 후 자동으로 토큰이 생성됩니다
4. Vercel 배포 환경에서는 자동으로 설정되지만, 로컬 개발 시:
   ```bash
   vercel env pull
   ```
   또는 `.env.local`에 직접 추가

---

### 3. API 서버 설정 (필수)

외부 API 서버와 통신하기 위한 설정입니다.

```env
# AI API 서버 URL (대본 생성 등)
NEXT_PUBLIC_AI_API_BASE_URL=http://140.245.70.80:8083

# Web API 서버 URL (인증, 구독 등)
NEXT_PUBLIC_WEB_API_BASE_URL=http://140.245.70.80:8082

# API 타임아웃 (밀리초, 기본값: 300000 = 5분)
API_TIMEOUT=300000
```

**기본값:**
- `NEXT_PUBLIC_AI_API_BASE_URL`: `http://140.245.70.80:8083` (기본값 있음)
- `NEXT_PUBLIC_WEB_API_BASE_URL`: `http://140.245.70.80:8082` (기본값 있음)
- `API_TIMEOUT`: `300000` (기본값 있음)

---

### 4. 내부 API 보안 (필수)

내부 API 서버와의 통신 보안을 위한 설정입니다.

```env
# 내부 API 통신용 시크릿 키
X_INTERNAL_SECRET=your_internal_secret_key
```

**설정 방법:**
- 백엔드 서버와 동일한 값으로 설정해야 합니다
- 강력한 랜덤 문자열을 사용하세요 (최소 32자 이상 권장)

---

### 5. Base URL 설정 (필수 - Vercel 배포 시)

Vercel 배포 환경에서 결제 리다이렉트 및 웹훅 URL을 생성하기 위한 설정입니다.

```env
# 프로덕션 배포 URL (Vercel 배포 시 필수)
NEXT_PUBLIC_BASE_URL=https://reelstamp.vercel.app
```

**설정 방법:**
- 로컬 개발: 설정하지 않아도 됨 (자동으로 `http://localhost:3000` 사용)
- Vercel 배포: 실제 배포된 도메인으로 설정
  - 예: `https://reelstamp.vercel.app`
  - 예: `https://your-custom-domain.com`

---

### 6. Supabase 설정 (필수)

데이터베이스 및 인증을 위한 설정입니다.

```env
# Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anon Key (공개 키)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**설정 방법:**
1. [Supabase 대시보드](https://supabase.com) 로그인
2. 프로젝트 선택 → **Settings** → **API**
3. `Project URL`과 `anon public` 키를 복사

---

### 7. 소셜 로그인 설정 (선택)

카카오 및 네이버 로그인을 사용하는 경우 필요합니다.

#### 7.1 카카오 로그인

```env
# 카카오 JavaScript 키
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_js_key
```

**설정 방법:**
1. [카카오 개발자 콘솔](https://developers.kakao.com) 로그인
2. 애플리케이션 선택 → **앱 키** 메뉴
3. `JavaScript 키` 복사

#### 7.2 네이버 로그인

```env
# 네이버 클라이언트 ID (공개)
NEXT_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id

# 네이버 클라이언트 시크릿 (서버 전용)
NAVER_CLIENT_SECRET=your_naver_client_secret
```

**설정 방법:**
1. [네이버 개발자 센터](https://developers.naver.com) 로그인
2. 애플리케이션 선택 → **API 설정** 메뉴
3. `Client ID`와 `Client Secret` 복사

---

### 8. Google Analytics (선택)

사용자 분석을 위한 설정입니다.

```env
# Google Analytics Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**설정 방법:**
1. [Google Analytics](https://analytics.google.com) 로그인
2. 관리 → 속성 설정 → 측정 ID 복사
3. 형식: `G-XXXXXXXXXX`

---

## 🔧 환경별 설정 가이드

### 로컬 개발 환경 (`.env.local`)

```env
# PayApp
PAYAPP_USERID=your_payapp_userid
PAYAPP_LINKKEY=your_payapp_linkkey

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxxxxxxxxx

# API 서버
NEXT_PUBLIC_AI_API_BASE_URL=http://140.245.70.80:8083
NEXT_PUBLIC_WEB_API_BASE_URL=http://140.245.70.80:8082

# 내부 API 보안
X_INTERNAL_SECRET=your_internal_secret_key

# Base URL (로컬은 선택적)
# NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 소셜 로그인
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_js_key
NEXT_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# Google Analytics (선택)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Vercel 배포 환경

Vercel 대시보드에서 환경 변수를 설정합니다:

1. **프로젝트 선택** → **Settings** → **Environment Variables**
2. 각 환경 변수를 추가:
   - **Production**: 프로덕션 배포용
   - **Preview**: 프리뷰 배포용
   - **Development**: 개발 브랜치용

**중요:**
- `NEXT_PUBLIC_*` 접두사가 있는 변수는 클라이언트에서도 접근 가능하므로 민감한 정보는 포함하지 마세요
- `PAYAPP_LINKKEY`, `X_INTERNAL_SECRET`, `NAVER_CLIENT_SECRET` 등은 서버 전용이므로 안전합니다

---

## ✅ 환경 변수 체크리스트

배포 전 확인사항:

- [ ] `PAYAPP_USERID` 설정됨
- [ ] `PAYAPP_LINKKEY` 설정됨
- [ ] `BLOB_READ_WRITE_TOKEN` 설정됨 (Vercel Blob 스토어 생성됨)
- [ ] `NEXT_PUBLIC_AI_API_BASE_URL` 설정됨 (또는 기본값 사용)
- [ ] `NEXT_PUBLIC_WEB_API_BASE_URL` 설정됨 (또는 기본값 사용)
- [ ] `X_INTERNAL_SECRET` 설정됨 (백엔드와 동일한 값)
- [ ] `NEXT_PUBLIC_BASE_URL` 설정됨 (Vercel 배포 시 필수)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정됨
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정됨
- [ ] 소셜 로그인 사용 시 해당 키들 설정됨
- [ ] Google Analytics 사용 시 Measurement ID 설정됨

---

## 🚨 보안 주의사항

1. **절대 Git에 커밋하지 마세요**
   - `.env.local`, `.env` 파일은 `.gitignore`에 포함되어 있습니다
   - 환경 변수는 Vercel 대시보드나 CI/CD 시스템에서 관리하세요

2. **민감한 정보 보호**
   - `PAYAPP_LINKKEY`, `X_INTERNAL_SECRET`, `NAVER_CLIENT_SECRET` 등은 외부에 노출되지 않도록 주의
   - `NEXT_PUBLIC_*` 접두사가 없는 변수는 서버에서만 접근 가능합니다

3. **환경별 분리**
   - 개발/스테이징/프로덕션 환경별로 다른 값을 사용하세요
   - Vercel에서는 환경별로 변수를 분리할 수 있습니다

---

## 📚 참고 문서

- [PayApp 개발자 센터](https://www.payapp.kr/dev_center/dev_center01.html)
- [Vercel Blob 문서](https://vercel.com/docs/storage/vercel-blob)
- [Next.js 환경 변수](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase 문서](https://supabase.com/docs)
