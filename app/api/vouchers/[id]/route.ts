import { NextResponse } from 'next/server';
import { updateStore } from '../../../../lib/dataStore';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    let updatedVoucher: any = null;

    updateStore((store) => {
      const idx = store.vouchers.findIndex((v: any) => v._id === params.id);
      if (idx !== -1) {
        store.vouchers[idx] = { ...store.vouchers[idx], ...body, updatedAt: new Date().toISOString() };
        updatedVoucher = store.vouchers[idx];
      }
    });

    if (!updatedVoucher) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy mã giảm giá' }, { status: 404 });
    }

    return NextResponse.json({ success: true, voucher: updatedVoucher });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  updateStore((store) => {
    store.vouchers = store.vouchers.filter((v: any) => v._id !== params.id);
  });
  return NextResponse.json({ success: true, message: 'Đã xóa mã giảm giá' });
}
