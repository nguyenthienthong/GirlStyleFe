import { NextResponse } from 'next/server';
import { getStore, updateStore } from '../../../lib/dataStore';

export async function GET() {
  const store = getStore();
  return NextResponse.json({ success: true, lookbooks: store.lookbooks || [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newLookbook = {
      _id: `lb_${Date.now()}`,
      title: body.title,
      coverImage: body.coverImage || '/products/silk_cocktail_dress.jpg',
      styleTag: body.styleTag || 'Sang Trọng',
      description: body.description || '',
      items: body.items || [],
      createdAt: new Date().toISOString()
    };

    updateStore((store) => {
      store.lookbooks.unshift(newLookbook);
    });

    return NextResponse.json({ success: true, lookbook: newLookbook });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
