// 플랜 카드 래퍼: 결제 로직을 처리하는 클라이언트 컴포넌트
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlanCard from './PlanCard';

interface PricingPlanCardProps {
  planId: string;
  planName: string;
  price: string;
  priceNumber: number;
  discountInfo?: {
    percentage: string;
    originalPrice: string;
  };
  features: any[];
  eventBenefit?: any;
  isPopular?: boolean;
  isAuthenticated: boolean;
  isCurrentPlan: boolean;
  buttonText: string;
}

export default function PricingPlanCard({
  planId,
  planName,
  price,
  priceNumber,
  discountInfo,
  features,
  eventBenefit,
  isPopular = false,
  isAuthenticated,
  isCurrentPlan,
  buttonText,
}: PricingPlanCardProps) {
  const router = useRouter();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const handlePayment = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isPaymentProcessing || isCurrentPlan) return;

    try {
      setIsPaymentProcessing(true);
      
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          planName,
          price: priceNumber,
        }),
      });

      const data = await response.json();

      if (data.success && data.payurl) {
        // PayApp 결제 페이지로 이동
        window.location.href = data.payurl;
      } else {
        alert(data.message || '결제 요청 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('결제 시스템과 통신 중 오류가 발생했습니다.');
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return (
    <PlanCard
      planName={planName}
      price={price}
      discountInfo={discountInfo}
      features={features}
      eventBenefit={eventBenefit}
      isPopular={isPopular}
      buttonType="button"
      buttonText={isPaymentProcessing ? '처리 중...' : buttonText}
      buttonOnClick={handlePayment}
      isCurrentPlan={isCurrentPlan}
      buttonDisabled={isPaymentProcessing || isCurrentPlan}
      buttonClassName="bg-[#FF496D] text-white hover:bg-[#E63E62]"
    />
  );
}
