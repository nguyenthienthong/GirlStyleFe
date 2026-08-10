'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import PromoPopup from './PromoPopup';
import MobileBottomNav from './MobileBottomNav';
import CartDrawer from './CartDrawer';
import AddToCartSuccessModal from './AddToCartSuccessModal';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="flex-grow min-h-screen bg-white">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pb-16 lg:pb-0">{children}</main>
      <Footer />
      <ChatWidget />
      <PromoPopup />
      <MobileBottomNav />
      <CartDrawer />
      <AddToCartSuccessModal />
    </>
  );
}
