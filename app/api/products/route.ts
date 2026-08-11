import { NextResponse } from 'next/server';
import { getStore, updateStore } from '../../../lib/dataStore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const isHot = searchParams.get('isHot');

  const store = getStore();
  let products = store.products || [];

  if (category) {
    products = products.filter((p: any) => p.category?.toLowerCase() === category.toLowerCase());
  }

  if (isHot === 'true') {
    products = products.filter((p: any) => p.isHot);
  }

  return NextResponse.json({ success: true, products });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = {
      _id: `prod_${Date.now()}`,
      code: body.code || `GS${Math.floor(Math.random() * 1000)}`,
      name: body.name,
      category: body.category || 'Đầm Váy',
      price: Number(body.price) || 0,
      salePrice: body.salePrice ? Number(body.salePrice) : null,
      description: body.description || '',
      isHot: Boolean(body.isHot),
      colors: body.colors || [
        {
          name: 'Đỏ',
          hex: '#C21A27',
          mainImage: body.image || '/products/silk_cocktail_dress.jpg',
          sizes: ['S', 'M', 'L'],
          sizeStocks: [{ size: 'S', stock: 10 }, { size: 'M', stock: 10 }, { size: 'L', stock: 10 }]
        }
      ],
      createdAt: new Date().toISOString()
    };

    updateStore((store) => {
      store.products.unshift(newProduct);
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
