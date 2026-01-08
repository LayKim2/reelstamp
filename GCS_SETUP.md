# Google Cloud Storage 설정 가이드

Google Cloud Storage를 사용하여 파일 업로드를 구현했습니다. 다음 단계를 따라 설정해주세요.

## 1. Google Cloud 프로젝트 생성 및 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 ID 확인 (예: `booquest-3964c`)

## 2. Cloud Storage API 활성화

1. Google Cloud Console에서 "API 및 서비스" → "라이브러리"로 이동
2. "Cloud Storage API" 검색 후 활성화

## 3. 버킷(Bucket) 생성

1. Google Cloud Console에서 "Cloud Storage" → "버킷"으로 이동
2. "버킷 만들기" 클릭
3. 버킷 설정:
   - **이름**: 고유한 이름 입력 (예: `booquest-reels-storage`)
   - **위치 유형**: 리전 선택
   - **리전**: `asia-northeast3` (서울) 또는 원하는 리전 선택
   - **스토리지 클래스**: `Standard` (자주 접근하는 경우) 또는 `Nearline` (비용 절감)
   - **액세스 제어**: `균일하게 적용` 선택
   - **공개 액세스 방지**: `공개 액세스 방지` 선택 (보안)
4. "만들기" 클릭

## 4. 서비스 계정 권한 설정

1. 버킷을 생성한 후, 버킷 이름 클릭
2. "권한" 탭으로 이동
3. "주요 추가" 클릭
4. 서비스 계정 이메일 입력: `id-reelstamp@booquest-3964c.iam.gserviceaccount.com`
5. 역할 선택: `Storage 객체 관리자` (Storage Object Admin)
6. "저장" 클릭

## 5. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# Google Cloud Storage 설정
GOOGLE_CLOUD_PROJECT_ID=booquest-3964c
GCS_BUCKET_NAME=booquest-reels-storage
```

**참고**: 
- `GOOGLE_CLOUD_PROJECT_ID`: Google Cloud 프로젝트 ID
- `GCS_BUCKET_NAME`: 생성한 버킷 이름

## 6. 기존 환경 변수 확인

다음 환경 변수들이 이미 설정되어 있어야 합니다:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=id-reelstamp@booquest-3964c.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_SPREADSHEET_ID=1spZ6Lsr6bUVMOV2wuWXKOpS__09sPwdh5pAAgUgrVbU
```

## 7. 테스트

환경 변수를 설정한 후 개발 서버를 재시작하고 폼 제출을 테스트해보세요:

```bash
npm run dev
```

## 파일 확인 방법

업로드된 파일은 다음 방법으로 확인할 수 있습니다:

1. **Google Cloud Console**:
   - Cloud Storage → 버킷 → 파일 목록 확인
   - 파일 클릭 → 다운로드 또는 URL 확인

2. **공개 URL** (선택사항):
   - 파일을 공개로 설정하면 `https://storage.googleapis.com/[버킷명]/[파일경로]` 형식의 URL 생성 가능
   - 현재는 서명된 URL(Signed URL)을 사용하여 보안적으로 파일에 접근

## 비용 정보

- **무료 티어**: 매월 5GB Standard Storage 무료
- **추가 비용**: 5GB 초과 시 약 $0.020/GB/월 (리전 스토리지)
- **네트워크 전송**: 다운로드 시 비용 발생 (업로드는 무료)

## 문제 해결

### 권한 에러 발생 시
- 서비스 계정이 버킷에 `Storage 객체 관리자` 역할로 추가되어 있는지 확인
- 서비스 계정 이메일이 정확한지 확인

### 버킷을 찾을 수 없다는 에러 발생 시
- 버킷 이름이 정확한지 확인
- 버킷이 생성된 리전이 올바른지 확인

### API 활성화 에러 발생 시
- Cloud Storage API가 활성화되어 있는지 확인
- 프로젝트 ID가 올바른지 확인

