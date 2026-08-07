'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export default function FeedbackPage() {
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    type: 'gop_y',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.message) {
      alert('Vui lòng điền Tên, Số điện thoại và Nội dung phản hồi!');
      return;
    }
    setLoading(true);
    try {
      await fetchApi('/feedback', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setSubmitted(true);
      setForm({ customerName: '', phone: '', email: '', type: 'gop_y', message: '' });
    } catch (e: any) {
      alert(e.message || 'Gửi thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-rose-100 shadow-xl space-y-8">
        
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-fashion-primary text-white flex items-center justify-center mx-auto shadow-lg">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900">Hòm Thư Góp Ý & Phản Hồi Dịch Vụ</h1>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Trực tiếp gửi ý kiến đóng góp, khiếu nại chất lượng sản phẩm hay phục vụ tới ban quản trị GirlStyle.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-emerald-50 text-emerald-900 rounded-2xl text-center space-y-3 border border-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold">Cảm Ơn Phản Hồi Của Nàng!</h3>
            <p className="text-xs text-emerald-700">
              Hộp thư Admin đã tiếp nhận thông tin và sẽ kiểm tra, phản hồi/xử lý sớm nhất!
            </p>
            <button onClick={() => setSubmitted(false)} className="px-6 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl">
              Gửi ý kiến khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Họ & Tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Thị Ngọc Anh"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-fashion-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  required
                  placeholder="0912345678"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-fashion-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email (Không bắt buộc)</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-fashion-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Loại Phản Hồi</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-fashion-primary focus:outline-none font-medium"
                >
                  <option value="gop_y">💡 Góp ý sản phẩm / giao diện</option>
                  <option value="khieu_nai">⚠️ Phản hồi khiếu nại thái độ & đơn hàng</option>
                  <option value="tu_van_size">👗 Tư vấn chọn Size & Màu sắc</option>
                  <option value="khac">📌 Ý kiến khác</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nội dung chi tiết *</label>
              <textarea
                rows={5}
                required
                placeholder="Nhập nội dung ý kiến đóng góp hoặc khiếu nại của bạn..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-fashion-primary focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-fashion-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-fashion-primaryHover transition-all flex items-center justify-center gap-2 glow-pink"
            >
              {loading ? 'Đang gửi...' : <><Send className="w-4 h-4" /> Gửi Hòm Thư Admin</>}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
