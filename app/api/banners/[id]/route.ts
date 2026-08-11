import { NextResponse } from 'next/server';
import { updateStore } from '../../../../lib/dataStore';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    let updatedBanner: any = null;

    updateStore((store) => {
      const idx = store.banners.findIndex((b: any) => b._id === params.id);
      if (idx !== -1) {
        store.banners[idx] = { ...store.banners[idx], ...body, updatedAt: new Date().toISOString() };
        updatedBanner = store.banners[idx];
      }
    });

    if (!updatedBanner) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy banner' }, { status: 404 });
    }

    return NextResponse.json({ success: true, banner: updatedBanner });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  updateStore((store) => {
    store.banners = store.banners.filter((b: any) => b._id !== params.id);
  });
  return NextResponse.json({ success: true, message: 'Đã xóa banner' });
}
