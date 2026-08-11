'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  MessageSquare,
  Image,
  Bot,
  Settings,
  ShieldCheck,
  ArrowLeft,
  Ticket,
  Layers,
  Users,
  LogOut,
  Bell,
  CheckCheck,
  ExternalLink,
  X,
  Mail,
  Menu,
  ChevronDown,
  TrendingUp,
  Store,
  Megaphone,
  Sliders
} from 'lucide-react';
import { fetchApi } from '../../lib/api';

// Multi-Level Grouped Navigation Menu Data Structure
const navGroups = [
  {
    groupTitle: 'Báo Cáo & Đơn Hàng',
    groupId: 'sales',
    groupIcon: TrendingUp,
    items: [
      { label: 'Tổng Quan Báo Cáo', href: '/admin', icon: LayoutDashboard },
      { label: 'Quản Lý Đơn Hàng', href: '/admin/orders', icon: ShoppingBag },
      { label: 'Nhật Ký & Audit Logs', href: '/admin/logs', icon: ShieldCheck },
    ],
  },
  {
    groupTitle: 'Sản Phẩm & Nội Dung',
    groupId: 'catalog',
    groupIcon: Store,
    items: [
      { label: 'Sản Phẩm & Tồn Kho', href: '/admin/products', icon: Package },
      { label: 'Bộ Phối Mix & Match', href: '/admin/lookbooks', icon: Layers },
      { label: 'CMS Banners & Popup', href: '/admin/banners', icon: Image },
    ],
  },
  {
    groupTitle: 'Marketing & Khách Hàng',
    groupId: 'marketing',
    groupIcon: Megaphone,
    items: [
      { label: 'Mã Giảm Giá Voucher', href: '/admin/vouchers', icon: Ticket },
      { label: 'Đăng Bài Facebook 2 Chiều', href: '/admin/facebook', icon: ExternalLink },
      { label: 'Hòm Thư Khách Hàng', href: '/admin/feedback', icon: MessageSquare },
      { label: 'Trợ Lý Virtual AI Copilot', href: '/admin/ai-assistant', icon: Bot },
    ],
  },
  {
    groupTitle: 'Hệ Thống & Cài Đặt',
    groupId: 'system',
    groupIcon: Sliders,
    items: [
      { label: 'Quản Lý Quyền & User', href: '/admin/users', icon: Users },
      { label: 'Đồng Bộ KiotViet & Cài Đặt', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notification System State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [newOrderToast, setNewOrderToast] = useState<any>(null);

  // Group Collapsible Accordion State
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    sales: true,
    catalog: true,
    marketing: true,
    system: true,
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

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

  // Auto expand parent group based on current pathname
  useEffect(() => {
    setIsMobileMenuOpen(false);

    navGroups.forEach((group) => {
      const hasActiveChild = group.items.some((item) => item.href === pathname);
      if (hasActiveChild) {
        setExpandedGroups((prev) => ({ ...prev, [group.groupId]: true }));
      }
    });
  }, [pathname]);

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
    const interval = setInterval(fetchNotifications, 5000);

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

  // Helper to find current page label
  const allNavItems = navGroups.flatMap((g) => g.items);
  const currentPageTitle = allNavItems.find((n) => n.href === pathname)?.label || 'Bảng Điều Khiển';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative overflow-x-hidden">
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
                <p className="text-xs font-bold text-white mt-0.5">
                  {newOrderToast.customerName} ({newOrderToast.phone})
                </p>
                <p className="text-[11px] text-slate-300 font-mono">
                  #{newOrderToast.orderCode} • {Number(newOrderToast.amount || 0).toLocaleString('vi-VN')}đ
                </p>
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

      {/* MOBILE OVERLAY BACKDROP */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in"
        />
      )}

      {/* ADMIN SIDEBAR (Fixed Height 100vh with Always Visible Pinned Bottom Controls) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white text-slate-900 p-4 flex flex-col justify-between shadow-xl md:shadow-xs border-r border-slate-200 transition-transform duration-300 ease-in-out md:static md:w-64 md:h-screen md:sticky md:top-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Logged User Badge (Pinned Top, No Scroll) */}
        <div className="shrink-0 space-y-3 pb-2 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <img src="/logo.png?v=999" alt="GIRLSTYLE" className="h-9 md:h-11 w-auto object-contain" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-900 md:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-slate-900 truncate text-[11px] leading-tight">{currentUser?.name || 'Quản trị viên'}</p>
                <p className="text-[10px] text-slate-500 font-semibold capitalize flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-slate-700" />
                  {currentUser?.role === 'admin' ? 'Master Admin' : currentUser?.canWrite ? 'Biên Tập Viên' : 'Nhân Viên'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white transition-colors shrink-0"
              title="Đăng xuất khỏi Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Middle Navigation Menu ONLY */}
        <div className="flex-1 overflow-y-auto py-2 space-y-4 pr-1 scrollbar-thin">
          <nav className="space-y-3">
            {navGroups.map((group) => {
              const GroupIcon = group.groupIcon;
              const isExpanded = expandedGroups[group.groupId];
              const hasActiveChild = group.items.some((item) => item.href === pathname);

              return (
                <div key={group.groupId} className="space-y-1">
                  {/* Parent Group Header Button */}
                  <button
                    onClick={() => toggleGroup(group.groupId)}
                    className={`w-full flex items-center justify-between py-1.5 px-2 text-xs font-bold transition-all rounded-xl hover:bg-slate-100 ${
                      hasActiveChild ? 'text-slate-900 font-black' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <GroupIcon className={`w-4 h-4 shrink-0 ${hasActiveChild ? 'text-rose-600' : 'text-slate-400'}`} />
                      <span className="truncate uppercase tracking-wider text-[11px] font-black">{group.groupTitle}</span>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-0 text-slate-700' : '-rotate-90'
                      }`}
                    />
                  </button>

                  {/* Indented Child Items Dropdown */}
                  {isExpanded && (
                    <div className="ml-3.5 pl-3 border-l-2 border-slate-200/70 space-y-1 py-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                              isActive
                                ? 'bg-slate-900 text-white font-black shadow-xs'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Fixed Pinned Bottom Controls (ALWAYS Visible Without Scrolling) */}
        <div className="pt-3 border-t border-slate-200 space-y-2 text-xs font-bold shrink-0 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl transition-colors font-bold uppercase text-[11px]"
          >
            <LogOut className="w-4 h-4 text-rose-500" /> Đăng Xuất Admin
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 transition-colors py-1.5 text-center text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" /> Quay lại Website
          </Link>
        </div>
      </aside>

      {/* Main Admin Body Area with Top Notification Header Bar */}
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50 w-full overflow-x-hidden">
        {/* Top Header Bar (Responsive with Hamburger Menu for Mobile) */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger Button on Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 md:hidden"
              title="Mở menu quản trị"
            >
              <Menu className="w-5 h-5 stroke-[2.5px]" />
            </button>

            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">GirlStyle® Admin</span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider truncate">
                {currentPageTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
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
                                {new Date(n.createdAt).toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
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
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Email Admin: admin@girlstyle.vn</span>
            </div>
          </div>
        </header>

        {/* Main Children */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50 text-slate-900">{children}</main>
      </div>
    </div>
  );
}
