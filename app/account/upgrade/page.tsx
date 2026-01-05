// Upgrade plan 페이지: Free와 Plus 플랜 비교 및 업그레이드
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, MessageSquare, Image as ImageIcon, Brain, UserCog, Network, Video, Code, Beaker } from 'lucide-react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { getSubscriptionStatusAction } from '@/app/actions/auth';

interface SubscriptionData {
  status: string;
  active: boolean;
  currentPeriodStart: string;
  nextBillingDate: string;
  validUntil: string;
  canceledAt?: string;
}

interface PlanFeature {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

const freePlanFeatures: PlanFeature[] = [
  { icon: Sparkles, text: '기본 대본 생성 기능' },
  { icon: MessageSquare, text: '제한된 대화 세션' },
  { icon: ImageIcon, text: '기본 이미지 생성' },
];

const plusPlanFeatures: PlanFeature[] = [
  { icon: Sparkles, text: '복잡한 문제 해결' },
  { icon: MessageSquare, text: '여러 세션에 걸친 긴 대화' },
  { icon: ImageIcon, text: '더 많은 이미지, 더 빠른 생성' },
  { icon: Brain, text: '목표 및 과거 대화 기억' },
  { icon: UserCog, text: '에이전트 모드로 여행 및 작업 계획' },
  { icon: Network, text: '프로젝트 구성 및 커스텀 GPT' },
  { icon: Video, text: 'Sora로 비디오 제작 및 공유' },
  { icon: Code, text: 'Codex로 코드 작성 및 앱 구축' },
];

export default function UpgradePlanPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFreePlan, setIsFreePlan] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
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
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* 페이지 타이틀 */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16 text-gray-900">
          Upgrade your plan
        </h1>

        {/* 플랜 카드 컨테이너 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Free 플랜 카드 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Free</h2>
              <div className="mb-4">
                <div className="text-4xl sm:text-5xl font-bold text-gray-900">$0</div>
                <div className="text-sm sm:text-base text-gray-500 mt-2">USD / month</div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">기본 기능 제공</p>
            </div>

            {/* 현재 플랜 표시 */}
            {isFreePlan && !isLoading && (
              <button
                disabled
                className="w-full py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-medium mb-6 cursor-not-allowed opacity-60"
              >
                Your current plan
              </button>
            )}

            {/* 기능 리스트 */}
            <div className="flex-1 space-y-4 mb-6">
              {freePlanFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* 푸터 링크 */}
            <div className="mt-auto pt-6 border-t border-gray-200">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors block mb-2"
              >
                Limits apply
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                I need help with a billing issue
              </a>
            </div>
          </div>

          {/* Plus 플랜 카드 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col relative">
            {/* 프로모션 배지 (선택사항) */}
            {subscriptionData?.active && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#EB48B1] to-[#F59A39] text-white text-xs font-bold px-3 py-1 rounded-full">
                Active
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Plus</h2>
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl line-through text-gray-400">$20</span>
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900">$0</span>
                </div>
                <div className="text-sm sm:text-base text-gray-500 mt-2">
                  USD promoCostDuration until Jan 5, 2026
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">More access to advanced intelligence</p>
            </div>

            {/* 현재 플랜 또는 업그레이드 버튼 */}
            {isLoading ? (
              <div className="w-full py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-medium mb-6 text-center">
                Loading...
              </div>
            ) : isFreePlan ? (
              <button
                onClick={() => {
                  // Plus 플랜 구매 로직 (추후 구현)
                  alert('Plus 플랜 구매 기능은 곧 출시됩니다.');
                }}
                className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-bold mb-6 hover:bg-gray-800 transition-colors"
              >
                Get Plus
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-medium mb-6 cursor-not-allowed opacity-60"
              >
                Your current plan
              </button>
            )}

            {/* 기능 리스트 */}
            <div className="flex-1 space-y-4 mb-6">
              {plusPlanFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* 푸터 링크 */}
            <div className="mt-auto pt-6 border-t border-gray-200">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors block mb-2"
              >
                Unlimited subject to abuse guardrails. Learn more
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                I need help with a billing issue
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

