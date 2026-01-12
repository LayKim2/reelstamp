# reelstamp

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 환경 변수 설정

프로젝트를 실행하기 전에 필요한 환경 변수를 설정해야 합니다.

#### Vercel Blob 설정

영상 업로드 기능을 사용하려면 Vercel Blob 토큰이 필요합니다:

1. **Vercel 대시보드에서 Blob 스토어 생성**
   - Vercel 대시보드 → 프로젝트 → Storage → Create Database → Blob 선택
   - Blob 스토어 생성 후 자동으로 `BLOB_READ_WRITE_TOKEN`이 생성됩니다

2. **로컬 개발 환경 변수 설정**
   ```bash
   # Vercel CLI를 사용하여 환경 변수 가져오기
   vercel env pull
   ```
   
   또는 `.env.local` 파일에 직접 추가:
   ```env
   BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxxxxxxxxx
   ```

3. **Vercel 배포 환경**
   - Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
   - `BLOB_READ_WRITE_TOKEN` 환경 변수가 자동으로 설정됩니다

### 개발 서버 실행

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
