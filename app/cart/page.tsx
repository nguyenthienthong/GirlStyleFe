'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck, Truck, Sparkles, Check, Gift, Ticket, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { fetchApi } from '../../lib/api';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, totalCartPrice, appliedVoucher, setAppliedVoucher } = useShop();

  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [voucherMessage, setVoucherMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  const freeShipThreshold = 400000;
  const progressPercent = Math.min(100, Math.round((totalCartPrice / freeShipThreshold) * 100));
  const amountToFreeShip = Math.max(0, freeShipThreshold - totalCartPrice);

  useEffect(() => {
    fetchApi('/vouchers')
      .then((data) => {
        const active = (data.vouchers || []).filter((v: any) => v.active !== false);
        setAvailableVouchers(active);
      })
      .catch(console.error);
  }, []);

  const handleApplyVoucherCode = async (codeToApply: string) => {
    const code = codeToApply.trim().toUpperCase();
    if (!code) return;

    try {
      const res = await fetchApi('/vouchers/apply', {
        method: 'POST',
        body: JSON.stringify({ code, orderValue: totalCartPrice })
      });

      if (res.success && res.voucher) {
        setAppliedVoucher({
          code: res.voucher.code,
          discountAmount: res.voucher.discountAmount
        });
        setVoucherCodeInput(res.voucher.code);
        setVoucherMessage({
          text: `🎉 Đã áp dụng thành công mã ${res.voucher.code}: giảm ${res.voucher.discountAmount.toLocaleString('vi-VN')}đ`,
          success: true
        });
        setIsVoucherModalOpen(false);
      }
    } catch (error: any) {
      setVoucherMessage({ text: error.message || 'Mã giảm giá không hợp lệ', success: false });
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCodeInput('');
    setVoucherMessage({ text: 'Đã gỡ mã giảm giá.', success: false });
  };

  const discountVal = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const finalPrice = Math.max(0, totalCartPrice - discountVal);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-[#C21A27] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-black">Giỏ Hàng Của Bạn Đang Trống</h2>
        <p className="text-xs text-black/60 font-semibold">Hãy chọn cho mình những bộ cánh và đầm lụa xinh đẹp nhất ngay nhé!</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C21A27] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-[#a5131f] transition-all"
        >
          Khám phá sản phẩm ngay <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b-2 border-[#EDE8E2] pb-4">
        <h1 className="text-3xl font-black text-black tracking-tight">Giỏ Hàng Thông Minh</h1>
        <p className="text-xs text-black/60 font-semibold mt-1">
          Kiểm tra danh sách sản phẩm, chọn mã voucher ưu đãi và tiến hành chốt đơn
        </p>
      </div>

      {/* Free Shipping Progress Bar */}
      <div className="p-4 rounded-2xl bg-[#f5eee6] border-2 border-[#EDE8E2] space-y-2">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="flex items-center gap-1.5 text-[#C21A27]">
            <Truck className="w-4 h-4" />
            {amountToFreeShip === 0 ? '🎉 Nàng đã đủ điều kiện MIỄN PHÍ GIAO HÀNG TOÀN QUỐC!' : `Mua thêm ${amountToFreeShip.toLocaleString('vi-VN')}đ để nhận FREESHIP`}
          </span>
          <span className="text-black/60">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-[#EDE8E2] rounded-full overflow-hidden">
          <div className="h-full bg-[#C21A27] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-[#EDE8E2] shadow-md divide-y divide-[#EDE8E2] overflow-hidden">
            {cart.map((item, idx) => (
              <div key={idx} className="p-4 md:p-6 flex items-center justify-between gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover object-center rounded-2xl border border-[#EDE8E2] shrink-0"
                />

                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-black text-black line-clamp-1">{item.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-black/60 font-semibold">
                    <span>Màu: <strong className="text-black">{item.color}</strong></span>
                    <span>•</span>
                    <span>Size: <strong className="text-black">{item.size}</strong></span>
                  </div>
                  <div className="text-xs font-black text-[#C21A27]">
                    {item.price.toLocaleString('vi-VN')}đ
                  </div>
                </div>

                <div className="flex items-center border-2 border-[#EDE8E2] rounded-xl bg-[#fcfcfc]">
                  <button
                    onClick={() => updateQuantity(idx, item.quantity - 1)}
                    className="px-2.5 py-1 text-black font-black hover:bg-[#EDE8E2] text-xs"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-black text-black">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(idx, item.quantity + 1)}
                    className="px-2.5 py-1 text-black font-black hover:bg-[#EDE8E2] text-xs"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(idx)}
                  className="p-2 text-black/40 hover:text-[#C21A27] hover:bg-rose-50 rounded-xl transition-colors"
                  title="Xóa khỏi giỏ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Voucher Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-[#EDE8E2] shadow-md space-y-5">
            <h3 className="text-base font-black text-black border-b-2 border-[#EDE8E2] pb-3">Tóm Tắt Đơn Hàng</h3>

            {/* Voucher Apply Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-black flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#C21A27]" /> Mã Giảm Giá / Voucher
                </label>

                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(true)}
                  className="text-xs font-black text-[#C21A27] hover:underline flex items-center gap-1"
                >
                  <Ticket className="w-3.5 h-3.5" /> Chọn Mã Kho Ưu Đãi
                </button>
              </div>

              {appliedVoucher ? (
                <div className="p-3 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 font-black" />
                    <div>
                      <p className="text-xs font-black text-emerald-800 uppercase font-mono">{appliedVoucher.code}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">Giảm {appliedVoucher.discountAmount.toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveVoucher}
                    className="text-xs font-black text-rose-600 hover:underline px-2 py-1"
                  >
                    Gỡ mã
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="VD: GIRLSTYLE50K"
                    value={voucherCodeInput}
                    onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white border-2 border-[#EDE8E2] focus:outline-none uppercase font-bold text-black focus:border-[#C21A27]"
                  />
                  <button
                    onClick={() => handleApplyVoucherCode(voucherCodeInput)}
                    className="px-4 py-2.5 bg-[#C21A27] hover:bg-[#a5131f] text-white font-black text-xs uppercase rounded-xl transition-all shadow"
                  >
                    Áp Dụng
                  </button>
                </div>
              )}

              {voucherMessage && !appliedVoucher && (
                <p className={`text-[11px] font-bold ${voucherMessage.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {voucherMessage.text}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs font-bold text-black/70 border-t-2 border-[#EDE8E2] pt-3">
              <div className="flex justify-between">
                <span>Tạm tính giỏ hàng:</span>
                <span className="font-black text-black">{totalCartPrice.toLocaleString('vi-VN')}đ</span>
              </div>

              {appliedVoucher && (
                <div className="flex justify-between text-emerald-600 font-black">
                  <span>Giảm giá ({appliedVoucher.code}):</span>
                  <span>-{discountVal.toLocaleString('vi-VN')}đ</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{amountToFreeShip === 0 ? 'MIỄN PHÍ' : '30.000đ'}</span>
              </div>
            </div>

            <div className="border-t-2 border-[#EDE8E2] pt-3 flex justify-between items-center">
              <span className="text-sm font-black text-black">Tổng Thanh Toán:</span>
              <span className="text-xl font-black text-[#C21A27]">
                {(finalPrice + (amountToFreeShip === 0 ? 0 : 30000)).toLocaleString('vi-VN')}đ
              </span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-4 bg-[#C21A27] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl hover:bg-[#a5131f] transition-all flex items-center justify-center gap-2 glow-red"
            >
              <span>Tiến Hành Đặt Hàng</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </button>
          </div>
        </div>

      </div>

      {/* POPUP MODAL CHỌN VOUCHER CÓ SẴN */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#C21A27] animate-in zoom-in-95 max-h-[85vh] flex flex-col justify-between">
            
            {/* Header */}
            <div className="p-5 bg-[#C21A27] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                <h3 className="text-base font-black uppercase tracking-wider">
                  KHO MÃ GIẢM GIÁ VOUCHER
                </h3>
              </div>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="text-white/80 hover:text-white font-black text-lg p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* List */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <p className="text-xs text-black/70 font-bold">
                Chọn mã ưu đãi bên dưới để áp dụng trực tiếp cho đơn hàng hiện tại ({totalCartPrice.toLocaleString('vi-VN')}đ):
              </p>

              {availableVouchers.map((v) => {
                const meetsMin = !v.minOrderValue || totalCartPrice >= v.minOrderValue;
                const isSelected = appliedVoucher?.code === v.code;

                return (
                  <div
                    key={v._id || v.code}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#C21A27] bg-[#f5eee6]'
                        : meetsMin
                        ? 'border-[#EDE8E2] hover:border-black bg-white'
                        : 'border-[#EDE8E2] bg-[#EDE8E2]/30 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black font-mono uppercase bg-[#C21A27] text-white px-2.5 py-0.5 rounded">
                          {v.code}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded">
                            Đang Áp Dụng
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-black text-black">{v.description}</p>
                      {v.minOrderValue > 0 && (
                        <p className="text-[10px] text-black/60 font-bold">
                          Đơn tối thiểu: {v.minOrderValue.toLocaleString('vi-VN')}đ
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleApplyVoucherCode(v.code)}
                      disabled={!meetsMin}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : meetsMin
                          ? 'bg-[#C21A27] hover:bg-[#a5131f] text-white shadow'
                          : 'bg-black/20 text-black/40 cursor-not-allowed'
                      }`}
                    >
                      {isSelected ? 'Đã Chọn' : meetsMin ? 'Áp Dụng' : 'Chưa Đủ Đơn'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t-2 border-[#EDE8E2] bg-[#EDE8E2]/40 text-center">
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="px-6 py-2.5 bg-black text-white font-black text-xs uppercase rounded-xl"
              >
                Đóng Cửa Sổ
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
