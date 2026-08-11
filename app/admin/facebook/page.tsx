'use client';

import React, { useState } from 'react';
import { Share2, Send, CheckCircle2, Facebook, Image, Link, Sparkles } from 'lucide-react';
import { fetchApi } from '../../../lib/api';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';

export default function AdminFacebookPage() {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    imageUrl: '',
    linkUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');

    try {
      const res = await fetchApi('/facebook/post', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (res.success) {
        setStatusMsg(`✅ Đã đăng thành công bài viết lên Facebook Fanpage GirlStyle! (Post ID: ${res.post?.fbPostId})`);
        setFormData({ title: '', body: '', imageUrl: '', linkUrl: '' });
      }
    } catch (err: any) {
      alert('Lỗi đăng bài Facebook: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      <AdminPageHeader
        title="Quản Lý Đăng Bài 2 Chiều Web ⇔ Facebook Fanpage"
        description="Đăng tin khuyến mãi, Lookbook mới & Sản phẩm HOT từ Website lên Fanpage Facebook 1-Click"
      />

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Facebook className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Soạn Bài Viết Đăng Lên Facebook Fanpage</h3>
            <p className="text-xs text-slate-500 font-medium">Fanpage Đã Kết Nối: <strong>GirlStyle Fashion Official</strong> (ID: 1000998877)</p>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handlePost} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu Đề Bài Viết *</label>
            <input
              type="text"
              required
              placeholder="VD: 🔥 BỘ SƯU TẬP MÙA HÈ GIRLSTYLE 2026 CHÍNH THỨC LÊN SÓNG!"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nội Dung Chi Tiết Bài Đăng *</label>
            <textarea
              rows={5}
              required
              placeholder="Nhập nội dung chia sẻ, đính kèm thông tin ưu đãi & hashtag..."
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full p-4 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">URL Hình Ảnh Đính Kèm</label>
              <input
                type="text"
                placeholder="/uploads/banner_1.jpg..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Link Trỏ Về Website</label>
              <input
                type="text"
                placeholder="https://girlstyle.vn/products/..."
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> {loading ? 'Đang Đăng Bài...' : 'Đăng Ngay Lên Facebook Fanpage'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
