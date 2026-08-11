import { NextResponse } from 'next/server';
import { getStore, updateStore } from '../../../lib/dataStore';

export async function GET() {
  const store = getStore();
  return NextResponse.json({ success: true, feedbacks: store.feedbacks || [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newFb = {
      _id: `fb_${Date.now()}`,
      customerName: body.customerName,
      phone: body.phone,
      email: body.email || '',
      type: body.type || 'Góp Ý',
      message: body.message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    updateStore((store) => {
      store.feedbacks.unshift(newFb);
    });

    return NextResponse.json({ success: true, feedback: newFb });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
