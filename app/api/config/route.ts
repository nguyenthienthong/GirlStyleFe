import { NextResponse } from 'next/server';
import { getStore, updateStore } from '../../../lib/dataStore';

export async function GET() {
  const store = getStore();
  return NextResponse.json({ success: true, config: store.config || {} });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let updatedConfig: any = null;

    updateStore((store) => {
      store.config = { ...store.config, ...body };
      updatedConfig = store.config;
    });

    return NextResponse.json({ success: true, config: updatedConfig });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
