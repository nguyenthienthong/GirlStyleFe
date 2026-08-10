'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function AddToCartSuccessModal() {
  const { isAddToCartSuccessOpen, setIsAddToCartSuccessOpen } = useShop();

  return (
    <AnimatePresence>
      {isAddToCartSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsAddToCartSuccessOpen(false)}
          />

          {/* Modal Box Scale & Pop Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm sm:max-w-md bg-white rounded-2xl p-8 sm:p-12 shadow-2xl text-center space-y-6 border border-stone-200 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Right Close Button */}
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsAddToCartSuccessOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-full hover:bg-stone-100"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Center Shopping Bag with Checkmark Icon */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="mx-auto w-28 h-28 relative flex items-center justify-center"
            >
              <svg
                className="w-24 h-24 text-stone-900"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Shopping Bag handles & body */}
                <path d="M30 35 C30 20, 70 20, 70 35" />
                <path d="M20 35 L80 35 L85 90 L15 90 Z" />
                {/* Checkmark inside bag */}
                <path d="M38 60 L47 70 L64 50" strokeWidth="4" stroke="currentColor" />
              </svg>
            </motion.div>

            {/* Success Message Text */}
            <motion.h3
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm sm:text-base font-extrabold text-stone-900 uppercase tracking-wide"
            >
              THÊM VÀO GIỎ HÀNG THÀNH CÔNG !
            </motion.h3>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
