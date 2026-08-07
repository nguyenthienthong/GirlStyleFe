'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Phone, ArrowRight, CheckCircle2, KeyRound, Sparkles, UserCheck } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState('0900000000');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetchApi('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ account, password })
      });

      if (res.success && res.token) {
        localStorage.setItem('admin_token', res.token);
        localStorage.setItem('admin_user', JSON.stringify(res.user));

        setSuccessMsg(`Xin chào ${res.user.name || 'Quản trị viên'}! Đang chuyển hướng...`);
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } else {
        setErrorMsg(res.message || 'Đăng nhập thất bại!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (acc: string, pass: string) => {
    setAccount(acc);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Top Header Card - Soft Dark Slate */}
        <div className="bg-slate-900 text-white p-8 text-center space-y-3 relative">
          <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto shadow-inner border border-white/20">
            <ShieldCheck className="w-8 h-8 text-slate-200" />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-wider font-sans">
            ĐĂNG NHẬP QUẢN TRỊ
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Hệ thống Quản trị & Phân quyền Biên tập GirlStyle® Admin
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" /> Số Điện Thoại / Email Quản Trị *
            </label>
            <input
              type="text"
              required
              placeholder="Nhập SĐT (VD: 0900000000)"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" /> Mật Khẩu Truy Cập *
            </label>
            <input
              type="password"
              required
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Đang kiểm tra quyền...</span>
            ) : (
              <>
                <span>XÁC NHẬN ĐĂNG NHẬP</span>
                <ArrowRight className="w-4 h-4 stroke-[3px]" />
              </>
            )}
          </button>

          {/* Quick Demo Login Presets */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2">
              💡 Thử nghiệm nhanh bằng tài khoản có sẵn:
            </p>

            <button
              type="button"
              onClick={() => handleQuickFill('0900000000', 'admin123')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-800" />
                <div>
                  <p className="font-bold text-slate-900">1. Admin Master (Toàn Quyền)</p>
                  <p className="text-[10px] text-slate-500 font-medium">SĐT: 0900000000 | Pass: admin123</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">Bấm Điền</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('0911111111', 'writer123')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="font-bold text-slate-900">2. Biên Tập Viên (Quyền Viết Bài)</p>
                  <p className="text-[10px] text-slate-500 font-medium">SĐT: 0911111111 | Pass: writer123</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">Bấm Điền</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 font-bold underline">
              Quay lại Website Cửa Hàng
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
}
