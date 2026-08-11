import { NextResponse } from 'next/server';
import { getStore, updateStore } from '../../../../lib/dataStore';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const store = getStore();
  const product = store.products?.find((p: any) => p._id === params.id);
  if (!product) {
    return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm' }, { status: 404 });
  }
  return NextResponse.json({ success: true, product });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    let updatedProduct: any = null;

    updateStore((store) => {
      const idx = store.products.findIndex((p: any) => p._id === params.id);
      if (idx !== -1) {
        store.products[idx] = { ...store.products[idx], ...body, updatedAt: new Date().toISOString() };
        updatedProduct = store.products[idx];
      }
    });

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  updateStore((store) => {
    store.products = store.products.filter((p: any) => p._id !== params.id);
  });
  return NextResponse.json({ success: true, message: 'Đã xóa sản phẩm thành công' });
}
