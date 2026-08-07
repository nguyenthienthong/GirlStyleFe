'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, User, Clock, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/blogs')
      .then((data) => setBlogs(data.blogs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen pb-16 space-y-12">
      
      {/* Blog Page Hero Banner */}
      <section className="bg-[#EDE8E2]/60 py-12 md:py-16 border-b-2 border-[#EDE8E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#C21A27] text-white rounded-full font-black text-xs uppercase tracking-widest shadow">
            <BookOpen className="w-4 h-4" /> GIRLSTYLE BLOG & STYLE GUIDE
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight">
            Góc Phối Đồ & Xu Hướng Thời Trang
          </h1>
          <p className="text-xs md:text-sm text-black/70 max-w-2xl mx-auto font-medium leading-relaxed">
            Khám phá bí quyết chọn trang phục tôn dáng, xu hướng phối đồ mới nhất và những câu chuyện phong cách từ các biên tập viên GirlStyle®
          </p>
        </div>
      </section>

      {/* Blog Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-[#EDE8E2]/50 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog._id || blog.slug}
                className="bg-white rounded-3xl border-2 border-[#EDE8E2] overflow-hidden shadow-md hover:shadow-2xl hover:border-[#C21A27] transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Blog Image */}
                <div className="relative h-64 md:h-72 w-full overflow-hidden bg-[#EDE8E2]">
                  <img
                    src={blog.image || blog.coverImage || '/products/silk_cocktail_dress.jpg'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {blog.category && (
                    <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
                      {blog.category}
                    </span>
                  )}
                </div>

                {/* Article Info */}
                <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-xs font-bold text-black/60">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#C21A27]" /> {blog.author || 'GirlStyle Team'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C21A27]" /> {blog.readTime || '4 min read'}
                      </span>
                    </div>

                    <Link href={`/blog/${blog.slug}`}>
                      <h2 className="text-xl md:text-2xl font-black text-black group-hover:text-[#C21A27] transition-colors leading-tight line-clamp-2">
                        {blog.title}
                      </h2>
                    </Link>

                    <p className="text-xs md:text-sm text-black/70 font-medium leading-relaxed line-clamp-3">
                      {blog.summary || blog.excerpt || blog.content?.substring(0, 150)}
                    </p>
                  </div>

                  <div className="pt-4 border-t-2 border-[#EDE8E2] flex items-center justify-between">
                    <span className="text-[11px] font-black text-black/60 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-black/40" />
                      {new Date(blog.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                    </span>

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="px-4 py-2 bg-[#C21A27] hover:bg-[#a5131f] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-1.5"
                    >
                      <span>Đọc Bài Viết</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>

              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <p className="text-sm text-black/60 font-bold">Chưa có bài viết nào.</p>
          </div>
        )}

      </section>

    </div>
  );
}
