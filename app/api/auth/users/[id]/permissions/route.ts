import { NextResponse } from 'next/server';
import { updateStore } from '../../../../../../lib/dataStore';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    let updatedUser: any = null;

    updateStore((store) => {
      const idx = store.users.findIndex((u: any) => u._id === params.id);
      if (idx !== -1) {
        store.users[idx] = {
          ...store.users[idx],
          ...(body.role ? { role: body.role } : {}),
          ...(body.canWrite !== undefined ? { canWrite: Boolean(body.canWrite) } : {}),
          updatedAt: new Date().toISOString()
        };
        const { password: _, ...noPass } = store.users[idx];
        updatedUser = noPass;
      }
    });

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy user' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
