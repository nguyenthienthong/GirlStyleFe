'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Copy, Check, Send } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function AdminAiAssistantPage() {
  const [productName, setProductName] = useState('');
  const [material, setMaterial] = useState('Lụa tơ tằm cao cấp');
  const [occasion, setOccasion] = useState('Đi tiệc');

  const [generatedDescription, setGeneratedDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateDescription = async () => {
    if (!productName) {
      alert('Vui lòng nhập tên sản phẩm');
      return;
    }
    setLoading(true);
    try {
      const res = await fetchApi('/ai/generate-description', {
        method: 'POST',
        body: JSON.stringify({ productName, material, occasion })
      });
      if (res.description) {
        setGeneratedDescription(res.description);
      }
    } catch (e: any) {
      alert(e.message || 'Lỗi kết nối Trợ lý AI');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-900 text-purple-200 flex items-center justify-center font-bold">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-stone-900">Trợ Lý Ảo AI Cho Admin (Phase 3)</h1>
          <p className="text-xs text-stone-500">Tự động viết mô tả sản phẩm cuốn hút, gợi ý blog & nội dung phản hồi khách hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Form Input */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" /> Công Cụ Viết Mô Tả Sản Phẩm
          </h3>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Tên sản phẩm thời trang *</label>
            <input
              type="text"
              placeholder="VD: Đầm Lụa Tơ Tằm Cổ V Tôn Dáng"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-3 border rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Chất liệu</label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full p-3 border rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Dịp mặc phù hợp</label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full p-3 border rounded-xl text-xs font-medium"
            >
              <option value="Đi tiệc">Đi tiệc</option>
              <option value="Công sở">Công sở</option>
              <option value="Dạo phố">Dạo phố</option>
            </select>
          </div>

          <button
            onClick={handleGenerateDescription}
            disabled={loading}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'AI đang sáng tạo nội dung...' : <><Bot className="w-4 h-4" /> Tự Động Viết Mô Tả Bằng AI</>}
          </button>
        </div>

        {/* Output Copy */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
              <h3 className="text-sm font-bold text-stone-900">Kết Quả Văn Bản AI Sáng Tạo</h3>
              {generatedDescription && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Đã sao chép</> : <><Copy className="w-3.5 h-3.5" /> Sao chép</>}
                </button>
              )}
            </div>

            {generatedDescription ? (
              <div className="p-4 bg-stone-50 rounded-xl text-xs text-stone-700 whitespace-pre-line leading-relaxed border">
                {generatedDescription}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-stone-400 border border-dashed rounded-xl">
                Nhập thông tin sản phẩm và nhấn nút để Trợ Lý AI soạn nội dung truyền thông cho bạn.
              </div>
            )}
          </div>

          <p className="text-[11px] text-stone-400 text-center">
            Mô tả được tối ưu từ ngữ quyến rũ, tôn dáng chuẩn văn phong thương hiệu thời trang nữ.
          </p>
        </div>

      </div>

    </div>
  );
}
