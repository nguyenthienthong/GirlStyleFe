'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Bot, Send, CheckCircle, Clock } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const loadFeedbacks = () => {
    setLoading(true);
    fetchApi('/feedback')
      .then((data) => setFeedbacks(data.feedbacks || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleGenerateAiReply = async (fb: any) => {
    setIsGeneratingAi(true);
    try {
      const res = await fetchApi('/ai/generate-reply', {
        method: 'POST',
        body: JSON.stringify({
          customerName: fb.customerName,
          message: fb.message,
          type: fb.type
        })
      });
      if (res.reply) setReplyText(res.reply);
    } catch (e: any) {
      alert(e.message || 'Lỗi tạo phản hồi bằng AI');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveReply = async (fbId: string) => {
    try {
      await fetchApi(`/feedback/${fbId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: 'resolved',
          adminReply: replyText
        })
      });
      setActiveReplyId(null);
      setReplyText('');
      loadFeedbacks();
    } catch (e: any) {
      alert(e.message || 'Lưu phản hồi thất bại');
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-black text-stone-900">Quản Lý Hòm Thư Góp Ý & Phản Hồi</h1>
        <p className="text-xs text-stone-500">Tiếp nhận, phân loại và soạn phản hồi cho ý kiến đóng góp của khách hàng</p>
      </div>

      <div className="space-y-4">
        {feedbacks.map((fb) => (
          <div key={fb._id} className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-rose-100 text-fashion-primary font-bold flex items-center justify-center text-sm">
                  {fb.customerName ? fb.customerName[0] : 'K'}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{fb.customerName} - {fb.phone}</h3>
                  <p className="text-[11px] text-stone-400">{fb.email || 'Chưa cung cấp email'} • {new Date(fb.createdAt).toLocaleString('vi-VN')}</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                fb.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {fb.status === 'resolved' ? 'Đã phản hồi' : 'Chờ xử lý'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 text-xs text-stone-700 space-y-1">
              <span className="font-bold text-rose-600 block">[Loại: {fb.type}]</span>
              <p className="italic">"{fb.message}"</p>
            </div>

            {fb.adminReply && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs text-stone-800 space-y-1">
                <span className="font-bold text-fashion-primary block">Phản hồi từ Admin:</span>
                <p>{fb.adminReply}</p>
              </div>
            )}

            {/* Reply action box */}
            {activeReplyId === fb._id ? (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-stone-800">Soạn Phản Hồi Khách Hàng</label>
                  <button
                    onClick={() => handleGenerateAiReply(fb)}
                    disabled={isGeneratingAi}
                    className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200"
                  >
                    <Bot className="w-3.5 h-3.5" /> {isGeneratingAi ? 'AI đang viết...' : 'Trợ lý AI viết phản hồi tự động'}
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-fashion-primary"
                  placeholder="Nhập nội dung phản hồi gửi khách hàng..."
                ></textarea>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveReply(fb._id)}
                    className="px-4 py-2 bg-fashion-primary text-white font-bold text-xs rounded-xl shadow"
                  >
                    Lưu & Gửi Phản Hồi
                  </button>
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="px-4 py-2 bg-stone-100 text-stone-600 font-bold text-xs rounded-xl"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveReplyId(fb._id);
                  setReplyText(fb.adminReply || '');
                }}
                className="px-4 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-stone-800"
              >
                {fb.adminReply ? 'Sửa phản hồi' : 'Soạn phản hồi'}
              </button>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}
