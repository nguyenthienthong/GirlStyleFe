'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '../../../components/ProductCard';
import { Calendar, User, Clock, ArrowLeft, BookOpen, Share2, Tag } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      setLoading(true);
      fetchApi(`/blogs/${params.slug}`)
        .then((data) => setBlog(data.blog))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <BookOpen className="w-10 h-10 text-[#C21A27] animate-bounce mx-auto" />
        <p className="text-xs font-black text-black">Đang tải bài viết thời trang...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-black text-black">Không tìm thấy bài viết</h2>
        <Link href="/blog" className="px-6 py-3 bg-[#C21A27] text-white font-black text-xs uppercase rounded-xl inline-block">
          Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-16">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:text-[#C21A27] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3px]" /> Quay lại danh sách bài viết
        </Link>

        {/* Header */}
        <div className="space-y-4">
          {blog.category && (
            <span className="px-3.5 py-1 bg-[#C21A27] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm inline-block">
              {blog.category}
            </span>
          )}

          <h1 className="text-2xl sm:text-4xl font-black text-black leading-tight tracking-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-black/60 font-bold border-y-2 border-[#EDE8E2] py-3">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4 text-[#C21A27]" /> {blog.author || 'GirlStyle Team'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-black/40" /> {new Date(blog.createdAt || Date.now()).toLocaleDateString('vi-VN')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-black/40" /> {blog.readTime || '5 min read'}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative w-full h-[320px] sm:h-[450px] rounded-3xl overflow-hidden shadow-xl border-2 border-[#EDE8E2]">
          <img
            src={blog.image || blog.coverImage || '/products/silk_cocktail_dress.jpg'}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Excerpt Blockquote */}
        {(blog.summary || blog.excerpt) && (
          <div className="p-6 rounded-2xl bg-[#EDE8E2]/60 border-l-4 border-[#C21A27] text-sm font-semibold text-black/90 italic leading-relaxed shadow-sm">
            "{blog.summary || blog.excerpt}"
          </div>
        )}

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-black/80 font-medium leading-relaxed space-y-4 whitespace-pre-line text-sm md:text-base">
          {blog.content}
        </div>

        {/* Tagged Products Section */}
        {blog.taggedProducts && blog.taggedProducts.length > 0 && (
          <section className="p-8 rounded-3xl bg-[#f5eee6] border-2 border-[#EDE8E2] space-y-6 pt-6 mt-12">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#C21A27]" />
              <h3 className="text-lg font-black text-black">Gợi Ý Sản Phẩm Trong Bài Viết</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {blog.taggedProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
}
