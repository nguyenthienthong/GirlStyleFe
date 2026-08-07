'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export default function LookbookPage() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/mix-match')
      .then((data) => setCombos(data.combos || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      {/* BREADCRUMB HEADER (Matching Screenshot 1) */}
      <div className="bg-[#fdeee9] py-3 px-4 sm:px-6 lg:px-8 border-b border-[#fcdcd3]">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-black/70">
          <Link href="/" className="hover:text-[#C21A27] transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-black/40" />
          <span className="text-[#C21A27] font-black">Mix & Match</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight uppercase font-sans">
            MIX & MATCH
          </h1>
        </div>

        {/* LOOKBOOK OUTFIT GRID (4 Columns Matching Screenshot 1) */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[#EDE8E2]/60 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {combos.map((combo) => (
              <Link
                key={combo._id}
                href={`/lookbook/${combo._id}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 bg-[#EDE8E2] border border-[#EDE8E2]"
              >
                {/* Full Portrait Photograph */}
                <img
                  src={combo.image}
                  alt={combo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Bottom Right Floating Shopping Bag Button (Matching Screenshot 1) */}
                <div className="absolute bottom-4 right-4 z-10 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white text-black shadow-lg border border-black/10 flex items-center justify-center group-hover:bg-[#C21A27] group-hover:text-white transition-all transform group-hover:scale-110">
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
