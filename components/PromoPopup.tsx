'use client';

import React from 'react';
import { X, Sparkles, Gift, Copy, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function PromoPopup() {
  const { isPromoPopupOpen, setIsPromoPopupOpen, setAppliedVoucher } = useShop();
  const [copied, setCopied] = React.useState(false);

  if (!isPromoPopupOpen) return null;

  const voucherCode = 'GIRLSTYLE50K';

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setAppliedVoucher({ code: voucherCode, discountAmount: 50000 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#C21A27] animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={() => setIsPromoPopupOpen(false)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Fashion Banner Image */}
        <div className="relative h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80')` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#C21A27] bg-white px-2.5 py-0.5 rounded w-fit mb-1">
              <Sparkles className="w-3 h-3" /> QUÀ CHÀO MỪNG NÀNG
            </span>
            <h3 className="text-xl font-black">TẶNG VOUCHER 50.000đ</h3>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 text-center space-y-4">
          <p className="text-xs text-black/80 font-medium leading-relaxed">
            Chào mừng nàng đến với <strong className="text-black font-extrabold">GirlStyle®</strong>! Áp dụng ngay mã giảm giá đặc quyền bên dưới cho đơn hàng đầu tiên nhé.
          </p>

          {/* Voucher Box */}
          <div className="p-3 bg-[#EDE8E2] border-2 border-dashed border-[#C21A27] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#C21A27] text-white flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-black/60 font-bold block">MÃ GIẢM GIÁ</span>
                <span className="text-base font-black text-[#C21A27] tracking-wider">{voucherCode}</span>
              </div>
            </div>
            
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-[#C21A27] text-white text-xs font-black rounded-xl hover:bg-[#a5131f] transition-colors flex items-center gap-1 shadow-sm uppercase tracking-wider"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Đã lưu
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Dùng ngay
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => setIsPromoPopupOpen(false)}
            className="w-full py-3 bg-black text-white font-black text-xs rounded-xl hover:bg-black/90 transition-colors uppercase tracking-wider"
          >
            Khám phá bộ sưu tập ngay
          </button>
        </div>

      </div>
    </div>
  );
}
