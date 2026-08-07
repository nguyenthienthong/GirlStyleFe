'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, MessageSquare, Image, Bot, Settings, ShieldCheck, ArrowLeft, Ticket, Layers, Users, LogOut, Lock } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = RouterHook();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Helper hook for Next.js router
  function RouterHook() {
    return useRouter();
  }

  useEffect(() => {
    // If on /admin/login route, skip auth redirect check
    if (pathname === '/admin/login') {
      setIsCheckingAuth(false);
      return;
    }

    // Check admin authentication from localStorage
    const token = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');

    if (!token || !storedUser) {
      router.push('/admin/login');
    } else {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
      } catch (e) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/admin/login');
      }
    }
    setIsCheckingAuth(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  // If on login page, render children directly without admin sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <ShieldCheck className="w-10 h-10 text-slate-800 animate-bounce mx-auto" />
          <p className="text-xs font-bold text-slate-700">Đang xác thực quyền Quản trị Admin...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Tổng Quan Báo Cáo', href: '/admin', icon: LayoutDashboard },
    { label: 'Quản Lý Đơn Hàng', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Sản Phẩm & Tồn Kho', href: '/admin/products', icon: Package },
    { label: 'Bộ Phối Mix & Match', href: '/admin/lookbooks', icon: Layers },
    { label: 'Quản Lý Quyền & User', href: '/admin/users', icon: Users },
    { label: 'Mã Giảm Giá Voucher', href: '/admin/vouchers', icon: Ticket },
    { label: 'Hòm Thư Khách Hàng', href: '/admin/feedback', icon: MessageSquare },
    { label: 'CMS Banners & Popup', href: '/admin/banners', icon: Image },
    { label: 'Trợ Lý Virtual AI Copilot', href: '/admin/ai-assistant', icon: Bot },
    { label: 'Đồng Bộ KiotViet & Cài Đặt', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Admin Sidebar Navigation - Soft Slate & Elegant Design */}
      <aside className="w-full md:w-64 bg-white text-slate-900 p-6 flex flex-col justify-between shrink-0 shadow-sm border-r border-slate-200">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="GIRLSTYLE" className="h-9 w-auto object-contain" />
            </Link>
          </div>

          {/* Logged user badge */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black flex items-center justify-center shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-slate-900 truncate">{currentUser?.name || 'Quản trị viên'}</p>
                <p className="text-[10px] text-slate-500 font-semibold capitalize flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-slate-700" />
                  {currentUser?.role === 'admin' ? 'Master Admin' : currentUser?.canWrite ? 'Biên Tập Viên' : 'Nhân Viên'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white transition-colors"
              title="Đăng xuất khỏi Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1 text-xs font-bold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive ? 'bg-slate-900 text-white font-black shadow-sm' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-200 space-y-2 text-xs font-bold">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl transition-colors font-bold uppercase text-[11px]"
          >
            <LogOut className="w-4 h-4" /> Đăng Xuất Quyền Admin
          </button>

          <Link href="/" className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 transition-colors py-2 text-center text-xs">
            <ArrowLeft className="w-4 h-4" /> Quay lại Website cửa hàng
          </Link>
        </div>
      </aside>

      {/* Main Admin Body */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50 text-slate-900">
        {children}
      </main>

    </div>
  );
}
