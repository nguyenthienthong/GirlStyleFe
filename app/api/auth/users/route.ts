import { NextResponse } from 'next/server';
import { getStore, updateStore } from '../../../../lib/dataStore';

export async function GET() {
  const store = getStore();
  const users = (store.users || []).map(({ password, ...u }: any) => u);
  return NextResponse.json({ success: true, users });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUser = {
      _id: `usr_${Date.now()}`,
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      password: body.password || '123456',
      role: body.role || 'content',
      canWrite: body.canWrite !== undefined ? Boolean(body.canWrite) : true,
      createdAt: new Date().toISOString()
    };

    updateStore((store) => {
      store.users.unshift(newUser);
    });

    const { password: _, ...userNoPass } = newUser;
    return NextResponse.json({ success: true, user: userNoPass });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
