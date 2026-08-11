import { NextResponse } from 'next/server';
import { getStore, updateStore } from '../../../lib/dataStore';

export async function GET() {
  const store = getStore();
  return NextResponse.json({ success: true, vouchers: store.vouchers || [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newVoucher = {
      _id: `vouch_${Date.now()}`,
      code: body.code.toUpperCase(),
      description: body.description || '',
      discountType: body.discountType || 'fixed',
      discountValue: Number(body.discountValue) || 0,
      minOrderValue: Number(body.minOrderValue) || 0,
      maxDiscount: Number(body.maxDiscount) || 0,
      validUntil: body.validUntil || '2026-12-31',
      active: body.active !== undefined ? Boolean(body.active) : true,
      createdAt: new Date().toISOString()
    };

    updateStore((store) => {
      store.vouchers.unshift(newVoucher);
    });

    return NextResponse.json({ success: true, voucher: newVoucher });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
