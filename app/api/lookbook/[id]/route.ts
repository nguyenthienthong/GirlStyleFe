import { NextResponse } from 'next/server';
import { getStore, updateStore } from '../../../../lib/dataStore';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const store = getStore();
  const lb = store.lookbooks?.find((l: any) => l._id === params.id);
  if (!lb) return NextResponse.json({ success: false, message: 'Không tìm thấy lookbook' }, { status: 404 });
  return NextResponse.json({ success: true, lookbook: lb });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    let updatedLb: any = null;

    updateStore((store) => {
      const idx = store.lookbooks.findIndex((l: any) => l._id === params.id);
      if (idx !== -1) {
        store.lookbooks[idx] = { ...store.lookbooks[idx], ...body, updatedAt: new Date().toISOString() };
        updatedLb = store.lookbooks[idx];
      }
    });

    return NextResponse.json({ success: true, lookbook: updatedLb });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  updateStore((store) => {
    store.lookbooks = store.lookbooks.filter((l: any) => l._id !== params.id);
  });
  return NextResponse.json({ success: true, message: 'Đã xóa lookbook' });
}
