'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Trash2, Truck, Sparkles, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CartDrawer() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, totalCartCount, totalCartPrice, isCartDrawerOpen, setIsCartDrawerOpen, user } = useShop();

  const freeShipThreshold = 400000;
  const progressPercent = Math.min(100, Math.round((totalCartPrice / freeShipThreshold) * 100));
  const amountToFreeShip = Math.max(0, freeShipThreshold - totalCartPrice);

  const handleGoToCart = () => {
    setIsCartDrawerOpen(false);
    router.push('/cart');
  };

  const handleGoToCheckout = () => {
    setIsCartDrawerOpen(false);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          
          {/* 1. Backdrop overlay with backdrop blur & fade animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartDrawerOpen(false)}
          />

          {/* 2. Drawer Panel Slide-in Animation */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200"
            >
              
              {/* Header with Title & Close button */}
              <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">Giỏ hàng</h2>
                  <motion.span
                    key={totalCartCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center shadow-xs"
                  >
                    {totalCartCount}
                  </motion.span>
                </div>

                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Freeship Progress Bar */}
              {cart.length > 0 && (
                <div className="px-5 py-3 bg-[#f7f3ee] border-b border-stone-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-800">
                    <span className="flex items-center gap-1.5 text-[#C21A27]">
                      <Truck className="w-3.5 h-3.5" />
                      {amountToFreeShip === 0 ? '🎉 Nàng đã đạt Freeship toàn quốc!' : `Thêm ${amountToFreeShip.toLocaleString('vi-VN')}đ để FREESHIP`}
                    </span>
                    <span className="text-stone-500 font-extrabold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-[#C21A27] rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Cart Item List with Staggered Fade */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-stone-100">
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-20 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-stone-600">Giỏ hàng của bạn đang trống</p>
                    <button
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="px-6 py-3 bg-stone-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all"
                    >
                      Tiếp tục mua sắm
                    </button>
                  </motion.div>
                ) : (
                  cart.map((item, idx) => (
                    <motion.div
                      key={`${item.productId}-${item.color}-${item.size}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05, duration: 0.2 }}
                      className="pt-4 first:pt-0 flex items-start gap-4 group"
                    >
                      <div className="overflow-hidden rounded-lg border border-stone-200 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <h3 className="text-xs font-extrabold text-stone-900 line-clamp-2 leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-stone-500 font-medium">
                          Màu sắc: <span className="text-stone-800 font-bold">{item.color}</span> &nbsp;|&nbsp; Size: <span className="text-stone-800 font-bold">{item.size}</span>
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border border-stone-300 rounded-md bg-stone-50 text-xs">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(idx, item.quantity - 1)}
                              className="px-2.5 py-0.5 text-stone-600 hover:bg-stone-200 font-bold"
                            >
                              -
                            </motion.button>
                            <span className="px-3 py-0.5 font-extrabold text-stone-900">{item.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(idx, item.quantity + 1)}
                              className="px-2.5 py-0.5 text-stone-600 hover:bg-stone-200 font-bold"
                            >
                              +
                            </motion.button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-[#C21A27]">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                            </span>
                            
                            <motion.button
                              whileHover={{ scale: 1.15, color: '#dc2626' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(idx)}
                              className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Bottom Panel with Smooth Action Buttons */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-stone-200 bg-white space-y-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between text-xs text-stone-600 font-semibold">
                    <span className="flex items-center gap-1 text-stone-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cam kết hàng chính hãng
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span>Tổng cộng:</span>
                      <span className="text-lg font-black text-stone-900">
                        {totalCartPrice.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGoToCart}
                      className="w-full py-3.5 bg-stone-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>XEM GIỎ HÀNG</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGoToCheckout}
                      className="w-full py-3.5 bg-white hover:bg-stone-900 hover:text-white text-stone-900 border border-stone-900 font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all"
                    >
                      {user ? 'THANH TOÁN ĐƠN HÀNG' : 'THANH TOÁN NGAY'}
                    </motion.button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
