'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronRight, ChevronLeft, Heart, Check, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const flashSaleProducts = [
  {
    id: 'fs1',
    code: 'GS-D05',
    brand: 'SORIA',
    name: 'Đầm xếp ly cổ V thời trang SORIA',
    price: 1200000,
    salePrice: 950000,
    discountPercent: 21,
    rating: 5,
    soldCount: 153,
    totalStock: 200,
    statusText: 'Đã bán 153 sản phẩm',
    image: '/products/pleated_midi_dress.jpg',
    colors: ['#2b3e64', '#1c1d21', '#5c5e6b'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true
  },
  {
    id: 'fs2',
    code: 'GS-D04',
    brand: 'SORIA',
    name: 'Đầm midi thanh lịch kèm thắt lưng',
    price: 1100000,
    salePrice: 890000,
    discountPercent: 20,
    rating: 5,
    soldCount: 45,
    totalStock: 100,
    statusText: 'Vừa mở bán',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    colors: ['#7ba4db', '#1c1d21'],
    sizes: ['S', 'M', 'L'],
    isNew: true
  },
  {
    id: 'fs3',
    code: 'GS-D06',
    brand: 'SORIA',
    name: 'Đầm dạo phố cổ V thời trang',
    price: 860000,
    salePrice: 790000,
    discountPercent: 8,
    rating: 5,
    soldCount: 18,
    totalStock: 50,
    statusText: 'Vừa mở bán',
    badgeText: 'MUA 2 CHỈ CÒN 999.000đ',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    colors: ['#1c2841', '#ffffff'],
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'fs4',
    code: 'GS-D07',
    brand: 'LOVINA',
    name: 'Đầm Dạ Hội Dài Xẻ Tà LOVINA',
    price: 2980000,
    salePrice: 2500000,
    discountPercent: 16,
    rating: 5,
    soldCount: 88,
    totalStock: 120,
    statusText: 'Vừa mở bán',
    image: '/products/silk_cocktail_dress.jpg',
    colors: ['#C21A27', '#ffffff'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true
  },
  {
    id: 'fs5',
    code: 'GS-A02',
    brand: 'GIRLSTYLE',
    name: 'Áo Kiểu Voan Tơ Cổ Nơ Hàn Quốc',
    price: 450000,
    salePrice: 350000,
    discountPercent: 22,
    rating: 5,
    soldCount: 102,
    totalStock: 150,
    statusText: 'Đã bán 102 sản phẩm',
    image: '/products/korean_voile_top.jpg',
    colors: ['#ffffff', '#EDE8E2'],
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'fs6',
    code: 'GS-S03',
    brand: 'GIRLSTYLE',
    name: 'Set Tweed Sang Chảnh Tiểu Thư Luxe',
    price: 990000,
    salePrice: 790000,
    discountPercent: 20,
    rating: 5,
    soldCount: 64,
    totalStock: 100,
    statusText: 'Sắp hết hàng',
    image: '/products/tweed_suit_set.jpg',
    colors: ['#C21A27'],
    sizes: ['S', 'M', 'L']
  }
];

export default function FlashSaleSection() {
  const { addToCart } = useShop();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: number }>({});
  const [likedItems, setLikedItems] = useState<{ [key: string]: boolean }>({});
  const [activeSizePopover, setActiveSizePopover] = useState<string | null>(null);

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 18,
    seconds: 7
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const formatNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  const handleAddToCart = (product: any, chosenSize: string) => {
    addToCart({
      productId: product.id,
      name: product.name,
      code: product.code || 'GS-FS',
      color: 'Standard',
      size: chosenSize,
      price: product.salePrice,
      quantity: 1,
      image: product.image
    });
    setActiveSizePopover(null);
  };

  return (
    <section className="bg-[#f5eee6] py-12 md:py-16 my-8 border-y-2 border-[#EDE8E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Title & Live Countdown Timer */}
          <div className="lg:col-span-4 text-center lg:text-left space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">
                Ưu đãi có giới hạn
              </h2>
              <p className="text-xs md:text-sm text-black/70 font-semibold mt-2">
                Nhanh lên nào! <br className="hidden lg:block" /> Sự kiện sẽ kết thúc sau
              </p>
            </div>

            {/* Countdown Boxes */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-black text-white rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black shadow-lg">
                  {formatNumber(timeLeft.hours)}
                </div>
                <span className="text-[11px] font-bold text-black mt-1">Giờ</span>
              </div>

              <span className="text-xl font-black text-black -mt-4">:</span>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-black text-white rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black shadow-lg">
                  {formatNumber(timeLeft.minutes)}
                </div>
                <span className="text-[11px] font-bold text-black mt-1">Phút</span>
              </div>

              <span className="text-xl font-black text-black -mt-4">:</span>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-black text-white rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black shadow-lg">
                  {formatNumber(timeLeft.seconds)}
                </div>
                <span className="text-[11px] font-bold text-black mt-1">Giây</span>
              </div>
            </div>
          </div>

          {/* Right Column: Carousel with Left/Right Buttons on Hover */}
          <div className="lg:col-span-8 relative group/carousel">
            
            {/* Left Hover Navigation Button */}
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-30 w-11 h-11 rounded-full bg-white/95 text-black border-2 border-[#C21A27] shadow-2xl flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#C21A27] hover:text-white"
              title="Lướt sang trái"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3px]" />
            </button>

            {/* Right Hover Navigation Button */}
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-30 w-11 h-11 rounded-full bg-white/95 text-black border-2 border-[#C21A27] shadow-2xl flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#C21A27] hover:text-white"
              title="Lướt sang phải"
            >
              <ChevronRight className="w-6 h-6 stroke-[3px]" />
            </button>

            {/* Horizontal Scrollable Track */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-3 px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {flashSaleProducts.map((p) => {
                const soldPercent = Math.min(100, Math.round((p.soldCount / p.totalStock) * 100));
                const activeColorIdx = selectedColors[p.id] || 0;
                const isLiked = likedItems[p.id] || false;
                const isPopoverOpen = activeSizePopover === p.id;

                return (
                  <div
                    key={p.id}
                    className="w-[200px] sm:w-[230px] md:w-[240px] shrink-0 bg-white rounded-2xl overflow-hidden border border-[#EDE8E2] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group/item relative"
                  >
                    {/* Top Image & Badge */}
                    <div className="relative aspect-[3/4] bg-[#EDE8E2]/40 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                      />

                      {/* LEFT RIBBON BADGE */}
                      {p.isNew && (
                        <div className="absolute top-3 -left-1.5 z-10">
                          <span className="px-3 py-1 bg-[#C21A27] text-white text-[10px] font-black rounded-tr-xl shadow-md uppercase tracking-wider block">
                            NEW
                          </span>
                          <span className="absolute left-0 -bottom-1 w-0 h-0 border-t-[5px] border-t-[#700d14] border-l-[6px] border-l-transparent"></span>
                        </div>
                      )}

                      {/* RIGHT TEARDROP DISCOUNT BADGE */}
                      {p.discountPercent > 0 && (
                        <div className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full rounded-br-none bg-[#C21A27] text-white font-black text-[10px] flex items-center justify-center shadow-lg border border-white/30 transform group-hover/item:scale-110 transition-transform">
                          -{p.discountPercent}%
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Brand */}
                        <p className="text-[10px] font-black text-black/50 uppercase tracking-wider">
                          {p.brand}
                        </p>

                        {/* Title */}
                        <h4 className="text-xs font-black text-black line-clamp-2 leading-snug group-hover/item:text-[#C21A27] transition-colors mt-0.5">
                          {p.name}
                        </h4>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5 text-amber-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>

                        {/* Price & Cart Trigger with Size Popover */}
                        <div className="mt-2 flex items-center justify-between relative">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-[#C21A27]">
                              {p.salePrice.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-[10px] text-black/40 line-through font-bold">
                              {p.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>

                          {/* SIZE SELECTION POPOVER */}
                          {isPopoverOpen && (
                            <div className="absolute bottom-full right-0 mb-2 z-40 bg-white rounded-xl shadow-2xl border-2 border-[#EDE8E2] py-2 px-2.5 flex flex-col space-y-1 min-w-[85px] animate-in fade-in zoom-in-95">
                              <div className="text-[9px] font-black text-black/40 uppercase tracking-widest text-center border-b border-[#EDE8E2] pb-1 mb-1">
                                CHỌN SIZE
                              </div>
                              {(p.sizes || ['S', 'M', 'L', 'XL']).map((sz) => (
                                <button
                                  key={sz}
                                  onClick={() => handleAddToCart(p, sz)}
                                  className="w-full py-1.5 px-3 rounded-lg text-xs font-black text-black hover:bg-[#C21A27] hover:text-white transition-colors text-center"
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Shopping Bag Button */}
                          <button
                            onClick={() => setActiveSizePopover(isPopoverOpen ? null : p.id)}
                            className={`p-2 rounded-xl transition-all shadow-sm ${
                              isPopoverOpen
                                ? 'bg-[#C21A27] text-white scale-105'
                                : 'bg-[#EDE8E2] hover:bg-[#C21A27] text-black hover:text-white'
                            }`}
                            title="Chọn size để thêm vào giỏ"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Stock Progress Bar */}
                      <div className="pt-2 border-t border-[#EDE8E2] space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-bold text-black/70">
                          <span>{p.statusText}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#EDE8E2] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-black rounded-full transition-all duration-500"
                            style={{ width: `${soldPercent}%` }}
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
