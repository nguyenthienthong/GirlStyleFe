'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MapPin, Phone, Mail, Instagram, Facebook, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-black pt-16 pb-12 border-t-4 border-[#C21A27]">
      
      {/* Brand Value Props */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-6 rounded-2xl bg-[#EDE8E2]/50 border-2 border-[#EDE8E2]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#C21A27]/10 text-[#C21A27] flex items-center justify-center">
              <Truck className="w-6 h-6 text-[#C21A27]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-black">Giao Hàng Toàn Quốc</h4>
              <p className="text-xs text-black/70 font-medium">Freeship đơn từ 400.000đ</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#C21A27]/10 text-[#C21A27] flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-[#C21A27]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-black">Đổi Hàng Dễ Dàng</h4>
              <p className="text-xs text-black/70 font-medium">Đổi trả trong vòng 7 ngày</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#C21A27]/10 text-[#C21A27] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#C21A27]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-black">Chất Lượng Cam Kết</h4>
              <p className="text-xs text-black/70 font-medium">Hình ảnh thật 100% người mẫu mặc</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#C21A27]/10 text-[#C21A27] flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[#C21A27]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-black">Thanh Toán Auto VietQR</h4>
              <p className="text-xs text-black/70 font-medium">Tự động duyệt đơn nhanh chóng</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="p-1 rounded-xl inline-block">
              <img src="/logo.png?v=999" alt="GIRLSTYLE®" className="h-12 md:h-14 w-auto object-contain" />
            </div>
            <p className="text-xs leading-relaxed text-black/80 font-medium">
              Thương hiệu thời trang nữ trẻ trung, hiện đại và tôn dáng. Nơi biến mỗi khoảnh khắc của nàng trở nên rạng rỡ và tự tin nhất.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-[#EDE8E2] text-black hover:text-white hover:bg-[#C21A27] flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#EDE8E2] text-black hover:text-white hover:bg-[#C21A27] flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Category Links */}
          <div>
            <h4 className="text-sm font-black text-black uppercase tracking-wider mb-4 border-l-4 border-[#C21A27] pl-3">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-black/80">
              <li><Link href="/products?category=vay-dam" className="hover:text-[#C21A27] transition-colors">Đầm Lụa & Váy Đi Tiệc</Link></li>
              <li><Link href="/products?category=ao" className="hover:text-[#C21A27] transition-colors">Áo Sơ Mi & Áo Voan Kiểu</Link></li>
              <li><Link href="/products?category=quan-vay" className="hover:text-[#C21A27] transition-colors">Chân Váy Xếp Ly & Quần Hack Dáng</Link></li>
              <li><Link href="/products?category=set-do" className="hover:text-[#C21A27] transition-colors">Set Tweed Sang Chảnh</Link></li>
              <li><Link href="/products?isHot=true" className="hover:text-[#C21A27] transition-colors">Bộ Sưu Tập Hot Trend</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="text-sm font-black text-black uppercase tracking-wider mb-4 border-l-4 border-[#C21A27] pl-3">
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-black/80">
              <li><Link href="/feedback" className="hover:text-[#a5131f] transition-colors font-extrabold text-[#C21A27]">Gửi Ý Kiến & Phản Hồi Dịch Vụ</Link></li>
              <li><Link href="/blog" className="hover:text-[#C21A27] transition-colors">Hướng Dẫn Phối Đồ & Chọn Size</Link></li>
              <li><a href="#" className="hover:text-[#C21A27] transition-colors">Chính Sách Bảo Hành & Đổi Trả</a></li>
              <li><a href="#" className="hover:text-[#C21A27] transition-colors">Chính Sách Vận Chuyển</a></li>
              <li><a href="#" className="hover:text-[#C21A27] transition-colors">Bảo Mật Thông Tin</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Hotline */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-black uppercase tracking-wider mb-4 border-l-4 border-[#C21A27] pl-3">
              Liên Hệ Hotline
            </h4>
            <div className="flex items-start gap-2 text-xs text-black/80 font-medium">
              <MapPin className="w-4 h-4 text-[#C21A27] shrink-0 mt-0.5" />
              <span>123 Nguyễn Trãi, Phường Bến Thành, Q.1, TP. Hồ Chí Minh</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-black/80">
              <Phone className="w-4 h-4 text-[#C21A27] shrink-0" />
              <span className="font-black text-black text-sm">1900 6868 - 090.123.4567</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-black/80 font-medium">
              <Mail className="w-4 h-4 text-[#C21A27] shrink-0" />
              <span>cskh@girlstyle.vn</span>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t-2 border-[#EDE8E2] text-center text-xs text-black/60 flex flex-col md:flex-row items-center justify-between gap-4 font-bold">
          <p>© 2026 GIRLSTYLE®. All rights reserved. Designed for stylish women.</p>
          <div className="flex items-center gap-1 text-black font-black">
            <span>Style with</span>
            <Heart className="w-3.5 h-3.5 text-[#C21A27] fill-[#C21A27]" />
            <span>GirlStyle</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
