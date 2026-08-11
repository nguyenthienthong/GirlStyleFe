'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User, MessageSquareHeart, Menu, X, Sparkles, ShieldCheck, Phone, ChevronRight, Grid, Zap, BookOpen, Layers, LogIn, LogOut } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { totalCartCount, user, logout, setIsCartDrawerOpen } = useShop();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#C21A27] text-white py-1.5 px-4 text-[10px] md:text-xs text-center font-extrabold flex items-center justify-center gap-1.5 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-white" />
        <span>GIRLSTYLE® - MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN HÀNG TỪ 400K!</span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-white" />
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDE8E2] transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-20">
            
            {/* Mobile Hamburger & Quick Search Button */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-full text-black hover:text-[#C21A27] active:bg-[#EDE8E2] transition-colors"
                title="Mở menu app"
              >
                <Menu className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-2 rounded-full text-black hover:text-[#C21A27] active:bg-[#EDE8E2] transition-colors"
                title="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo - Official GirlStyle Horizontal Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group mr-5 xl:mr-8">
                <img
                  src="/logo.png?v=4"
                  alt="GIRLSTYLE® Logo"
                  className="h-10 md:h-12 lg:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300 py-1"
                />
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-black text-black uppercase tracking-wider">
                
                {/* 1. Sản Phẩm */}
                <Link href="/products" className="hover:text-[#C21A27] transition-colors py-2 relative group">
                  <span>SẢN PHẨM</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C21A27] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* 2. Bộ Sưu Tập */}
                <Link href="/lookbook" className="hover:text-[#C21A27] transition-colors py-2 relative group">
                  <span>BỘ SỰ TẬP</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C21A27] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* 3. Xu Hướng */}
                <Link href="/products?isHot=true" className="hover:text-[#C21A27] transition-colors py-2 flex items-center gap-1 relative group">
                  <span>XU HƯỚNG</span>
                  <span className="px-1.5 py-0.5 text-[9px] bg-[#C21A27] text-white rounded font-black leading-none uppercase">
                    HOT
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C21A27] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* 4. Blog */}
                <Link href="/blog" className="hover:text-[#C21A27] transition-colors py-2 relative group">
                  <span>BLOG</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C21A27] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* 5. Mix Match -> Pointing to /lookbook */}
                <Link href="/lookbook" className="hover:text-[#C21A27] transition-colors py-2 relative group">
                  <span>MIX MATCH</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C21A27] group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* 6. Liên Hệ */}
                <a href="tel:19006868" className="hover:text-[#C21A27] transition-colors py-2 flex items-center gap-1 relative group">
                  <Phone className="w-3.5 h-3.5 text-[#C21A27]" />
                  <span>LIÊN HỆ</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C21A27] group-hover:w-full transition-all duration-300"></span>
                </a>

                {/* 7. Góp Ý */}
                <Link href="/feedback" className="hover:text-[#C21A27] transition-colors py-2 flex items-center gap-1 text-[#C21A27] font-black relative group">
                  <MessageSquareHeart className="w-3.5 h-3.5 text-[#C21A27]" />
                  <span>GÓP Ý</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C21A27] group-hover:w-full transition-all duration-300"></span>
                </Link>

              </nav>
            </div>

            {/* Desktop Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Quick Search Input */}
              <form action="/products" className="hidden md:flex items-center relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Tìm váy, áo, outfit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-36 xl:w-44 pl-8 pr-3 py-1.5 text-xs rounded-full bg-[#EDE8E2]/60 border border-[#EDE8E2] text-black focus:outline-none focus:ring-2 focus:ring-[#C21A27] focus:bg-white transition-all font-medium"
                />
                <Search className="w-3.5 h-3.5 text-black/50 absolute left-2.5 top-2" />
              </form>

              {/* User Account Button with Login/Register Modal trigger */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (!user) {
                      openAuthModal('login');
                    } else {
                      setIsUserDropdownOpen(!isUserDropdownOpen);
                    }
                  }}
                  className="p-1.5 md:p-2 text-black hover:text-[#C21A27] rounded-full hover:bg-[#EDE8E2]/60 transition-colors flex items-center gap-1.5"
                  title="Tài khoản"
                >
                  <User className="w-5 h-5" />
                  {user ? (
                    <span className="hidden xl:inline text-xs font-bold max-w-[80px] truncate">{user.name}</span>
                  ) : (
                    <span className="hidden md:inline text-xs font-extrabold text-[#C21A27] uppercase">Đăng nhập</span>
                  )}
                </button>

                {isUserDropdownOpen && user && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-[#EDE8E2] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-[#EDE8E2]">
                      <p className="text-xs font-black text-black">{user.name}</p>
                      <p className="text-[11px] text-black/60">{user.phone}</p>
                      {user.role !== 'customer' && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-black text-white rounded font-bold">
                          Quản trị ({user.role})
                        </span>
                      )}
                    </div>

                    {user.role !== 'customer' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#C21A27] hover:bg-[#EDE8E2]"
                      >
                        <ShieldCheck className="w-4 h-4" /> Trang quản trị (Admin)
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>

              {/* Shopping Cart Button - Opens Slide-over Cart Drawer */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="p-1.5 md:p-2 text-black hover:text-[#C21A27] relative transition-transform active:scale-95"
                title="Giỏ hàng"
              >
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                {totalCartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-[#C21A27] text-white rounded-full text-[9px] md:text-[10px] font-black flex items-center justify-center shadow-md animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>

          </div>

          {/* Mobile Quick Search Bar Expandable */}
          {isMobileSearchOpen && (
            <div className="lg:hidden pb-3 pt-1 animate-in slide-in-from-top-2">
              <form action="/products" className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Tìm kiếm sản phẩm, váy, áo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-[#EDE8E2]/80 border border-[#EDE8E2] text-black focus:outline-none focus:ring-2 focus:ring-[#C21A27] font-medium"
                />
                <Search className="w-4 h-4 text-black/50 absolute left-3 top-2.5" />
              </form>
            </div>
          )}
        </div>
      </header>

      {/* SLEEK MOBILE APP DRAWER MENU (SLIDE OVER) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
          ></div>

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            
            <div className="overflow-y-auto">
              {/* App Drawer Header */}
              <div className="p-5 bg-gradient-to-r from-[#C21A27] to-[#a5131f] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white text-[#C21A27] font-black text-base flex items-center justify-center shadow">
                    GS
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase">GirlStyle® App</h3>
                    <p className="text-[10px] text-white/80 font-medium">Thời Trang Nữ Trẻ Trung</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Customer Info Badge / Auth Trigger */}
              <div className="p-4 bg-[#EDE8E2]/50 border-b border-[#EDE8E2]">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-black">{user.name}</p>
                      <p className="text-[10px] text-black/60">{user.phone}</p>
                    </div>
                    {user.role !== 'customer' && (
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="px-2.5 py-1 bg-black text-white text-[10px] font-bold rounded">
                        Admin
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openAuthModal('login')}
                      className="flex-1 py-2.5 bg-[#C21A27] text-white text-xs font-black rounded-xl shadow uppercase tracking-wider flex items-center justify-center gap-1"
                    >
                      <LogIn className="w-3.5 h-3.5" /> Đăng Nhập
                    </button>
                    <button
                      onClick={() => openAuthModal('register')}
                      className="flex-1 py-2.5 bg-black text-white text-xs font-black rounded-xl shadow uppercase tracking-wider"
                    >
                      Đăng Ký
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Links */}
              <nav className="p-3 space-y-1 text-xs font-black">
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#EDE8E2]/60 text-black active:bg-[#EDE8E2]"
                >
                  <div className="flex items-center gap-3">
                    <Grid className="w-4 h-4 text-[#C21A27]" />
                    <span>Sản phẩm</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-black/40" />
                </Link>

                <Link
                  href="/lookbook"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#EDE8E2]/60 text-black active:bg-[#EDE8E2]"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#C21A27]" />
                    <span>Bộ sưu tập</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-black/40" />
                </Link>

                <Link
                  href="/products?isHot=true"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#EDE8E2]/60 text-black active:bg-[#EDE8E2]"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-[#C21A27]" />
                    <span className="flex items-center gap-1">
                      Xu hướng <span className="px-1.5 py-0.5 text-[9px] bg-[#C21A27] text-white rounded font-black">HOT</span>
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-black/40" />
                </Link>

                <Link
                  href="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#EDE8E2]/60 text-black active:bg-[#EDE8E2]"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-[#C21A27]" />
                    <span>Blog</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-black/40" />
                </Link>

                <Link
                  href="/lookbook"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#EDE8E2]/60 text-black active:bg-[#EDE8E2]"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-[#C21A27]" />
                    <span>Mix match</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-black/40" />
                </Link>

                <a
                  href="tel:19006868"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#EDE8E2]/60 text-black active:bg-[#EDE8E2]"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#C21A27]" />
                    <span>Liên hệ Hotline 1900 6868</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-black/40" />
                </a>

                <Link
                  href="/feedback"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-rose-50 text-[#C21A27] font-black"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquareHeart className="w-4 h-4 text-[#C21A27]" />
                    <span>Góp ý & Phản hồi</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#C21A27]" />
                </Link>
              </nav>
            </div>

            {/* App Drawer Footer */}
            <div className="p-4 border-t border-[#EDE8E2] text-center bg-[#EDE8E2]/30">
              <p className="text-[10px] text-black/60 font-bold">GirlStyle® Fashion App v1.0</p>
            </div>

          </div>
        </div>
      )}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
