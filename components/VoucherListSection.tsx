'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Gift, Info, Check, Copy, Sparkles, Zap } from 'lucide-react';
import { fetchApi } from '../lib/api';
import { useShop } from '../context/ShopContext';

export default function VoucherListSection() {
  const { totalCartPrice, setAppliedVoucher, appliedVoucher } = useShop();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string>('');

  useEffect(() => {
    fetchApi('/vouchers')
      .then((data) => {
        const activeVouchers = (data.vouchers || []).filter((v: any) => v.active !== false);
        setVouchers(activeVouchers);
      })
      .catch(console.error);
  }, []);

  const handleApplyOrCopyCode = async (voucher: any) => {
    const code = voucher.code;
    
    // Copy code to clipboard
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
    } catch (e) {}

    // If order value is available, attempt to apply voucher directly
    try {
      const res = await fetchApi('/vouchers/apply', {
        method: 'POST',
        body: JSON.stringify({ code, orderTotal: totalCartPrice })
      });

      if (res.success && res.voucher) {
        setAppliedVoucher({
          code: res.voucher.code,
          discountAmount: res.voucher.discountAmount
        });
        setToastMsg(`🎉 Đã áp dụng mã ${res.voucher.code}! Bạn được giảm ${res.voucher.discountAmount.toLocaleString('vi-VN')}đ.`);
      } else {
        setToastMsg(`Đã sao chép mã ${code}! Nhập tại giỏ hàng để nhận ưu đãi.`);
      }
    } catch (err: any) {
      setToastMsg(`Đã sao chép mã ${code}! (Yêu cầu đơn tối thiểu ${voucher.minOrderValue ? `${Math.round(voucher.minOrderValue / 1000)}k` : '0k'})`);
    }

    setTimeout(() => {
      setCopiedCode('');
      setToastMsg('');
    }, 4000);
  };

  const displayVouchers = vouchers.length > 0 ? vouchers : [
    {
      _id: 'v1',
      code: 'GIRLSTYLE50K',
      description: 'Giảm 50K cho hóa đơn từ 300K',
      discountType: 'fixed',
      discountValue: 50000,
      minOrderValue: 300000,
      badgeTitle: 'Giảm',
      badgeValue: '50K',
      type: 'discount'
    },
    {
      _id: 'v2',
      code: 'FREESHIP',
      description: 'Miễn phí vận chuyển khi mua hóa đơn từ 250K',
      discountType: 'fixed',
      discountValue: 30000,
      minOrderValue: 250000,
      badgeTitle: 'Freeship',
      badgeValue: 'FREE',
      type: 'shipping'
    },
    {
      _id: 'v3',
      code: 'FLASHSALE20',
      description: 'Tặng Voucher 20% cho đơn từ 500K',
      discountType: 'percent',
      discountValue: 20,
      minOrderValue: 500000,
      badgeTitle: 'Quà tặng',
      badgeValue: '20%',
      type: 'gift'
    },
    {
      _id: 'v4',
      code: 'WELCOME200K',
      description: 'Tặng bạn mới giảm 200K cho đơn từ 699K',
      discountType: 'fixed',
      discountValue: 200000,
      minOrderValue: 699000,
      badgeTitle: 'Tặng',
      badgeValue: '200K',
      type: 'welcome'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 relative">
      
      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#C21A27] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-black animate-in fade-in">
          <Sparkles className="w-4 h-4 text-white animate-spin shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Pure Horizontal Carousel Track of Ticket Cards Only */}
      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 px-1">
        {displayVouchers.map((v) => {
          const isApplied = appliedVoucher?.code === v.code;
          const isCopied = copiedCode === v.code;
          const isFreeship = v.code.toLowerCase().includes('ship') || v.badgeTitle?.toLowerCase().includes('ship');
          const isGift = v.type === 'gift' || v.badgeTitle?.toLowerCase().includes('quà');

          let badgeTitle = v.badgeTitle;
          let badgeValue = v.badgeValue;
          if (!badgeTitle) {
            if (isFreeship) {
              badgeTitle = 'Freeship';
              badgeValue = 'FREE';
            } else if (v.discountType === 'percent') {
              badgeTitle = 'Tặng';
              badgeValue = `${v.discountValue}%`;
            } else {
              badgeTitle = 'Giảm';
              badgeValue = `${Math.round(v.discountValue / 1000)}K`;
            }
          }

          return (
            <div
              key={v._id || v.code}
              className={`w-[300px] sm:w-[330px] shrink-0 bg-white rounded-2xl border ${
                isApplied ? 'border-2 border-[#C21A27] shadow-md' : 'border-stone-200 shadow-sm'
              } hover:shadow-xl transition-all duration-300 relative flex items-center overflow-hidden p-2.5 group`}
            >
              {/* TOP & BOTTOM SEMI-CIRCULAR TICKET NOTCH CUTOUTS */}
              <div className="absolute -top-2.5 left-[88px] w-5 h-5 rounded-full bg-white border border-stone-200 z-20"></div>
              <div className="absolute -bottom-2.5 left-[88px] w-5 h-5 rounded-full bg-white border border-stone-200 z-20"></div>

              {/* LEFT BLUE SOLID ACCENT BLOCK */}
              <div className="w-[85px] h-[95px] bg-[#2b549a] text-white rounded-xl flex flex-col items-center justify-center p-2 text-center shrink-0 relative overflow-hidden shadow-inner">
                {isFreeship ? (
                  <>
                    <span className="text-[11px] font-black tracking-tight leading-tight">Freeship</span>
                    <Truck className="w-8 h-8 mt-1 text-white stroke-[2px]" />
                  </>
                ) : isGift ? (
                  <>
                    <span className="text-[11px] font-black tracking-tight leading-tight">Quà tặng</span>
                    <Gift className="w-8 h-8 mt-1 text-white stroke-[2px]" />
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-medium opacity-90">{badgeTitle}</span>
                    <span className="text-xl font-extrabold tracking-tight mt-0.5">{badgeValue}</span>
                  </>
                )}
              </div>

              {/* VERTICAL DASHED SEPARATOR LINE */}
              <div className="h-[75px] border-r-2 border-dashed border-stone-300 mx-2.5 z-10 shrink-0"></div>

              {/* RIGHT TICKET CONTENT AREA */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-[95px] py-0.5 pr-1">
                
                {/* Title & Info Button */}
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-xs font-black text-black uppercase tracking-tight line-clamp-1">
                    {v.code === 'GIRLSTYLE50K' ? 'GIẢM 50K' : v.code === 'FREESHIP' ? 'MIỄN PHÍ VẬN CHUYỂN' : (v.description?.substring(0, 22) || v.code)}
                  </h4>
                  <button
                    title="Thông tin chi tiết mã"
                    className="text-[#2b549a] hover:opacity-80 transition-opacity p-0.5 shrink-0"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtitle / Min Order Requirement */}
                <p className="text-[10px] text-black/60 font-medium line-clamp-1 -mt-1">
                  {v.description || `Khi mua hóa đơn từ ${v.minOrderValue ? `${Math.round(v.minOrderValue / 1000)}k` : '0k'}`}
                </p>

                {/* Bottom Row: Code string & Copy/Apply Button */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-black/40 font-bold uppercase">Mã giảm giá</span>
                    <span className="text-xs font-black text-[#2b549a] tracking-wider uppercase font-mono">
                      {v.code}
                    </span>
                  </div>

                  {/* Rounded Action Button */}
                  <button
                    onClick={() => handleApplyOrCopyCode(v)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all shadow-sm flex items-center gap-1 ${
                      isApplied
                        ? 'bg-emerald-600 text-white'
                        : isCopied
                        ? 'bg-black text-white'
                        : 'bg-[#C21A27] hover:bg-[#a5131f] text-white active:scale-95'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3px]" /> Đã Dùng
                      </>
                    ) : isCopied ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3px]" /> Đã Lưu
                      </>
                    ) : (
                      'Dùng Ngay'
                    )}
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
