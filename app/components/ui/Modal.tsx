// 범용 모달 컴포넌트: 제목과 내용을 파라미터로 받아 재사용 가능한 팝업 창
'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string | React.ReactNode;
  buttonText?: string;
  icon?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  buttonText = '확인',
  icon,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const modalContent = (
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
          
          {/* 모달 콘텐츠 */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative pointer-events-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 모달 내용 */}
              <div className="text-center">
                {/* 아이콘 영역 */}
                {icon && (
                  <div className="mx-auto mb-6 flex items-center justify-center">
                    {icon}
                  </div>
                )}

                {/* 제목 */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {title}
                </h3>

                {/* 설명 */}
                <div className="text-gray-600 mb-6 leading-relaxed">
                  {typeof description === 'string' ? (
                    <p>{description}</p>
                  ) : (
                    description
                  )}
                </div>

                {/* 확인 버튼 */}
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#EB48B1] to-[#F59A39] text-white font-semibold rounded-lg hover:from-[#D93D9F] hover:to-[#E6892F] transition-all shadow-md hover:shadow-lg"
                >
                  {buttonText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

