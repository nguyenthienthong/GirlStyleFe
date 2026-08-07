import './globals.css';
import React from 'react';
import { ShopProvider } from '../context/ShopContext';
import ClientLayoutWrapper from '../components/ClientLayoutWrapper';

export const metadata = {
  title: 'GirlStyle Fashion | Thời Trang Nữ Trẻ Trung & Tôn Dáng',
  description: 'Thương hiệu thời trang nữ cao cấp: Đầm lụa đi tiệc, áo voan công sở, set tweed tiểu thư. Mua sắm dễ dàng, thanh toán VietQR tự động.',
  icons: {
    icon: '/logo-favicon.jpg',
    shortcut: '/logo-favicon.jpg',
    apple: '/logo-favicon.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen flex flex-col justify-between selection:bg-[#C21A27] selection:text-white bg-white">
        <ShopProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </ShopProvider>
      </body>
    </html>
  );
}
