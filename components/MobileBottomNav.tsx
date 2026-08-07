'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Zap, BookOpen, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalCartCount } = useShop();

  const navItems = [
    { label: 'Trang chủ', href: '/', icon: Home },
    { label: 'Sản phẩm', href: '/products', icon: Grid },
    { label: 'Xu hướng', href: '/products?isHot=true', icon: Zap },
    { label: 'Blog', href: '/blog', icon: BookOpen },
    { label: 'Giỏ hàng', href: '/cart', icon: ShoppingBag, badge: totalCartCount },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t-2 border-[#EDE8E2] z-50 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 relative transition-all active:scale-95 ${
                isActive ? 'text-[#C21A27]' : 'text-black/60 hover:text-black'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.8px]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-[#C21A27] text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-md animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight leading-none ${isActive ? 'font-black text-[#C21A27]' : 'font-extrabold'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-[#C21A27] rounded-full mt-0.5"></span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
