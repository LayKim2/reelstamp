// 플랜 카드 공통 컴포넌트
'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

interface PlanFeature {
  main?: string;
  subItems?: string[];
}

interface EventBenefit {
  title: string;
  mainItem: string;
  subItems: string[];
}

interface PlanCardProps {
  planName: string;
  price: string;
  discountInfo?: {
    percentage: string;
    originalPrice: string;
  };
  features: (string | PlanFeature)[];
  eventBenefit?: EventBenefit;
  isPopular?: boolean;
  buttonType: 'link' | 'button';
  buttonText: string;
  buttonHref?: string;
  buttonOnClick?: () => void;
  isCurrentPlan?: boolean;
  buttonDisabled?: boolean;
  hideButton?: boolean;
  buttonClassName?: string;
}

export default function PlanCard({
  planName,
  price,
  discountInfo,
  features,
  eventBenefit,
  isPopular = false,
  buttonType,
  buttonText,
  buttonHref,
  buttonOnClick,
  isCurrentPlan = false,
  buttonDisabled = false,
  hideButton = false,
  buttonClassName = '',
}: PlanCardProps) {
  return (
    <div 
      className={`flex flex-col justify-between items-start p-[25px] w-full lg:w-[326px] lg:min-h-[553px] rounded-[20px] transition-all ${
        isCurrentPlan ? 'border-4 border-[#FF496D] shadow-lg scale-[1.02]' : 'border border-transparent'
      }`}
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%), #F7F7FA',
      }}
    >
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          {isPopular && (
            <div 
              className="flex flex-row justify-center items-center px-2 py-0.5 gap-2 w-[82px] h-8 rounded"
              style={{
                background: 'rgba(255, 73, 109, 0.1)',
              }}
            >
              <span className="text-sm font-bold text-[#FF496D]">가장 인기</span>
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-900">{planName}</h2>
        </div>
        
        <div className="mb-6">
          {discountInfo && (
            <div className="text-base text-gray-500 mb-2">
              <span className="text-[#FF496D] font-bold">{discountInfo.percentage}</span> 월 <span className="line-through">{discountInfo.originalPrice}</span>
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
            <span className="text-sm text-gray-600">/ 월</span>
          </div>
        </div>

        {/* 기능 리스트 */}
        <div className="space-y-2 mb-6">
          {features.map((feature, index) => {
            // 객체 형태인 경우 (영상 분석 무제한)
            if (typeof feature === 'object' && 'main' in feature) {
              return (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF496D] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-base text-gray-700 leading-relaxed mb-1">{feature.main}</div>
                    <div className="pl-0 space-y-0.5">
                      {feature.subItems?.map((subItem, subIndex) => (
                        <div key={subIndex} className="text-base text-gray-700 leading-relaxed flex items-start gap-1">
                          <span className="text-[#FF496D] mr-1">•</span>
                          <span>{subItem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            // 일반 문자열인 경우
            return (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#FF496D] flex-shrink-0 mt-0.5" />
                <span className="text-base text-gray-700 leading-relaxed">{feature as string}</span>
              </div>
            );
          })}
        </div>

        {/* 오픈 이벤트 혜택 */}
        {eventBenefit && (
          <div className="mb-6">
            <div className="text-base font-bold text-[#FF496D] mb-2 text-center">{eventBenefit.title}</div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#FF496D] flex-shrink-0 mt-0.5" />
                <span className="text-base text-gray-700 leading-relaxed">{eventBenefit.mainItem}</span>
              </div>
              <div className="pl-7 space-y-0.5">
                <div className="text-base text-gray-700 flex items-start gap-1">
                  <span className="text-[#FF496D] mr-1">•</span>
                  <span>{eventBenefit.subItems[0]}</span>
                </div>
                <div className="text-base text-gray-700 flex items-start gap-1">
                  <span className="text-[#FF496D] mr-1">•</span>
                  <span>{eventBenefit.subItems[1]}</span>
                </div>
                <div className="text-base text-gray-700 pl-6">
                  {eventBenefit.subItems[2]}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 버튼 */}
      {!hideButton && (
        buttonType === 'link' && buttonHref && !isCurrentPlan ? (
          <Link
            href={buttonHref}
            className={`w-full py-3 px-4 rounded-xl font-bold transition-colors text-center ${buttonClassName}`}
          >
            {buttonText}
          </Link>
        ) : (
          <button
            onClick={buttonOnClick}
            disabled={buttonDisabled || isCurrentPlan}
            className={`w-full py-3 px-4 rounded-xl font-bold transition-colors ${
              buttonDisabled || isCurrentPlan
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : buttonClassName
            }`}
          >
            {buttonText}
          </button>
        )
      )}
    </div>
  );
}

