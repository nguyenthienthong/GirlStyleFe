import { NextResponse } from 'next/server';
import { syncKiotVietInventory } from '../../../../lib/services/kiotvietService';

export async function POST() {
  try {
    const result = await syncKiotVietInventory();
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
