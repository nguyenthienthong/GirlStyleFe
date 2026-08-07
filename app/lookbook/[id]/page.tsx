'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, ChevronLeft, Check, ShoppingBag, ArrowLeft } from 'lucide-react';
import { fetchApi } from '../../../lib/api';
import { useShop } from '../../../context/ShopContext';

export default function LookbookDetailPage() {
  const { id } = useParams();
  const { addToCart } = useShop();

  const [combo, setCombo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Scroll ref for thumbnail carousel
  const thumbScrollRef = useRef<HTMLDivElement>(null);

  // State for item selections: { [itemIdx]: { checked: boolean, size: string, colorIndex: number } }
  const [itemSelections, setItemSelections] = useState<{ [key: number]: { checked: boolean; size: string; colorIndex: number } }>({});

  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchApi(`/mix-match/${id}`)
      .then((data) => {
        const c = data.combo;
        setCombo(c);
        if (c && c.items) {
          const initialSel: any = {};
          c.items.forEach((item: any, idx: number) => {
            initialSel[idx] = {
              checked: true,
              size: item.sizes ? item.sizes[0] : 'S',
              colorIndex: 0
            };
          });
          setItemSelections(initialSel);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleScrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbScrollRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      thumbScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs font-bold text-black/60">
        Đang tải thông tin bộ Mix & Match...
      </div>
    );
  }

  if (!combo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-black text-black">Không tìm thấy bộ Mix & Match</h2>
        <Link href="/lookbook" className="px-6 py-2.5 bg-[#C21A27] text-white text-xs font-black rounded-xl inline-block">
          Quay lại trang Mix & Match
        </Link>
      </div>
    );
  }

  // Calculate dynamic total price for checked items
  const totalPrice = combo.items ? combo.items.reduce((sum: number, item: any, idx: number) => {
    const sel = itemSelections[idx];
    if (sel && sel.checked) {
      return sum + (item.price || 0);
    }
    return sum;
  }, 0) : 0;

  // Handle batch Add to Cart
  const handleAddAllToCart = () => {
    if (!combo.items) return;
    let addedCount = 0;
    combo.items.forEach((item: any, idx: number) => {
      const sel = itemSelections[idx];
      if (sel && sel.checked) {
        const chosenColor = item.colors && item.colors[sel.colorIndex] ? item.colors[sel.colorIndex].name : 'Default';
        addToCart({
          productId: item.productId || `p_${idx}`,
          name: item.name,
          code: combo.code || 'GS-MM',
          color: chosenColor,
          size: sel.size,
          price: item.price,
          quantity: 1,
          image: item.image
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 3000);
    } else {
      alert('Vui lòng tích chọn ít nhất 1 sản phẩm để thêm vào giỏ hàng!');
    }
  };

  const galleryImages = combo.images && combo.images.length > 0 ? combo.images : [combo.image];

  return (
    <div className="min-h-screen bg-white pb-16">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#C21A27] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-black animate-in fade-in">
          <Check className="w-5 h-5 stroke-[3px]" />
          <span>Đã thêm toàn bộ sản phẩm đã chọn vào giỏ hàng!</span>
        </div>
      )}

      {/* BREADCRUMB HEADER */}
      <div className="bg-[#fdeee9] py-3 px-4 sm:px-6 lg:px-8 border-b border-[#fcdcd3]">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-black/70">
          <Link href="/" className="hover:text-[#C21A27] transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-black/40" />
          <Link href="/lookbook" className="hover:text-[#C21A27] transition-colors">Mix & Match</Link>
          <ChevronRight className="w-3.5 h-3.5 text-black/40" />
          <span className="text-[#C21A27] font-black">{combo.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: MAIN LARGE PHOTO & SCROLLABLE THUMBNAIL CAROUSEL (Matching User Screenshot) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Photo */}
            <div className="w-full h-[480px] sm:h-[540px] rounded-3xl overflow-hidden bg-[#EDE8E2]/40 border-2 border-[#EDE8E2] shadow-md">
              <img
                src={galleryImages[activeImageIndex] || combo.image}
                alt={combo.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Carousel with Right Arrow (Matching User Screenshot) */}
            {galleryImages.length > 0 && (
              <div className="relative group/thumbs">
                <div
                  ref={thumbScrollRef}
                  className="flex gap-3 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 px-1"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {galleryImages.map((imgUrl: string, idx: number) => {
                    const isActive = activeImageIndex === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-20 h-24 rounded-2xl overflow-hidden shrink-0 transition-all p-0.5 border-2 ${
                          isActive
                            ? 'border-[#C21A27] shadow-md opacity-100 scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumb ${idx}`}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Right Scroll Arrow Button (Matching Pink Chevron Box in Screenshot) */}
                {galleryImages.length > 3 && (
                  <button
                    onClick={() => handleScrollThumbnails('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-xl bg-pink-100/90 hover:bg-[#C21A27] text-[#C21A27] hover:text-white shadow-md flex items-center justify-center transition-all hover:scale-110"
                    title="Xem ảnh kế tiếp"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[3px]" />
                  </button>
                )}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: OUTFIT ITEMS COMBO SELECTOR */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Stack of item cards included in this outfit set */}
            <div className="space-y-4">
              {combo.items && combo.items.map((item: any, idx: number) => {
                const sel = itemSelections[idx] || { checked: true, size: 'S', colorIndex: 0 };

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                      sel.checked ? 'border-[#EDE8E2] bg-white shadow-sm' : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={sel.checked}
                      onChange={(e) =>
                        setItemSelections({
                          ...itemSelections,
                          [idx]: { ...sel, checked: e.target.checked }
                        })
                      }
                      className="w-4 h-4 text-[#C21A27] focus:ring-[#C21A27] accent-[#C21A27] cursor-pointer mt-1"
                    />

                    {/* Item Image */}
                    <div className="w-24 h-28 rounded-xl overflow-hidden bg-[#EDE8E2] border border-[#EDE8E2] shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Item Controls */}
                    <div className="flex-1 space-y-2">
                      <h4 className="text-sm font-black text-black">{item.name}</h4>

                      <p className="text-sm font-black text-[#C21A27]">
                        {item.price ? `${item.price.toLocaleString('vi-VN')}đ` : '169.000đ'}
                      </p>

                      {/* Size Selector Pills */}
                      {item.sizes && item.sizes.length > 0 && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-black/50">Size</label>
                          <div className="flex items-center gap-1.5">
                            {item.sizes.map((sz: string) => (
                              <button
                                key={sz}
                                onClick={() =>
                                  setItemSelections({
                                    ...itemSelections,
                                    [idx]: { ...sel, size: sz }
                                  })
                                }
                                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all border ${
                                  sel.size === sz
                                    ? 'bg-[#C21A27] text-white border-[#C21A27] shadow-sm'
                                    : 'bg-white text-black border-[#EDE8E2] hover:border-[#C21A27]'
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Color Swatch Circles */}
                      {item.colors && item.colors.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <label className="text-[10px] font-bold text-black/50">Màu sắc</label>
                          <div className="flex items-center gap-1.5">
                            {item.colors.map((c: any, cIdx: number) => {
                              const isSelected = sel.colorIndex === cIdx;
                              const isWhiteHex = c.hex?.toLowerCase() === '#ffffff' || c.hex?.toLowerCase() === '#fff';
                              return (
                                <button
                                  key={cIdx}
                                  onClick={() =>
                                    setItemSelections({
                                      ...itemSelections,
                                      [idx]: { ...sel, colorIndex: cIdx }
                                    })
                                  }
                                  title={c.name}
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all border ${
                                    isWhiteHex ? 'border-black/30' : 'border-transparent'
                                  } ${isSelected ? 'scale-110 shadow-sm ring-2 ring-[#C21A27] ring-offset-1' : 'hover:scale-105 opacity-80'}`}
                                  style={{ backgroundColor: c.hex || '#000000' }}
                                >
                                  {isSelected && (
                                    <Check className={`w-3 h-3 stroke-[3px] ${isWhiteHex ? 'text-black' : 'text-white'}`} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>

            {/* TOTAL SUMMARY & ADD TO CART BUTTON */}
            <div className="p-6 bg-[#EDE8E2]/40 rounded-3xl border-2 border-[#EDE8E2] space-y-4 text-center">
              <div>
                <p className="text-xs font-extrabold text-black/60">Tạm tính:</p>
                <p className="text-2xl md:text-3xl font-black text-[#C21A27] mt-1">
                  {totalPrice.toLocaleString('vi-VN')}đ
                </p>
              </div>

              <button
                onClick={handleAddAllToCart}
                className="w-full py-4 bg-[#C21A27] hover:bg-[#a5131f] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all glow-red flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" /> Thêm vào giỏ
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
