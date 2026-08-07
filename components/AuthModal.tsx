'use client';

import React, { useState } from 'react';
import { X, Phone, Lock, User, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { fetchApi } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const { setUser, setToken } = useShop();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login form
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!loginPhone) {
      setErrorMsg('Vui lòng nhập số điện thoại');
      return;
    }
    setLoading(true);
    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone: loginPhone, password: loginPassword })
      });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        setSuccessMsg('Đăng nhập thành công!');
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng nhập thất bại, vui lòng kiểm tra SĐT và mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!regName || !regPhone || !regPassword) {
      setErrorMsg('Vui lòng điền Họ tên, Số điện thoại và Mật khẩu');
      return;
    }
    setLoading(true);
    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: regName,
          phone: regPhone,
          email: regEmail,
          password: regPassword
        })
      });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        setSuccessMsg('Đăng ký tài khoản thành công!');
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng ký thất bại, SĐT có thể đã được sử dụng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#C21A27] animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-[#EDE8E2] text-black hover:bg-[#C21A27] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#C21A27] to-[#a5131f] text-white text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-white text-[#C21A27] font-black text-xl flex items-center justify-center mx-auto shadow-md">
            GS
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider">
            {mode === 'login' ? 'Đăng Nhập Khách Hàng' : 'Đăng Ký Tài Khoản Mới'}
          </h2>
          <p className="text-xs text-white/80 font-medium">
            {mode === 'login'
              ? 'Nhập SĐT để theo dõi đơn hàng & tích điểm ưu đãi'
              : 'Tạo tài khoản cá nhân trải nghiệm sắm đồ thông minh'}
          </p>
        </div>

        {/* Mode Tab Switcher */}
        <div className="flex border-b-2 border-[#EDE8E2] bg-[#EDE8E2]/40">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
              mode === 'login' ? 'bg-white text-[#C21A27] border-b-4 border-[#C21A27]' : 'text-black/60 hover:text-black'
            }`}
          >
            Đăng Nhập
          </button>

          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
              mode === 'register' ? 'bg-white text-[#C21A27] border-b-4 border-[#C21A27]' : 'text-black/60 hover:text-black'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 text-[#C21A27] text-xs font-extrabold rounded-xl border border-[#C21A27]/30 animate-in fade-in">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-extrabold rounded-xl border border-emerald-300 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMsg}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1">Số điện thoại *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="0912345678"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-[#EDE8E2] text-xs focus:ring-2 focus:ring-[#C21A27] focus:outline-none bg-white text-black font-medium"
                  />
                  <Phone className="w-4 h-4 text-black/50 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Mật khẩu cá nhân</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu (Nếu có)..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-[#EDE8E2] text-xs focus:ring-2 focus:ring-[#C21A27] focus:outline-none bg-white text-black font-medium"
                  />
                  <Lock className="w-4 h-4 text-black/50 absolute left-3 top-3" />
                </div>
                <p className="text-[10px] text-black/60 mt-1 font-medium">
                  *Nếu khách tạo tự động khi checkout, lần đầu không cần nhập mật khẩu.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#C21A27] hover:bg-[#a5131f] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 glow-red"
              >
                {loading ? 'Đang xác thực...' : <><ArrowRight className="w-4 h-4" /> Đăng Nhập Ngay</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-black mb-1">Họ & Tên *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Thị Ngọc Anh"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-[#EDE8E2] text-xs focus:ring-2 focus:ring-[#C21A27] focus:outline-none bg-white text-black font-medium"
                  />
                  <User className="w-4 h-4 text-black/50 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Số điện thoại chính *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="0912345678"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-[#EDE8E2] text-xs focus:ring-2 focus:ring-[#C21A27] focus:outline-none bg-white text-black font-medium"
                  />
                  <Phone className="w-4 h-4 text-black/50 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Email liên hệ</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="ngocanh@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-[#EDE8E2] text-xs focus:ring-2 focus:ring-[#C21A27] focus:outline-none bg-white text-black font-medium"
                  />
                  <Mail className="w-4 h-4 text-black/50 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Tạo Mật khẩu *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Mật khẩu từ 6 ký tự..."
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-[#EDE8E2] text-xs focus:ring-2 focus:ring-[#C21A27] focus:outline-none bg-white text-black font-medium"
                  />
                  <Lock className="w-4 h-4 text-black/50 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#C21A27] hover:bg-[#a5131f] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 glow-red mt-2"
              >
                {loading ? 'Đang tạo tài khoản...' : <><ShieldCheck className="w-4 h-4" /> Đăng Ký Tài Khoản</>}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
