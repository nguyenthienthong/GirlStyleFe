'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, ArrowLeft, Info, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, totalCartPrice, totalCartCount, appliedVoucher } = useShop();

  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const finalPrice = Math.max(0, totalCartPrice - discountAmount);

  // Calculate gross total before any sale discount for realistic display
  const grossOriginalPrice = cart.reduce((sum, item) => sum + (item.price * 2) * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-stone-500 font-medium">Hãy chọn cho mình những sản phẩm thời trang và đầm lụa yêu thích nhất nhé!</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
        >
          ← Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* 1. TOP STEPPER PROCESS BAR (Quy trình 4 bước) */}
      <div className="relative py-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto relative z-10">
          
          {/* Step 1: Giỏ hàng (Active) */}
          <div className="flex flex-col items-center gap-1.5 cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <span className="text-xs font-bold text-black">Giỏ hàng</span>
          </div>

          {/* Line 1-2 */}
          <div className="flex-1 h-0.5 bg-stone-200 mx-4"></div>

          {/* Step 2: Đặt hàng */}
          <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => router.push('/checkout')}>
            <div className="w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center"></div>
            <span className="text-xs font-semibold text-stone-400">Đặt hàng</span>
          </div>

          {/* Line 2-3 */}
          <div className="flex-1 h-0.5 bg-stone-200 mx-4"></div>

          {/* Step 3: Thanh toán */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center"></div>
            <span className="text-xs font-semibold text-stone-400">Thanh toán</span>
          </div>

          {/* Line 3-4 */}
          <div className="flex-1 h-0.5 bg-stone-200 mx-4"></div>

          {/* Step 4: Hoàn thành đơn */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center"></div>
            <span className="text-xs font-semibold text-stone-400">Hoàn thành đơn</span>
          </div>

        </div>
      </div>

      {/* 2. HEADING TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">
          Giỏ hàng của bạn <span className="text-[#C21A27]">{totalCartCount} Sản Phẩm</span>
        </h1>
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CART ITEMS TABLE */}
        <div className="lg:col-span-8 space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-[11px] font-bold text-stone-400 uppercase border-b border-stone-200 pb-3">
                  <th className="pb-3 w-5/12 font-bold">TÊN SẢN PHẨM</th>
                  <th className="pb-3 text-center font-bold">CHIẾT KHẤU</th>
                  <th className="pb-3 text-center font-bold">SỐ LƯỢNG</th>
                  <th className="pb-3 text-right font-bold">TỔNG TIỀN</th>
                  <th className="pb-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {cart.map((item, idx) => (
                  <tr key={idx} className="align-middle">
                    
                    {/* Tên sản phẩm */}
                    <td className="py-6 pr-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-24 object-cover rounded-md border border-stone-200 shrink-0"
                        />
                        <div className="space-y-1">
                          <h3 className="text-xs font-semibold text-stone-800 leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-stone-400 font-medium">
                            Màu sắc: <span className="text-stone-700 font-semibold">{item.color}</span> &nbsp;&nbsp; Size: <span className="text-stone-700 font-semibold">{item.size}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Chiết khấu */}
                    <td className="py-6 px-2 text-center align-middle">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#C21A27]">
                          -{(item.price).toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-[10px] font-bold text-[#C21A27]">
                          (-50%)
                        </p>
                      </div>
                    </td>

                    {/* Số lượng */}
                    <td className="py-6 px-2 text-center align-middle">
                      <div className="inline-flex items-center border border-stone-300 rounded-md bg-stone-50 text-xs">
                        <button
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold text-stone-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Tổng tiền */}
                    <td className="py-6 pl-2 text-right align-middle">
                      <span className="text-sm font-bold text-stone-900">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </td>

                    {/* Nút xóa */}
                    <td className="py-6 text-right align-middle">
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Button Tiếp tục mua sắm */}
          <div className="pt-4 border-t border-stone-100">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded border border-stone-800 text-xs font-bold text-stone-900 hover:bg-black hover:text-white transition-all"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: CART SUMMARY BOX */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-stone-50/70 p-6 rounded-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Tổng tiền giỏ hàng</h3>

            <div className="space-y-2.5 text-xs text-stone-600 font-medium">
              <div className="flex justify-between">
                <span>Tổng sản phẩm</span>
                <span className="font-semibold text-stone-900">{totalCartCount}</span>
              </div>

              <div className="flex justify-between">
                <span>Tổng tiền hàng</span>
                <span className="font-semibold text-stone-900">
                  {grossOriginalPrice > 0 ? grossOriginalPrice.toLocaleString('vi-VN') : (totalCartPrice * 2).toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div className="flex justify-between">
                <span>Thành tiền</span>
                <span className="font-bold text-stone-900">{totalCartPrice.toLocaleString('vi-VN')}đ</span>
              </div>

              <div className="flex justify-between border-t border-stone-200 pt-2.5">
                <span>Tạm tính</span>
                <span className="font-bold text-stone-900">{finalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* Policy notice (Red alert box from screenshot) */}
            <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl flex items-start gap-2 text-[11px] text-[#C21A27] font-semibold leading-snug">
              <Info className="w-4 h-4 text-[#C21A27] shrink-0 mt-0.5" />
              <span>
                Sản phẩm SALE trên 50% không hỗ trợ ĐỔI TRẢ. Không thanh toán cho Shipper khi chưa nhận được hàng !
              </span>
            </div>

            {/* Main CTA Button: ĐẶT HÀNG */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3.5 bg-stone-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow transition-all"
            >
              ĐẶT HÀNG
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
