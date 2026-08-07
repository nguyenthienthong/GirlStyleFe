'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { fetchApi } from '../lib/api';

export default function SubBannersSection() {
  const [subBanners, setSubBanners] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/banners?type=sub_banner')
      .then((data) => {
        if (data.banners && data.banners.length > 0) {
          setSubBanners(data.banners.filter((b: any) => b.active !== false));
        }
      })
      .catch(console.error);
  }, []);

  const banner1 = subBanners[0] || {
    title: 'BIG SALE UP TO 50% OFF',
    subtitle: 'ONLY STORE & ONLINE',
    imageUrl: '',
    linkUrl: '/products?isHot=true'
  };

  const banner2 = subBanners[1] || {
    title: 'FREESHIP TOÀN QUỐC',
    subtitle: 'KHI ĐẶT HÀNG TẠI WEBSITE',
    imageUrl: '',
    linkUrl: '/products'
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT SUB-BANNER: BIG SALE */}
        <Link
          href={banner1.linkUrl || '/products?isHot=true'}
          className="group relative bg-[#f8f8f8] rounded-3xl p-6 sm:p-8 border-2 border-[#EDE8E2] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between items-center text-center group"
        >
          {banner1.imageUrl ? (
            <img
              src={banner1.imageUrl}
              alt={banner1.title}
              className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <>
              {/* Background Decorative Dots & Stars */}
              <div className="absolute top-3 left-4 text-rose-500 flex gap-1 opacity-60">
                <span className="text-xs">★</span>
                <span className="text-sm">★</span>
              </div>
              <div className="absolute bottom-3 right-4 text-black flex gap-1 opacity-40">
                <span className="text-xs">★</span>
                <span className="text-sm">★</span>
              </div>

              <div className="w-full max-w-sm space-y-2 border-2 border-black p-3 bg-white rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-500">
                {/* Top Red Header */}
                <div className="bg-[#C21A27] text-white py-3 px-4 rounded-xl shadow">
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider font-sans">
                    {banner1.title || 'BIG SALE'}
                  </h3>
                </div>

                {/* Bottom Black Box */}
                <div className="bg-black text-white py-2 px-4 rounded-xl">
                  <p className="text-sm sm:text-base font-black uppercase tracking-widest">
                    UP TO 50% OFF
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-[11px] font-black text-black uppercase tracking-widest border-t-2 border-black pt-1">
                  {banner1.subtitle || 'ONLY STORE & ONLINE'}
                </span>
              </div>
            </>
          )}
        </Link>

        {/* RIGHT SUB-BANNER: FREESHIP */}
        <Link
          href={banner2.linkUrl || '/products'}
          className="group relative bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EDE8E2] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex items-center justify-center text-center"
        >
          {banner2.imageUrl ? (
            <img
              src={banner2.imageUrl}
              alt={banner2.title}
              className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="relative w-full max-w-sm py-8 px-6 bg-gradient-to-r from-[#C21A27] via-[#b21622] to-[#C21A27] rounded-3xl shadow-xl border-4 border-black group-hover:scale-105 transition-transform duration-500 flex flex-col items-center justify-center text-white space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Truck className="w-6 h-6 animate-pulse" />
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
                  {banner2.title || 'FREESHIP'}
                </h3>
              </div>

              <div className="border border-dashed border-white/80 px-4 py-1 rounded-lg">
                <p className="text-[11px] sm:text-xs font-black uppercase tracking-widest">
                  {banner2.subtitle || 'KHI ĐẶT HÀNG TẠI WEBSITE'}
                </p>
              </div>
            </div>
          )}
        </Link>

      </div>
    </section>
  );
}
