# Google Analytics 4 (GA4) 설정 가이드

## 1. Google Analytics 계정 생성

1. [Google Analytics](https://analytics.google.com/)에 접속
2. 계정 생성 또는 기존 계정 선택
3. 속성(Property) 생성
4. 데이터 스트림 생성 (웹)
5. 측정 ID 확인 (예: `G-XXXXXXXXXX`)

## 2. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**참고**: 
- `NEXT_PUBLIC_` 접두사가 필요합니다 (클라이언트에서 접근 가능하도록)
- 측정 ID는 Google Analytics 대시보드에서 확인할 수 있습니다

## 3. Vercel 배포 시 환경 변수 설정

1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. `NEXT_PUBLIC_GA_MEASUREMENT_ID` 추가
3. 값에 측정 ID 입력 (예: `G-XXXXXXXXXX`)
4. 환경: Production, Preview, Development 모두 선택
5. 저장 후 재배포

## 4. 사용 방법

### 기본 페이지뷰 추적
자동으로 모든 페이지뷰가 추적됩니다.

### 커스텀 이벤트 추적
```typescript
import { trackEvent } from '@/app/lib/analytics';

// 버튼 클릭 이벤트
trackEvent('button_click', {
  button_name: '신청하기',
  page: '/event/reels-request'
});

// 전환 추적
trackEvent('form_submit', {
  form_name: '릴스 기획·대본 이벤트',
  value: 100
});
```

### 사용자 속성 설정
```typescript
import { setUserProperty } from '@/app/lib/analytics';

setUserProperty('user_type', 'premium');
```

## 5. 확인 방법

1. Google Analytics 대시보드 접속
2. 실시간 보고서에서 방문자 확인
3. 이벤트가 정상적으로 기록되는지 확인

## 6. 나중에 추가할 수 있는 기능

- PostHog, Mixpanel 등 다른 analytics 도구 추가
- 커스텀 이벤트 확장
- 전환 퍼널 분석
- 사용자 세그먼트 분석

