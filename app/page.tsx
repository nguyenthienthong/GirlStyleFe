'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import FlashSaleSection from '../components/FlashSaleSection';
import VoucherListSection from '../components/VoucherListSection';
import SubBannersSection from '../components/SubBannersSection';
import { Sparkles, ArrowRight, Star, MessageSquare, Send, CheckCircle2, Zap, Layers, Flame, Sparkle, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchApi } from '../lib/api';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [heroBanners, setHeroBanners] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Form feedback state
  const [feedbackForm, setFeedbackForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    type: 'gop_y',
    message: ''
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchApi('/products?isHot=true&limit=8')
      .then((data) => setFeaturedProducts(data.products || []))
      .catch(console.error);

    fetchApi('/products?isNewArrival=true&limit=8')
      .then((data) => setNewArrivalProducts(data.products || []))
      .catch(console.error);

    fetchApi('/categories').then((data) => setCategories(data.categories || [])).catch(console.error);
    
    // Fetch ONLY hero_slide type banners for the main slider
    fetchApi('/banners?type=hero_slide')
      .then((data) => {
        const filtered = (data.banners || []).filter((b: any) => (b.type || 'hero_slide') === 'hero_slide' && b.active !== false);
        setHeroBanners(filtered);
      })
      .catch(console.error);

    fetchApi('/reviews').then((data) => setReviews(data.reviews || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBanners]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.customerName || !feedbackForm.phone || !feedbackForm.message) {
      alert('Vui lòng nhập Tên, Số điện thoại và Nội dung góp ý!');
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      await fetchApi('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedbackForm)
      });
      setFeedbackSubmitted(true);
      setFeedbackForm({ customerName: '', phone: '', email: '', type: 'gop_y', message: '' });
      setTimeout(() => setFeedbackSubmitted(false), 5000);
    } catch (e: any) {
      alert(e.message || 'Gửi góp ý thất bại!');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const displayBanners = heroBanners.length > 0 ? heroBanners : [
    { _id: 'b1', imageUrl: '/products/silk_cocktail_dress.jpg', linkUrl: '/products' },
    { _id: 'b2', imageUrl: '/products/korean_voile_top.jpg', linkUrl: '/products' }
  ];

  return (
    <div className="space-y-16 pb-16 bg-white">
      
      {/* 1. HERO BANNER SLIDE - STRICTLY ONLY HERO_SLIDE BANNERS */}
      <section className="relative w-full h-[480px] sm:h-[620px] md:h-[720px] lg:h-[780px] bg-[#EDE8E2] overflow-hidden group">
        
        {/* Sliding Banner Track */}
        <div
          className="flex w-full h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeBannerIndex * 100}%)` }}
        >
          {displayBanners.map((banner, idx) => (
            <div key={banner._id || idx} className="w-full h-full shrink-0 relative">
              <Link href={banner.linkUrl || '/products'} className="block w-full h-full">
                <img
                  src={banner.imageUrl}
                  alt={banner.title || 'Hero Banner'}
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Left / Right Slide Arrow Controls on Hover */}
        {displayBanners.length > 1 && (
          <>
            <button
              onClick={() => setActiveBannerIndex((prev) => (prev === 0 ? displayBanners.length - 1 : prev - 1))}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-black shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20"
              title="Banner trước"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3px]" />
            </button>

            <button
              onClick={() => setActiveBannerIndex((prev) => (prev + 1) % displayBanners.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-black shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20"
              title="Banner kế tiếp"
            >
              <ChevronRight className="w-6 h-6 stroke-[3px]" />
            </button>
          </>
        )}

        {/* Slide Indicator Dots */}
        {displayBanners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            {displayBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBannerIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  activeBannerIndex === idx ? 'w-8 bg-[#C21A27]' : 'w-2.5 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 1.5 SUB BANNERS SECTION DIRECTLY BELOW HERO BANNER SLIDER */}
      <SubBannersSection />

      {/* 2. CATEGORY NAVIGATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#C21A27]">DANH MỤC MUA SẮM</span>
          <h2 className="text-2xl md:text-3xl font-black text-black mt-1">Tìm Kiếm Theo Phong Cách</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat._id}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-48 rounded-2xl overflow-hidden border-2 border-[#EDE8E2] shadow-md hover:shadow-2xl hover:border-[#C21A27] transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/40 to-transparent p-4 flex flex-col justify-end text-black">
                <h3 className="text-base font-black group-hover:text-[#C21A27] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-black/70 line-clamp-1 font-bold">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FLASH SALE / ƯU ĐÃI CÓ GIỚI HẠN */}
      <FlashSaleSection />

      {/* 3.5 VOUCHER LIST SECTION BELOW FLASH SALE */}
      <VoucherListSection />

      {/* 4. SECTION 1: SẢN PHẨM NỔI BẬT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b-2 border-[#EDE8E2] pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#C21A27] flex items-center gap-1">
              <Flame className="w-4 h-4 fill-[#C21A27] text-[#C21A27]" /> BỘ SỰ TẬP BÁN CHẠY
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-black mt-1">Sản Phẩm Nổi Bật</h2>
          </div>

          <Link
            href="/products?isHot=true"
            className="text-xs font-extrabold text-[#C21A27] hover:text-[#a5131f] flex items-center gap-1 hover:underline uppercase tracking-wider"
          >
            Xem tất cả Hot Trend <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-4 text-center py-8 text-xs text-black/60 font-bold">
              Đang tải danh sách sản phẩm nổi bật...
            </div>
          )}
        </div>
      </section>

      {/* 5. SECTION 2: SẢN PHẨM MỚI LÊN KỆ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b-2 border-[#EDE8E2] pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#C21A27] flex items-center gap-1">
              <Sparkle className="w-4 h-4 fill-[#C21A27] text-[#C21A27]" /> BỘ SỰ TẬP MỚI NHẤT
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-black mt-1">Sản Phẩm Mới Lên Kệ</h2>
          </div>

          <Link
            href="/products?isNewArrival=true"
            className="text-xs font-extrabold text-[#C21A27] hover:text-[#a5131f] flex items-center gap-1 hover:underline uppercase tracking-wider"
          >
            Xem tất cả Hàng Mới Về <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newArrivalProducts.length > 0 ? (
            newArrivalProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-4 text-center py-8 text-xs text-black/60 font-bold">
              Đang cập nhật hàng mới lên kệ...
            </div>
          )}
        </div>
      </section>

      {/* 6. AI TRY-ON & MIX MATCH HIGHLIGHT SECTION */}
      <section className="bg-[#EDE8E2] text-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#C21A27] text-white rounded-full font-black text-xs uppercase tracking-widest shadow">
              <Sparkles className="w-4 h-4" /> TÍNH NĂNG AI TRY-ON
            </span>

            <h2 className="text-3xl md:text-4xl font-black leading-tight text-black">
              BỘ SỰ TẬP MẪU AI TRY-ON & GỢI Ý MIX OUTFIT TRỌN BỘ
            </h2>

            <p className="text-sm text-black/80 leading-relaxed font-medium">
              Khám phá trải nghiệm thời trang thế hệ mới. Hình ảnh người mẫu do công nghệ AI tạo ra giúp nàng dễ dàng hình dung phom dáng thực tế và tự tin lựa chọn set đồ hoàn hảo nhất.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#EDE8E2] shadow-sm">
                <Layers className="w-6 h-6 text-[#C21A27] mb-2" />
                <h4 className="text-sm font-black text-black">Mix & Match Cực Chuẩn</h4>
                <p className="text-xs text-black/70 mt-1 font-medium">Gợi ý sẵn áo + chân váy + túi xách đi kèm</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EDE8E2] shadow-sm">
                <Sparkles className="w-6 h-6 text-[#C21A27] mb-2" />
                <h4 className="text-sm font-black text-black">Nhãn Ảnh do AI tạo</h4>
                <p className="text-xs text-black/70 mt-1 font-medium">Minh bạch 100% hình ảnh trình diễn</p>
              </div>
            </div>

            <Link
              href="/products?isAiGenerated=true"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C21A27] hover:bg-[#a5131f] text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg transition-all glow-red"
            >
              Trải nghiệm Bộ Sưu Tập AI ngay
            </Link>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white group">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
              alt="AI Try-on Lookbook"
              className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 right-4 px-3 py-1 bg-white text-black text-xs font-black rounded-full border border-black/10 flex items-center gap-1.5 shadow">
              <Sparkles className="w-3.5 h-3.5 text-[#C21A27]" /> Ảnh do AI tạo
            </div>
          </div>

        </div>
      </section>

      {/* 7. MỤC ĐÁNH GIÁ & FEEDBACK THỰC TẾ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#C21A27]">PHẢN HỒI THỰC TẾ</span>
          <h2 className="text-2xl md:text-3xl font-black text-black mt-1">Khách Hàng Nói Gì Về GirlStyle?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.length > 0 ? (
            reviews.slice(0, 3).map((rev) => (
              <div key={rev._id} className="p-6 rounded-2xl bg-white border-2 border-[#EDE8E2] shadow-sm hover:shadow-md hover:border-[#C21A27] transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={rev.customerName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#C21A27] shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-black text-black">{rev.customerName}</h4>
                      <div className="flex items-center gap-1 text-[#C21A27]">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#C21A27]" />
                        ))}
                        <span className="text-[10px] text-black font-extrabold ml-1 bg-[#EDE8E2] px-2 py-0.5 rounded">Đã Mua Hàng</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#111111]/80 italic leading-relaxed font-medium">"{rev.content}"</p>
                </div>

                {rev.image && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#EDE8E2] shrink-0">
                    <img src={rev.image} alt="Feedback picture" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-xs text-black/60 py-8">
              Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm nhé!
            </div>
          )}
        </div>
      </section>

      {/* 8. MỤC HÒM THƯ GÓP Ý & PHẢN HỒI DỊCH VỤ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 border-4 border-[#C21A27] shadow-2xl relative overflow-hidden">
          
          <div className="text-center space-y-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#C21A27] text-white flex items-center justify-center mx-auto shadow-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-black">Hòm Thư Góp Ý & Phản Hồi Dịch Vụ</h2>
            <p className="text-xs text-black/70 max-w-md mx-auto font-medium">
              Ý kiến của nàng là động lực để GirlStyle hoàn thiện mỗi ngày. Vui lòng để lại phản hồi hoặc khiếu nại để ban quản trị hỗ trợ trực tiếp.
            </p>
          </div>

          {feedbackSubmitted ? (
            <div className="p-6 rounded-2xl bg-[#EDE8E2] border-2 border-[#C21A27] text-center space-y-3 animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-[#C21A27] mx-auto animate-bounce" />
              <h3 className="text-base font-black text-black">Gửi Ý Kiến Thành Công!</h3>
              <p className="text-xs text-black/80 font-medium">
                Cảm ơn nàng đã đóng góp ý kiến. Bộ phận CSKH GirlStyle sẽ liên hệ lại qua SĐT sớm nhất!
              </p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black mb-1">Họ & Tên của bạn *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Thị Ngọc Anh"
                    value={feedbackForm.customerName}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, customerName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#EDE8E2] text-xs focus:ring-2 focus:ring-[#C21A27] focus:outline-none bg-white text-black font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1">Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0912345678"
                    value={feedbackForm.phone}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#EDE8E2] text-xs focus:ring-2 focus:ring-[#C21A27] focus:outline-none bg-white text-black font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black mb-1">Email (Không bắt buộc)</label>
                  <input
                    type="email"
                    placeholder="email@gmail.com"
                    value={feedbackForm.email}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#EDE8E2] text-xs focus:ring-2 focus:ring-[#C21A27] focus:outline-none bg-white text-black font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1">Loại phản hồi</label>
                  <select
                    value={feedbackForm.type}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#EDE8E2] text-xs font-extrabold text-black"
                  >
                    <option value="gop_y">💡 Góp ý cải thiện dịch vụ / sản phẩm</option>
                    <option value="khieu_nai">⚠️ Phản hồi & Khiếu nại đơn hàng</option>
                    <option value="tu_van_size">👗 Tư vấn chọn Size & Outfit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Nội dung phản hồi *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập chi tiết nhận xét hoặc phản hồi của bạn..."
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#EDE8E2] text-xs focus:ring-2 focus:ring-[#C21A27] focus:outline-none bg-white text-black font-medium"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmittingFeedback}
                className="w-full py-4 bg-[#C21A27] text-[#FFFFFF] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-[#a5131f] transition-all flex items-center justify-center gap-2 glow-red"
              >
                {isSubmittingFeedback ? 'Đang gửi...' : <><Send className="w-4 h-4" /> Gửi Phản Hồi Cho GirlStyle</>}
              </button>
            </form>
          )}

        </div>
      </section>

    </div>
  );
}
