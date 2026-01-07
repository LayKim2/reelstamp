// Pricing 페이지: Free, Basic, Pro, Master 플랜 비교 및 업그레이드
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { getSubscriptionStatusAction } from '@/app/actions/auth';
import { freePlanFeatures, basicPlanFeatures, proPlanFeatures, masterPlanFeatures, freePlanEventBenefit, basicPlanEventBenefit } from '@/app/lib/constants/plans';
import PlanCard from '@/app/components/ui/PlanCard';

interface SubscriptionData {
  status: string;
  active: boolean;
  currentPeriodStart: string;
  nextBillingDate: string;
  validUntil: string;
  canceledAt?: string;
}

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFreePlan, setIsFreePlan] = useState(true);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  useEffect(() => {
    // 로그인되어 있을 때만 구독 상태 조회
    if (!isAuthenticated) {
      setIsLoading(false);
      setIsFreePlan(true); // 로그인 안 되어 있으면 기본값
      return;
    }

    // 구독 상태 조회
    setIsLoading(true);
    getSubscriptionStatusAction()
      .then((result) => {
        if (result.success && result.data) {
          setSubscriptionData(result.data);
          setIsFreePlan(!result.data.active);
        } else {
          setIsFreePlan(true);
        }
      })
      .catch(() => {
        setIsFreePlan(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isAuthenticated]);

  // 결제 요청 처리 함수
  const handlePayment = async (planId: string, planName: string, price: number) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isPaymentProcessing) return;

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
          price,
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* 플랜 카드 컨테이너 */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:gap-8">
          {/* Free 플랜 카드 */}
          <PlanCard
            planName="Free"
            price="₩0"
            features={freePlanFeatures}
            eventBenefit={freePlanEventBenefit}
            buttonType="button"
            buttonText={isAuthenticated && !isLoading && isFreePlan ? '현재 플랜' : '무료 플랜 시작하기'}
            buttonOnClick={() => {
              if (!isAuthenticated) {
                router.push('/login');
                return;
              }
              // Free 플랜 시작 로직 (추후 구현)
            }}
            isCurrentPlan={isAuthenticated && !isLoading && isFreePlan}
            buttonClassName="bg-gray-700 text-white hover:bg-gray-800"
          />

          {/* Basic 플랜 카드 */}
          <PlanCard
            planName="Basic"
            price="₩4,900"
            discountInfo={{
              percentage: '75%',
              originalPrice: '19,900원',
            }}
            features={basicPlanFeatures}
            eventBenefit={basicPlanEventBenefit}
            buttonType="button"
            buttonText={isAuthenticated && !isLoading && !isFreePlan && subscriptionData?.active ? '현재 플랜' : '구독하기'}
            buttonOnClick={() => handlePayment('basic', 'Basic', 4900)}
            isCurrentPlan={isAuthenticated && !isLoading && !isFreePlan && subscriptionData?.active}
            buttonClassName="bg-[#FF496D] text-white hover:bg-[#E63E62]"
            buttonDisabled={isPaymentProcessing}
          />

          {/* Pro 플랜 카드 */}
          <PlanCard
            planName="Pro"
            price="₩9,900"
            discountInfo={{
              percentage: '80%',
              originalPrice: '49,900원',
            }}
            features={proPlanFeatures}
            isPopular={true}
            buttonType="button"
            buttonText={isAuthenticated && !isLoading && subscriptionData?.active ? '현재 플랜' : '구독하기'}
            buttonOnClick={() => handlePayment('pro', 'Pro', 9900)}
            isCurrentPlan={isAuthenticated && !isLoading && subscriptionData?.active}
            buttonClassName="bg-[#FF496D] text-white hover:bg-[#E63E62]"
            buttonDisabled={isPaymentProcessing}
          />

          {/* Master 플랜 카드 */}
          <PlanCard
            planName="Master"
            price="₩49,900"
            discountInfo={{
              percentage: '75%',
              originalPrice: '199,900원',
            }}
            features={masterPlanFeatures}
            buttonType="button"
            buttonText={isAuthenticated && !isLoading && subscriptionData?.active ? '현재 플랜' : '구독하기'}
            buttonOnClick={() => handlePayment('master', 'Master', 49900)}
            isCurrentPlan={isAuthenticated && !isLoading && subscriptionData?.active}
            buttonClassName="bg-[#FF496D] text-white hover:bg-[#E63E62]"
            buttonDisabled={isPaymentProcessing}
          />
        </div>
      </div>
    </div>
  );
}

