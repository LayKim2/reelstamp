// Settings 모달 컴포넌트: 계정 설정 팝업
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, User, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { getSubscriptionStatusAction, deleteAccountAction } from '@/app/actions/auth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubscriptionData {
  status: string;
  active: boolean;
  currentPeriodStart: string;
  nextBillingDate: string;
  validUntil: string;
  canceledAt?: string;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isFreePlan, setIsFreePlan] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 구독 상태 조회
  useEffect(() => {
    if (isOpen && user) {
      setIsLoadingSubscription(true);
      getSubscriptionStatusAction()
        .then((result) => {
          if (result.success && result.data) {
            setSubscriptionData(result.data);
            setIsFreePlan(!result.data.active);
          } else {
            // API 호출 실패 시 기본값 유지
            setIsFreePlan(true);
          }
        })
        .catch(() => {
          setIsFreePlan(true);
        })
        .finally(() => {
          setIsLoadingSubscription(false);
        });
    }
  }, [isOpen, user]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAccountAction();
      
      if (result.success) {
        // 계정 삭제 성공 시 팝업 닫기
        setShowDeleteConfirm(false);
        onClose();
        // 로그아웃 처리 및 홈으로 리다이렉트
        await logout();
        router.push('/');
      } else {
        // 에러 메시지 표시
        alert(result.message || '계정 삭제 중 오류가 발생했습니다.');
        setIsDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('계정 삭제 실패:', error);
      alert('계정 삭제 중 오류가 발생했습니다.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}년 ${month}월 ${day}일`;
    } catch {
      return dateString;
    }
  };

  const planBenefits = [
    { icon: Sparkles, text: 'AI 대본 생성 무제한' },
  ];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Settings 모달 */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col pointer-events-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* 모바일: 세로 레이아웃, PC: 가로 레이아웃 */}
              <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-hidden">
                {/* 왼쪽 메뉴 */}
                <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col flex-shrink-0">
                  {/* 닫기 버튼 */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 md:hidden">Settings</h2>
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                      aria-label="닫기"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 메뉴 항목 */}
                  <nav className="flex md:flex-col flex-row overflow-x-auto md:overflow-x-visible p-2 md:flex-1">
                    <button
                      className="w-full md:w-auto px-4 py-3 flex items-center gap-3 text-left text-gray-900 bg-white rounded-lg shadow-sm border border-gray-200 whitespace-nowrap"
                    >
                      <User className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <span className="text-base font-medium">Account</span>
                    </button>
                  </nav>
                </div>

                {/* 오른쪽 콘텐츠 */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
                    {/* Account 헤더 */}
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Account</h1>

                    {/* 플랜 정보 */}
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                          {isFreePlan ? 'Free Plan' : 'Reelstamp Plus'}
                        </h2>
                        <div className="relative">
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                            Manage
                            <span className="text-xs">▼</span>
                          </button>
                        </div>
                      </div>

                      {isFreePlan ? (
                        <>
                          <p className="text-gray-600 mb-6">
                            현재 무료 플랜을 사용 중입니다.
                          </p>
                          <div className="bg-gradient-to-r from-[#EB48B1]/10 to-[#F59A39]/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                              Reelstamp Plus로 업그레이드하세요!
                            </h3>
                            <ul className="space-y-2 sm:space-y-3">
                              {planBenefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#EB48B1] flex-shrink-0 mt-0.5" />
                                  <span className="text-sm sm:text-base text-gray-700">{benefit.text}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      ) : (
                        <>
                          {isLoadingSubscription ? (
                            <p className="text-gray-600 mb-6">구독 정보를 불러오는 중...</p>
                          ) : subscriptionData ? (
                            <p className="text-gray-600 mb-2">
                              {subscriptionData.validUntil
                                ? `${formatDate(subscriptionData.validUntil)}까지 유효합니다.`
                                : 'Reelstamp Plus를 사용 중입니다.'}
                            </p>
                          ) : (
                            <p className="text-gray-600 mb-2">Reelstamp Plus를 사용 중입니다.</p>
                          )}
                          <div className="bg-gradient-to-r from-[#EB48B1]/10 to-[#F59A39]/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                              Thanks for subscribing to Reelstamp Plus!
                            </h3>
                            <ul className="space-y-2 sm:space-y-3">
                              {planBenefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#EB48B1] flex-shrink-0 mt-0.5" />
                                  <span className="text-sm sm:text-base text-gray-700">{benefit.text}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Delete Account 섹션 */}
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                            Delete account
                          </h2>
                        </div>
                        {!showDeleteConfirm ? (
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-3 sm:px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 sm:gap-2 flex-shrink-0"
                            style={{ backgroundColor: '#8B2635' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#6B1A25';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#8B2635';
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={handleDeleteAccount}
                              disabled={isDeleting}
                              className="px-3 sm:px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ backgroundColor: '#8B2635' }}
                              onMouseEnter={(e) => {
                                if (!isDeleting) {
                                  e.currentTarget.style.backgroundColor = '#6B1A25';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isDeleting) {
                                  e.currentTarget.style.backgroundColor = '#8B2635';
                                }
                              }}
                            >
                              {isDeleting ? '처리 중...' : '확인'}
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setIsDeleting(false);
                              }}
                              disabled={isDeleting}
                              className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              취소
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

