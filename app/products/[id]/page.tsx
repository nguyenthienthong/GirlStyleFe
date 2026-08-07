'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, Heart, Sparkles, Ruler, CheckCircle2, Flame, ArrowRight, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import SizeChartModal from '../../../components/SizeChartModal';
import ProductCard from '../../../components/ProductCard';
import { fetchApi } from '../../../lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { addToCart } = useShop();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Scroll ref for thumbnail carousel
  const thumbScrollRef = useRef<HTMLDivElement>(null);

  // Selection state
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetchApi(`/products/${productId}`)
      .then((data) => {
        setProduct(data.product);
        if (data.product?.colors?.[0]?.sizes?.length > 0) {
          setSelectedSize(data.product.colors[0].sizes[0]);
        } else if (data.product?.sizes?.length > 0) {
          setSelectedSize(data.product.sizes[0]);
        }

        // Fetch Related Products based on Category
        if (data.product?.category) {
          fetchApi(`/products?category=${encodeURIComponent(data.product.category)}&limit=5`)
            .then((relData) => {
              const filtered = (relData.products || []).filter((p: any) => p._id !== data.product._id);
              setRelatedProducts(filtered.slice(0, 4));
            })
            .catch(console.error);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleScrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbScrollRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      thumbScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs font-bold text-black/60">
        Đang tải thông tin sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-black text-black">Không tìm thấy sản phẩm!</h2>
        <Link href="/products" className="inline-block px-6 py-3 bg-[#C21A27] text-white text-xs font-black rounded-full shadow">
          Quay lại danh mục sản phẩm
        </Link>
      </div>
    );
  }

  const activeColor = product.colors?.[selectedColorIndex] || {
    hex: '#C21A27',
    colorName: 'Đỏ Đô Brand',
    sizes: ['S', 'M', 'L', 'XL'],
    sizeStocks: [
      { size: 'S', stock: 15 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 2 },
      { size: 'XL', stock: 10 }
    ],
    mainImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80']
  };

  // Sizes specific to the currently selected color
  const colorSizes = (activeColor.sizes && activeColor.sizes.length > 0) ? activeColor.sizes : (product.sizes || ['S', 'M', 'L', 'XL']);

  // Get stock for currently selected Color + Size combination
  let currentStock = 10;
  if (activeColor.sizeStocks && Array.isArray(activeColor.sizeStocks)) {
    const found = activeColor.sizeStocks.find((st: any) => st.size === selectedSize);
    if (found) currentStock = found.stock;
  } else if (activeColor.sizeStocks && typeof activeColor.sizeStocks === 'object') {
    if (activeColor.sizeStocks[selectedSize] !== undefined) {
      currentStock = activeColor.sizeStocks[selectedSize];
    }
  } else if (product.inventory && Array.isArray(product.inventory)) {
    const found = product.inventory.find((inv: any) => inv.colorName === activeColor.colorName && inv.size === selectedSize);
    if (found) currentStock = found.stock;
  }

  const imagesList = activeColor.images?.length > 0 ? activeColor.images : [activeColor.mainImage];
  const currentDisplayImage = imagesList[selectedImageIndex] || activeColor.mainImage;

  const handleColorSelect = (idx: number) => {
    setSelectedColorIndex(idx);
    setSelectedImageIndex(0);

    // Auto update selected size if current selected size is not available in new color
    const newColor = product.colors[idx];
    const newColorSizes = (newColor?.sizes && newColor.sizes.length > 0) ? newColor.sizes : (product.sizes || ['S', 'M', 'L', 'XL']);
    if (!newColorSizes.includes(selectedSize)) {
      setSelectedSize(newColorSizes[0] || 'M');
    }
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (currentStock <= 0) {
      alert('Sản phẩm Size ' + selectedSize + ' màu này hiện đang tạm hết hàng!');
      return;
    }

    addToCart({
      productId: product._id,
      name: product.name,
      code: product.code,
      color: activeColor.colorName || 'Màu sắc',
      size: selectedSize || colorSizes[0] || 'M',
      price: product.salePrice || product.price,
      quantity: Math.min(quantity, currentStock),
      image: currentDisplayImage
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Toast notification */}
      {addedToast && (
        <div className="fixed top-24 right-4 z-50 bg-[#C21A27] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-black animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Đã thêm {quantity} x {product.name} vào giỏ hàng!</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="text-xs font-bold text-black/60 flex items-center gap-2">
        <Link href="/" className="hover:text-[#C21A27]">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#C21A27]">Sản phẩm</Link>
        <span>/</span>
        <span className="text-black font-black">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Product Gallery & Scrollable Thumbnail Carousel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden border-2 border-[#EDE8E2] bg-[#EDE8E2]/40 shadow-lg">
            <img
              src={currentDisplayImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isAiGenerated && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-black rounded-full border border-white/30 flex items-center gap-1.5 shadow">
                <Sparkles className="w-3.5 h-3.5 text-[#C21A27]" /> Người mẫu do AI tạo
              </span>
            )}
          </div>

          {/* Gallery Thumbnails Carousel */}
          {imagesList.length > 0 && (
            <div className="relative group/thumbs">
              <div
                ref={thumbScrollRef}
                className="flex gap-3 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {imagesList.map((img: string, idx: number) => {
                  const isActive = selectedImageIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-20 h-24 rounded-2xl overflow-hidden shrink-0 transition-all p-0.5 border-2 ${
                        isActive
                          ? 'border-[#C21A27] shadow-md opacity-100 scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-xl" />
                    </button>
                  );
                })}
              </div>

              {imagesList.length > 3 && (
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

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-[#EDE8E2] text-black text-[11px] font-black rounded uppercase">
                {product.category}
              </span>
              <span className="text-xs text-black/50 font-extrabold">Mã: {product.code}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-black leading-snug">
              {product.name}
            </h1>

            {/* Price tag */}
            <div className="mt-4 flex items-baseline gap-3">
              {product.salePrice ? (
                <>
                  <span className="text-2xl md:text-3xl font-black text-[#C21A27]">
                    {product.salePrice.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-sm md:text-base text-black/40 line-through font-bold">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="px-2 py-0.5 bg-[#C21A27] text-white text-xs font-black rounded uppercase">
                    Tiết kiệm {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </span>
                </>
              ) : (
                <span className="text-2xl md:text-3xl font-black text-black">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>
          </div>

          {/* COLOR SWATCH SELECTOR */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-[#EDE8E2]">
              <label className="block text-xs font-black text-black">
                Chọn Màu Sắc:
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((c: any, idx: number) => {
                  const isSelected = selectedColorIndex === idx;
                  const isWhite = c.hex?.toLowerCase() === '#ffffff' || c.hex?.toLowerCase() === '#fff';

                  return (
                    <button
                      key={idx}
                      onClick={() => handleColorSelect(idx)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center relative ${
                        isSelected
                          ? 'border-[#C21A27] ring-4 ring-[#C21A27]/20 scale-110 shadow-md'
                          : 'border-black/20 hover:scale-105 opacity-80'
                      }`}
                      style={{ backgroundColor: c.hex || '#000000' }}
                      title={c.colorName || 'Màu sắc'}
                    >
                      {isSelected && (
                        <Check className={`w-5 h-5 stroke-[3px] ${isWhite ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* DYNAMIC PER-COLOR SIZE SELECTION */}
          {colorSizes.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-[#EDE8E2]">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-black">
                  Chọn Size (Có sẵn cho màu này):
                </label>
                <button
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-xs font-extrabold text-[#C21A27] hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-4 h-4" /> Bảng thông số Size
                </button>
              </div>

              <div className="flex items-center gap-3">
                {colorSizes.map((sz: string) => {
                  const isSelected = selectedSize === sz;

                  // Check stock for this specific size
                  let szStock = 10;
                  if (activeColor.sizeStocks && Array.isArray(activeColor.sizeStocks)) {
                    const stFound = activeColor.sizeStocks.find((st: any) => st.size === sz);
                    if (stFound) szStock = stFound.stock;
                  } else if (activeColor.sizeStocks && typeof activeColor.sizeStocks === 'object') {
                    if (activeColor.sizeStocks[sz] !== undefined) szStock = activeColor.sizeStocks[sz];
                  }

                  const isOut = szStock <= 0;

                  return (
                    <button
                      key={sz}
                      onClick={() => !isOut && setSelectedSize(sz)}
                      disabled={isOut}
                      className={`w-12 h-12 rounded-xl text-xs font-black border-2 transition-all flex flex-col items-center justify-center relative ${
                        isOut
                          ? 'border-stone-200 text-stone-300 bg-stone-100 cursor-not-allowed line-through opacity-50'
                          : isSelected
                          ? 'border-[#C21A27] bg-[#C21A27] text-white shadow-md'
                          : 'border-[#EDE8E2] text-black hover:border-black'
                      }`}
                    >
                      <span>{sz}</span>
                      {szStock > 0 && szStock <= 3 && (
                        <span className={`text-[8px] leading-none ${isSelected ? 'text-white' : 'text-[#C21A27]'}`}>
                          Còn {szStock}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* STOCK STATUS ALERT BADGE */}
              <div className="pt-1">
                {currentStock <= 0 ? (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[#C21A27] text-xs font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Màu sắc & Size <strong>{selectedSize}</strong> này tạm thời hết hàng trong kho.</span>
                  </div>
                ) : currentStock <= 3 ? (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <Flame className="w-4 h-4 text-[#C21A27] shrink-0 fill-[#C21A27]" />
                    <span>🔥 Chỉ còn lại <strong>{currentStock} sản phẩm</strong> cho Size {selectedSize}! Hãy chốt đơn ngay.</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đang có sẵn <strong>{currentStock} sản phẩm</strong> trong kho
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart Action */}
          <div className="pt-4 border-t border-[#EDE8E2] space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-[#EDE8E2] rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 text-xs font-black hover:bg-[#EDE8E2] transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-black text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                  className="px-3.5 py-2.5 text-xs font-black hover:bg-[#EDE8E2] transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className={`flex-1 py-4 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 ${
                  currentStock <= 0
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                    : 'bg-[#C21A27] hover:bg-[#a5131f] text-white glow-red'
                }`}
              >
                <ShoppingBag className="w-5 h-5" /> {currentStock <= 0 ? 'Tạm Hết Hàng' : 'Thêm Vào Giỏ Hàng'}
              </button>
            </div>

            {currentStock > 0 && (
              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="block w-full py-4 bg-black text-[#FFFFFF] text-center font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-black/90 transition-colors"
              >
                Mua Ngay - Auto VietQR ⚡
              </Link>
            )}
          </div>

          {/* Policy Guarantees */}
          <div className="p-4 rounded-2xl bg-[#EDE8E2]/50 border border-[#EDE8E2] grid grid-cols-2 gap-3 text-xs font-bold text-black/80">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C21A27]" /> Freeship đơn từ 400k
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#C21A27]" /> Đổi trả trong 7 ngày
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C21A27]" /> Kiểm tra hàng trước thanh toán
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C21A27]" /> Chuẩn phom dáng 100%
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-[#EDE8E2] space-y-2">
            <h4 className="text-xs font-black uppercase text-black">Mô tả sản phẩm & Chất liệu:</h4>
            <p className="text-xs text-black/80 leading-relaxed font-medium">
              {product.description}
            </p>
            {product.material && (
              <p className="text-xs text-black/80 font-bold">
                🧵 Chất liệu: <span className="font-normal">{product.material}</span>
              </p>
            )}
          </div>

        </div>

      </div>

      {/* RELATED PRODUCTS SECTION */}
      <section className="pt-12 border-t-2 border-[#EDE8E2]">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#C21A27] flex items-center gap-1">
              <Flame className="w-4 h-4 fill-[#C21A27] text-[#C21A27]" /> CÓ THỂ NÀNG SẼ THÍCH
            </span>
            <h2 className="text-2xl font-black text-black mt-1">Gợi Ý Sản Phẩm Tương Tự</h2>
          </div>

          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="text-xs font-extrabold text-[#C21A27] hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            Xem tất cả {product.category} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((relProd) => (
              <ProductCard key={relProd._id} product={relProd} />
            ))
          ) : (
            <div className="col-span-4 text-center py-6 text-xs text-black/60 font-bold">
              Đang tải gợi ý sản phẩm tương tự...
            </div>
          )}
        </div>
      </section>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        sizeChartType={product.sizeChartType || 'dress'}
      />

    </div>
  );
}
