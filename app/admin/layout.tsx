'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, MessageSquare, Image, Bot, Settings, ShieldCheck, ArrowLeft, Ticket, Layers, Users, LogOut, Lock, Bell, CheckCheck, ExternalLink, X, Mail } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Notification System State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [newOrderToast, setNewOrderToast] = useState<any>(null);

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

  // Real-time Notification Polling from Backend
  useEffect(() => {
    if (pathname === '/admin/login') return;

    let previousCount = 0;

    const fetchNotifications = async () => {
      try {
        const res = await fetchApi('/orders/notifications/all');
        if (res.success && res.notifications) {
          setNotifications(res.notifications);
          const unread = res.unreadCount || 0;
          setUnreadCount(unread);

          // If new notification arrived, show toast banner
          if (unread > previousCount && res.notifications.length > 0) {
            const latest = res.notifications[0];
            setNewOrderToast(latest);
            setTimeout(() => setNewOrderToast(null), 8000);
          }
          previousCount = unread;
        }
      } catch (err) {
        // Silent error
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Poll every 5s

    return () => clearInterval(interval);
  }, [pathname]);

  const handleMarkAllRead = async () => {
    try {
      await fetchApi('/orders/notifications/mark-read', { method: 'POST' });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      
      {/* Real-time Order Toast Banner */}
      {newOrderToast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-rose-500 max-w-sm animate-in slide-in-from-top-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500 text-white animate-pulse">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-rose-300">🛒 CÓ ĐƠN HÀNG MỚI!</p>
                <p className="text-xs font-bold text-white mt-0.5">{newOrderToast.customerName} ({newOrderToast.phone})</p>
                <p className="text-[11px] text-slate-300 font-mono">#{newOrderToast.orderCode} • {Number(newOrderToast.amount || 0).toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
            <button onClick={() => setNewOrderToast(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Mail className="w-3 h-3 text-emerald-400" /> Đã gửi email tới Admin
            </span>
            <Link
              href="/admin/orders"
              onClick={() => setNewOrderToast(null)}
              className="text-rose-400 font-bold hover:underline flex items-center gap-1"
            >
              Xem đơn ngay →
            </Link>
          </div>
        </div>
      )}

      {/* Admin Sidebar Navigation */}
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

      {/* Main Admin Body Area with Top Notification Header Bar */}
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50">
        
        {/* Top Header Bar with Realtime Notifications Dropdown */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">GirlStyle® Admin CMS</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {navItems.find((n) => n.href === pathname)?.label || 'Bảng Điều Khiển'}
            </span>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Notification Bell Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 relative transition-all"
                title="Thông báo đơn hàng mới"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel Modal Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-rose-500" />
                      <h4 className="text-xs font-black text-slate-900 uppercase">Thông báo Đơn Hàng Mới</h4>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> Đánh dấu đã đọc
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 font-semibold">
                        Chưa có thông báo đơn hàng mới
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`p-3.5 text-xs transition-colors flex items-start gap-3 ${
                            n.isRead ? 'bg-white text-slate-600' : 'bg-rose-50/50 text-slate-900 font-semibold'
                          }`}
                        >
                          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                            <ShoppingBag className="w-4 h-4 text-rose-600" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{n.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(n.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                            
                            <div className="pt-1 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-emerald-600">📩 Đã gửi Email thông báo</span>
                              <Link
                                href="/admin/orders"
                                onClick={() => setIsNotifOpen(false)}
                                className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                              >
                                Xem đơn <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 border-t border-slate-100 text-center bg-slate-50">
                    <Link
                      href="/admin/orders"
                      onClick={() => setIsNotifOpen(false)}
                      className="text-xs font-bold text-slate-700 hover:text-slate-900"
                    >
                      Quản lý tất cả đơn hàng →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Email simulation notification pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Email Admin: admin@girlstyle.vn</span>
            </div>
          </div>
        </header>

        {/* Main Children */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50 text-slate-900">
          {children}
        </main>
      </div>

    </div>
  );
}
