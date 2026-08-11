import { NextResponse } from 'next/server';
import { getStore, updateStore } from '../../../lib/dataStore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  const store = getStore();
  let banners = store.banners || [];

  if (type) {
    banners = banners.filter((b: any) => b.type === type);
  }

  return NextResponse.json({ success: true, banners });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBanner = {
      _id: `ban_${Date.now()}`,
      title: body.title || '',
      subtitle: body.subtitle || '',
      type: body.type || 'hero_slide',
      imageUrl: body.imageUrl || '',
      linkUrl: body.linkUrl || '/products',
      order: Number(body.order) || 0,
      active: body.active !== undefined ? Boolean(body.active) : true,
      createdAt: new Date().toISOString()
    };

    updateStore((store) => {
      store.banners.unshift(newBanner);
    });

    return NextResponse.json({ success: true, banner: newBanner });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
