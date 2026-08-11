import { NextResponse } from 'next/server';

export async function GET() {
  const categories = [
    { id: 'cat_1', name: 'Đầm Váy', slug: 'dam-vay', image: '/products/silk_cocktail_dress.jpg', count: 12 },
    { id: 'cat_2', name: 'Áo Sơ Mi & Blouse', slug: 'ao-so-mi', image: '/products/korean_voile_top.jpg', count: 8 },
    { id: 'cat_3', name: 'Set Trang Phục Premium', slug: 'set-trang-phuc', image: '/products/tweed_suit_set.jpg', count: 15 },
    { id: 'cat_4', name: 'Chân Váy & Midi', slug: 'chan-vay', image: '/products/pleated_midi_dress.jpg', count: 10 }
  ];

  return NextResponse.json({ success: true, categories });
}
