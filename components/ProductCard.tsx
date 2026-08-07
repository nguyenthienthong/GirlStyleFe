'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, Eye, Heart, Check, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export interface ProductProps {
  _id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  salePrice?: number;
  occasion?: string;
  colors: Array<{ colorName: string; hex: string; mainImage: string }>;
  sizes: string[];
  isHot?: boolean;
  isNewArrival?: boolean;
  isAiGenerated?: boolean;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart } = useShop();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const activeColor = product.colors && product.colors.length > 0
    ? product.colors[selectedColorIndex]
    : { colorName: 'Đặc biệt', hex: '#C21A27', mainImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80' };

  const currentImage = activeColor.mainImage || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80';

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowSizeSelector(false);
      }
    };
    if (showSizeSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSizeSelector]);

  const handleSelectSizeAndAddToCart = (chosenSize: string) => {
    addToCart({
      productId: product._id,
      name: product.name,
      code: product.code,
      color: activeColor.colorName,
      size: chosenSize,
      price: product.salePrice || product.price,
      quantity: 1,
      image: currentImage
    });
    setShowSizeSelector(false);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-[#EDE8E2] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#EDE8E2] transition-all duration-300 flex flex-col justify-between active:scale-[0.99]">
      
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EDE8E2]/40">
        <Link href={`/products/${product._id}`}>
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* LEFT RIBBON BADGE (Matching User Screenshot - Ribbon with fold) */}
        <div className="absolute top-3 -left-1.5 z-10 flex flex-col gap-1 items-start">
          {product.isNewArrival && (
            <div className="relative">
              <span className="px-3 py-1 bg-[#C21A27] text-white text-[10px] font-black rounded-tr-xl shadow-md uppercase tracking-wider block">
                NEW
              </span>
              <span className="absolute left-0 -bottom-1 w-0 h-0 border-t-[5px] border-t-[#700d14] border-l-[6px] border-l-transparent"></span>
            </div>
          )}

          {product.isHot && !product.isNewArrival && (
            <div className="relative">
              <span className="px-3 py-1 bg-black text-white text-[10px] font-black rounded-tr-xl shadow-md uppercase tracking-wider block">
                HOT
              </span>
              <span className="absolute left-0 -bottom-1 w-0 h-0 border-t-[5px] border-t-black/80 border-l-[6px] border-l-transparent"></span>
            </div>
          )}

          {product.isAiGenerated && (
            <div className="relative mt-0.5">
              <span className="px-2.5 py-0.5 bg-black/90 text-white text-[8px] font-black rounded-tr-lg shadow-md uppercase tracking-wider flex items-center gap-0.5 border-r border-t border-white/20">
                <Sparkles className="w-2.5 h-2.5 text-[#C21A27]" /> AI MODEL
              </span>
              <span className="absolute left-0 -bottom-1 w-0 h-0 border-t-[4px] border-t-black border-l-[5px] border-l-transparent"></span>
            </div>
          )}
        </div>

        {/* RIGHT TEARDROP DISCOUNT BADGE (-30% Badge Matching User Screenshot) */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full rounded-br-none bg-[#C21A27] text-white font-black text-[10px] md:text-[11px] flex items-center justify-center shadow-lg border border-white/30 transform group-hover:scale-110 transition-transform">
            -{discountPercent}%
          </div>
        )}

        {/* Quick View Button */}
        <div className="absolute inset-x-2 bottom-2 md:inset-x-3 md:bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/products/${product._id}`}
            className="w-full py-2 bg-black/90 backdrop-blur-sm text-white font-extrabold text-[11px] md:text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-[#C21A27] transition-colors text-center flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" /> Xem chi tiết
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-3 md:p-4 flex flex-col flex-1 justify-between space-y-2.5">
        
        <div>
          {/* Category & Code */}
          <div className="flex items-center justify-between text-[10px] md:text-[11px] text-black/50 font-extrabold mb-0.5">
            <span>{product.category}</span>
            <span>SKU: {product.code}</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product._id}`}>
            <h3 className="text-xs md:text-sm font-black text-black line-clamp-2 hover:text-[#C21A27] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Minimal Color Swatches & Wishlist Heart */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              {product.colors.map((c, idx) => {
                const isSelected = selectedColorIndex === idx;
                const isWhiteHex = c.hex?.toLowerCase() === '#ffffff' || c.hex?.toLowerCase() === '#fff';
                
                return (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColorIndex(idx);
                    }}
                    title={c.colorName}
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all border ${
                      isWhiteHex ? 'border-black/20' : 'border-transparent'
                    } ${isSelected ? 'scale-110 shadow-sm' : 'hover:scale-105 opacity-80'}`}
                    style={{ backgroundColor: c.hex || '#000000' }}
                  >
                    {isSelected && (
                      <Check className={`w-2.5 h-2.5 stroke-[3px] ${isWhiteHex ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Heart Wishlist Icon */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className="text-black/40 hover:text-[#C21A27] transition-colors p-1"
              title="Yêu thích"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#C21A27] text-[#C21A27]' : ''}`} />
            </button>
          </div>
        )}

        {/* Price & Add To Cart Button with Size Selector Popover */}
        <div className="pt-2 border-t border-[#EDE8E2] flex items-center justify-between relative" ref={popoverRef}>
          <div className="flex flex-col">
            {product.salePrice ? (
              <>
                <span className="text-sm md:text-base font-black text-[#C21A27]">
                  {product.salePrice.toLocaleString('vi-VN')}đ
                </span>
                <span className="text-[10px] md:text-[11px] text-black/40 line-through -mt-1 font-bold">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
              </>
            ) : (
              <span className="text-sm md:text-base font-black text-black">
                {product.price.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>

          {/* SIZE SELECTION POPOVER MENU (Matching User Screenshot) */}
          {showSizeSelector && (
            <div className="absolute bottom-full right-0 mb-2 z-40 bg-white rounded-xl shadow-2xl border-2 border-[#EDE8E2] py-2 px-2.5 flex flex-col space-y-1 min-w-[85px] animate-in fade-in zoom-in-95">
              <div className="text-[9px] font-black text-black/40 uppercase tracking-widest text-center border-b border-[#EDE8E2] pb-1 mb-1">
                CHỌN SIZE
              </div>
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => handleSelectSizeAndAddToCart(sz)}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-black text-black hover:bg-[#C21A27] hover:text-white transition-colors text-center"
                >
                  {sz}
                </button>
              ))}
            </div>
          )}

          {/* Shopping Bag Trigger Button */}
          <button
            onClick={() => setShowSizeSelector(!showSizeSelector)}
            className={`p-2 rounded-xl transition-all shadow-sm ${
              showSizeSelector
                ? 'bg-[#C21A27] text-white shadow-md scale-105'
                : 'bg-[#EDE8E2] hover:bg-[#C21A27] text-black hover:text-white'
            }`}
            title="Chọn size để thêm vào giỏ"
          >
            <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
