'use client';

import React from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'dress' | 'top' | 'bottom';
}

export default function SizeChartModal({ isOpen, onClose, type = 'dress' }: SizeChartModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 p-6 animate-in zoom-in-95">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-fashion-primary flex items-center justify-center">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-stone-900">Bảng Quy Đổi Size Chuẩn</h3>
            <p className="text-xs text-stone-500">Tư vấn dựa trên Chiều cao & Cân nặng chuẩn phụ nữ Việt Nam</p>
          </div>
        </div>

        {/* Size Matrix Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs text-left text-stone-700 border-collapse">
            <thead>
              <tr className="bg-rose-50/80 text-fashion-primary font-bold border-b border-rose-100">
                <th className="py-3 px-4 rounded-l-xl">Size</th>
                <th className="py-3 px-4">Cân nặng (kg)</th>
                <th className="py-3 px-4">Chiều cao (cm)</th>
                <th className="py-3 px-4 rounded-r-xl">Vòng ngực (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              <tr className="hover:bg-stone-50 transition-colors">
                <td className="py-3 px-4 font-bold text-fashion-primary">S</td>
                <td className="py-3 px-4">40 - 47 kg</td>
                <td className="py-3 px-4">1m50 - 1m58</td>
                <td className="py-3 px-4">80 - 84 cm</td>
              </tr>
              <tr className="hover:bg-stone-50 transition-colors bg-rose-50/20">
                <td className="py-3 px-4 font-bold text-fashion-primary">M</td>
                <td className="py-3 px-4">48 - 54 kg</td>
                <td className="py-3 px-4">1m56 - 1m62</td>
                <td className="py-3 px-4">85 - 88 cm</td>
              </tr>
              <tr className="hover:bg-stone-50 transition-colors">
                <td className="py-3 px-4 font-bold text-fashion-primary">L</td>
                <td className="py-3 px-4">55 - 60 kg</td>
                <td className="py-3 px-4">1m60 - 1m68</td>
                <td className="py-3 px-4">89 - 94 cm</td>
              </tr>
              <tr className="hover:bg-stone-50 transition-colors">
                <td className="py-3 px-4 font-bold text-fashion-primary">XL</td>
                <td className="py-3 px-4">61 - 67 kg</td>
                <td className="py-3 px-4">1m62 - 1m72</td>
                <td className="py-3 px-4">95 - 100 cm</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tip Box */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Mẹo chọn đồ:</strong> Nếu số đo của nàng nằm giữa 2 size hoặc có chiều cao vượt trội, nên chọn tăng 1 size để mặc thoải mái và bay bổng hơn nhé!
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-fashion-primary text-white font-bold text-xs rounded-xl hover:bg-fashion-primaryHover transition-colors shadow-md"
        >
          Đã hiểu & Chọn Size
        </button>

      </div>
    </div>
  );
}
