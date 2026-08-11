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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 relative z-30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT SUB-BANNER: BIG SALE */}
        <Link
          href={banner1.linkUrl || '/products?isHot=true'}
          className="group relative bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-center items-center text-center group min-h-[200px]"
        >
          {banner1.imageUrl ? (
            <img
              src={banner1.imageUrl}
              alt={banner1.title}
              className="w-full h-full max-h-[300px] object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="p-4 space-y-2">
              {/* Background Decorative Dots & Stars */}
              <div className="w-full max-w-sm space-y-2 border-2 border-white p-3 bg-white rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-500">
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
                <span className="text-[11px] font-black text-white uppercase tracking-widest border-t-2 border-white pt-1">
                  {banner1.subtitle || 'ONLY STORE & ONLINE'}
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* RIGHT SUB-BANNER: FREESHIP */}
        <Link
          href={banner2.linkUrl || '/products'}
          className="group relative bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex items-center justify-center text-center min-h-[200px]"
        >
          {banner2.imageUrl ? (
            <img
              src={banner2.imageUrl}
              alt={banner2.title}
              className="w-full h-full max-h-[300px] object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500"
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
