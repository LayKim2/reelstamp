'use client';

import React from 'react';
import PlanCard from '@/app/components/ui/PlanCard';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { freePlanFeatures, basicPlanFeatures, proPlanFeatures, masterPlanFeatures, freePlanEventBenefit, basicPlanEventBenefit } from '@/app/lib/constants/plans';

/**
 * 플랜 섹션: 서비스 요금제와 혜택을 보여줍니다.
 */
export default function PricingSection() {
  const { isAuthenticated, subscription, isLoadingSubscription } = useAuth();

  // 현재 구독 중인 플랜 확인
  const currentPlanCode = subscription?.subscriptionPlan?.plan || 'free';
  const isActive = subscription?.subscription?.active || false;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xl sm:text-2xl text-gray-600 mb-3">성장을 위한 가장 확실한 투자</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            <span className="text-[#FF496D]">오픈 특가!</span> 조회수가 터지는 습관, 릴스탬프 플랜
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:gap-8">
          <PlanCard
            planName="Free" price="₩0" features={freePlanFeatures}
            eventBenefit={freePlanEventBenefit} buttonType="link" 
            buttonText="무료 플랜 시작하기"
            buttonHref={isAuthenticated ? '/contents/script-creation' : '/login'} 
            hideButton={false}
            buttonClassName="bg-gray-700 text-white hover:bg-gray-800"
          />
          <PlanCard
            planName="Basic" price="₩4,900" features={basicPlanFeatures}
            discountInfo={{ percentage: '75%', originalPrice: '19,900원' }}
            eventBenefit={basicPlanEventBenefit} buttonType="button" 
            buttonText="준비 중"
            buttonDisabled={true}
            isCurrentPlan={isAuthenticated && !isLoadingSubscription && currentPlanCode === 'basic' && isActive}
            buttonClassName="bg-gray-400 text-white cursor-not-allowed"
          />
          <PlanCard
            planName="Pro" price="₩9,900" features={proPlanFeatures}
            discountInfo={{ percentage: '80%', originalPrice: '49,900원' }}
            isPopular buttonType="button" 
            buttonText="준비 중"
            buttonDisabled={true}
            isCurrentPlan={isAuthenticated && !isLoadingSubscription && currentPlanCode === 'pro' && isActive}
            buttonClassName="bg-gray-400 text-white cursor-not-allowed"
          />
          <PlanCard
            planName="Master" price="₩49,900" features={masterPlanFeatures}
            discountInfo={{ percentage: '75%', originalPrice: '199,900원' }}
            buttonType="button" 
            buttonText="준비 중"
            buttonDisabled={true}
            isCurrentPlan={isAuthenticated && !isLoadingSubscription && currentPlanCode === 'master' && isActive}
            buttonClassName="bg-gray-400 text-white cursor-not-allowed"
          />
        </div>
      </div>
    </section>
  );
}
