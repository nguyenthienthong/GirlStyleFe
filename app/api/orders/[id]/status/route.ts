import { NextResponse } from 'next/server';
import { updateStore } from '../../../../../lib/dataStore';
import { addAuditLog } from '../../../../../lib/services/auditLogger';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    let updatedOrder: any = null;

    updateStore((store) => {
      const idx = store.orders.findIndex((o: any) => o._id === params.id);
      if (idx !== -1) {
        store.orders[idx] = {
          ...store.orders[idx],
          ...(body.status ? { status: body.status } : {}),
          ...(body.paymentStatus ? { paymentStatus: body.paymentStatus } : {}),
          updatedAt: new Date().toISOString()
        };
        updatedOrder = store.orders[idx];
      }
    });

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    // Transaction Audit Log
    addAuditLog(
      'transaction',
      'ORDER_STATUS_UPDATED',
      `Cập nhật trạng thái đơn hàng #${updatedOrder.orderCode} sang "${updatedOrder.status}" (Thanh toán: ${updatedOrder.paymentStatus})`,
      'success',
      { orderCode: updatedOrder.orderCode, status: updatedOrder.status, paymentStatus: updatedOrder.paymentStatus }
    );

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
