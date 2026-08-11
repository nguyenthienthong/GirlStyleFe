import { NextResponse } from 'next/server';
import { updateStore } from '../../../../lib/dataStore';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    let updatedFb: any = null;

    updateStore((store) => {
      const idx = store.feedbacks.findIndex((f: any) => f._id === params.id);
      if (idx !== -1) {
        store.feedbacks[idx] = { ...store.feedbacks[idx], ...body, updatedAt: new Date().toISOString() };
        updatedFb = store.feedbacks[idx];
      }
    });

    return NextResponse.json({ success: true, feedback: updatedFb });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
