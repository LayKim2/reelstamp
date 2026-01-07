'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // 3초 후 메인 페이지 또는 대시보드로 이동
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h1>
        <p className="text-gray-600 mb-8">
          구독이 성공적으로 시작되었습니다.<br />
          잠시 후 메인 페이지로 이동합니다.
        </p>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-[#FF496D] text-white py-3 rounded-lg font-semibold hover:bg-[#E63E62] transition-colors"
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
}

