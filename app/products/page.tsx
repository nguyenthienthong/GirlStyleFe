'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import { Filter, SlidersHorizontal, RotateCcw, Search, Sparkles, Check, Minus } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [selectedColorHex, setSelectedColorHex] = useState(searchParams.get('color') || '');
  const [selectedOccasion, setSelectedOccasion] = useState(searchParams.get('occasion') || '');
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const [isAiOnly, setIsAiOnly] = useState(searchParams.get('isAiGenerated') === 'true');

  // Load categories and full product list once for dynamic color extraction
  useEffect(() => {
    fetchApi('/categories').then((data) => setCategories(data.categories || [])).catch(console.error);
    fetchApi('/products').then((data) => setAllProducts(data.products || [])).catch(console.error);
  }, []);

  // Dynamically extract UNIQUE colors keyed strictly by normalized hex code (NO DUPLICATE DOTS)
  const availableColors = useMemo(() => {
    const hexMap = new Map<string, string>(); // hex -> name
    allProducts.forEach((p) => {
      if (p.colors && Array.isArray(p.colors)) {
        p.colors.forEach((c: any) => {
          if (c.hex) {
            const normalizedHex = c.hex.trim().toLowerCase();
            if (!hexMap.has(normalizedHex)) {
              hexMap.set(normalizedHex, c.colorName || 'Màu sắc');
            }
          }
        });
      }
    });
    return Array.from(hexMap.entries()).map(([hex, name]) => ({ hex, name }));
  }, [allProducts]);

  const loadProducts = () => {
    setLoading(true);
    let queryParams = new URLSearchParams();
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (selectedSize) queryParams.set('size', selectedSize);
    if (selectedColorHex) {
      queryParams.set('color', selectedColorHex);
    }
    if (selectedOccasion) queryParams.set('occasion', selectedOccasion);
    if (searchKeyword) queryParams.set('search', searchKeyword);
    if (maxPrice < 1000000) queryParams.set('maxPrice', maxPrice.toString());
    if (isAiOnly) queryParams.set('isAiGenerated', 'true');

    fetchApi(`/products?${queryParams.toString()}`)
      .then((data) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedSize, selectedColorHex, selectedOccasion, maxPrice, isAiOnly, searchKeyword]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setSelectedColorHex('');
    setSelectedOccasion('');
    setMaxPrice(1000000);
    setSearchKeyword('');
    setIsAiOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-black tracking-tight">Bộ Sưu Tập Thời Trang Nữ</h1>
        <p className="text-xs text-black/60 mt-1 font-medium">
          Khám phá những thiết kế đầm, áo, set đồ mới nhất tối ưu phom dáng dành riêng cho bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SMART FILTER SIDEBAR */}
        <aside className="space-y-6 bg-white p-6 rounded-2xl border-2 border-[#EDE8E2] shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-[#EDE8E2] pb-3">
            <h3 className="text-sm font-black text-black flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C21A27]" /> Bộ Lọc Thông Minh
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-black/50 hover:text-[#C21A27] flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3 h-3" /> Xóa bộ lọc
            </button>
          </div>

          {/* Keyword Search Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black text-black">Tìm tên / mã SKU</label>
            <div className="relative">
              <input
                type="text"
                placeholder="VD: Đầm lụa, GS-D01..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white border-2 border-[#EDE8E2] text-black focus:outline-none focus:ring-2 focus:ring-[#C21A27] font-medium"
              />
              <Search className="w-3.5 h-3.5 text-black/40 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Category Navigation */}
          <div className="space-y-2">
            <label className="text-xs font-black text-black">Danh Mục Sản Phẩm</label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                  selectedCategory === '' ? 'bg-[#C21A27] text-white' : 'text-black/80 hover:bg-[#EDE8E2]'
                }`}
              >
                Tất cả sản phẩm
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                    selectedCategory === cat.name ? 'bg-[#C21A27] text-white' : 'text-black/80 hover:bg-[#EDE8E2]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black text-black">Dịp Mặc Trang Phục</label>
            <div className="flex flex-wrap gap-2">
              {['Đi tiệc', 'Công sở', 'Dạo phố'].map((occ) => (
                <button
                  key={occ}
                  onClick={() => setSelectedOccasion(selectedOccasion === occ ? '' : occ)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border-2 ${
                    selectedOccasion === occ
                      ? 'bg-[#C21A27] text-white border-[#C21A27] shadow-sm'
                      : 'bg-white text-black border-[#EDE8E2] hover:border-[#C21A27]'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black text-black">Kích Thước (Size)</label>
            <div className="grid grid-cols-4 gap-2">
              {['S', 'M', 'L', 'XL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`py-2 rounded-xl text-xs font-black transition-all border-2 text-center ${
                    selectedSize === sz
                      ? 'bg-[#C21A27] text-white border-[#C21A27] shadow-sm'
                      : 'bg-white text-black border-[#EDE8E2] hover:border-[#C21A27]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC UNIQUE COLOR FILTER SWATCHES */}
          {availableColors.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-black">Màu sắc hiện có</label>
                <Minus className="w-4 h-4 text-black/40" />
              </div>

              <div className="flex flex-wrap gap-2.5">
                {availableColors.map((cl) => {
                  const isSelected = selectedColorHex.toLowerCase() === cl.hex.toLowerCase();
                  const isWhiteHex = cl.hex.toLowerCase() === '#ffffff' || cl.hex.toLowerCase() === '#fff';

                  return (
                    <button
                      key={cl.hex}
                      onClick={() => setSelectedColorHex(isSelected ? '' : cl.hex)}
                      title={`${cl.name} (${cl.hex})`}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all border ${
                        isWhiteHex ? 'border-black/30' : 'border-transparent'
                      } ${isSelected ? 'scale-125 shadow-md ring-2 ring-[#C21A27] ring-offset-1' : 'hover:scale-110 opacity-90'}`}
                      style={{ backgroundColor: cl.hex }}
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

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-[#EDE8E2]">
            <div className="flex justify-between items-center text-xs font-black text-black">
              <span>Mức Giá Tối Đa</span>
              <span className="text-[#C21A27]">{maxPrice.toLocaleString('vi-VN')}đ</span>
            </div>
            <input
              type="range"
              min={200000}
              max={1500000}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#C21A27] cursor-pointer"
            />
          </div>

          {/* AI Filter Toggle */}
          <div className="pt-2 border-t border-[#EDE8E2]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-black">
              <input
                type="checkbox"
                checked={isAiOnly}
                onChange={(e) => setIsAiOnly(e.target.checked)}
                className="rounded text-[#C21A27] focus:ring-[#C21A27] w-4 h-4 accent-[#C21A27]"
              />
              <Sparkles className="w-4 h-4 text-[#C21A27]" />
              <span>Chỉ hiện mẫu AI Try-on</span>
            </label>
          </div>

        </aside>

        {/* PRODUCT GRID LISTING */}
        <main className="lg:col-span-3">
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-[#EDE8E2]/60 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border-2 border-[#EDE8E2] space-y-3">
              <Filter className="w-12 h-12 text-black/30 mx-auto" />
              <h3 className="text-base font-black text-black">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-xs text-black/60 font-medium">Vui lòng thử thay đổi hoặc bỏ các tiêu chí lọc để xem thêm thiết kế khác nhé.</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#C21A27] text-white text-xs font-black rounded-xl shadow hover:bg-[#a5131f] transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
