// Pricing 페이지: Free, Basic, Pro, Master 플랜 비교 및 업그레이드
// SSG를 위해 서버 컴포넌트로 구현되어 빌드 타임에 정적 HTML이 생성됩니다.

import { getCurrentUser } from '@/app/lib/api/auth';
import { getSubscriptionStatusAction } from '@/app/actions/auth';
import { freePlanFeatures, basicPlanFeatures, proPlanFeatures, masterPlanFeatures, freePlanEventBenefit, basicPlanEventBenefit } from '@/app/lib/constants/plans';
import PlanCard from '@/app/components/ui/PlanCard';
import PricingPlanCard from '@/app/components/ui/PricingPlanCard';
import Link from 'next/link';

export default async function PricingPage() {
  // 서버에서 인증 및 구독 정보 조회
  const user = await getCurrentUser();
  const isAuthenticated = !!user;
  
  let subscription = null;
  let isLoadingSubscription = false;
  
  if (isAuthenticated) {
    const subscriptionResult = await getSubscriptionStatusAction();
    if (subscriptionResult.success && subscriptionResult.data) {
      subscription = subscriptionResult.data;
    }
  }

  // 현재 구독 중인 플랜 코드 확인
  const currentPlanCode = subscription?.subscriptionPlan?.plan || 'free';
  const isActive = subscription?.subscription?.active || false;
  const isPaidSubscription = isAuthenticated && isActive && currentPlanCode !== 'free';

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
            buttonType="link"
            buttonText="무료 플랜 시작하기"
            buttonHref={isAuthenticated ? undefined : '/login'}
            hideButton={isAuthenticated}
            buttonClassName="bg-gray-700 text-white hover:bg-gray-800"
          />

          {/* Basic 플랜 카드 */}
          <PricingPlanCard
            planId="basic"
            planName="Basic"
            price="₩1,000"
            priceNumber={1000}
            discountInfo={{
              percentage: '75%',
              originalPrice: '19,900원',
            }}
            features={basicPlanFeatures}
            eventBenefit={basicPlanEventBenefit}
            isAuthenticated={isAuthenticated}
            isCurrentPlan={isAuthenticated && currentPlanCode === 'basic' && isActive}
            buttonText={
              isAuthenticated && currentPlanCode === 'basic' && isActive 
                ? '현재 플랜' 
                : isPaidSubscription 
                  ? '플랜 변경' 
                  : '구독하기'
            }
          />

          {/* Pro 플랜 카드 */}
          <PricingPlanCard
            planId="pro"
            planName="Pro"
            price="₩9,900"
            priceNumber={9900}
            discountInfo={{
              percentage: '80%',
              originalPrice: '49,900원',
            }}
            features={proPlanFeatures}
            isPopular={true}
            isAuthenticated={isAuthenticated}
            isCurrentPlan={isAuthenticated && currentPlanCode === 'pro' && isActive}
            buttonText={
              isAuthenticated && currentPlanCode === 'pro' && isActive 
                ? '현재 플랜' 
                : isPaidSubscription 
                  ? '플랜 변경' 
                  : '구독하기'
            }
          />

          {/* Master 플랜 카드 */}
          <PricingPlanCard
            planId="master"
            planName="Master"
            price="₩49,900"
            priceNumber={49900}
            discountInfo={{
              percentage: '75%',
              originalPrice: '199,900원',
            }}
            features={masterPlanFeatures}
            isAuthenticated={isAuthenticated}
            isCurrentPlan={isAuthenticated && currentPlanCode === 'master' && isActive}
            buttonText={
              isAuthenticated && currentPlanCode === 'master' && isActive 
                ? '현재 플랜' 
                : isPaidSubscription 
                  ? '플랜 변경' 
                  : '구독하기'
            }
          />
        </div>
      </div>
    </div>
  );
}

