import { NextResponse } from 'next/server';
import { getStore, updateStore } from '../../../lib/dataStore';
import { addAuditLog } from '../../../lib/services/auditLogger';
import { pushOrderToKiotViet } from '../../../lib/services/kiotvietService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const store = getStore();
  let orders = store.orders || [];

  if (status) {
    orders = orders.filter((o: any) => o.status === status);
  }

  return NextResponse.json({ success: true, orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = {
      _id: `ord_${Date.now()}`,
      orderCode: `GS${Math.floor(100000 + Math.random() * 900000)}`,
      customerInfo: body.customerInfo,
      items: body.items || [],
      totalAmount: Number(body.totalAmount) || 0,
      discountAmount: Number(body.discountAmount) || 0,
      shippingFee: Number(body.shippingFee) || 0,
      finalAmount: Number(body.finalAmount) || 0,
      voucherCode: body.voucherCode || '',
      paymentMethod: body.paymentMethod || 'vietqr',
      paymentStatus: body.paymentMethod === 'vietqr' ? 'paid' : 'unpaid',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    updateStore((store) => {
      store.orders.unshift(newOrder);

      // Deduct item sizeStocks from products
      newOrder.items.forEach((item: any) => {
        const prod = store.products.find((p: any) => p._id === item.productId || p.name === item.name);
        if (prod && prod.colors) {
          prod.colors.forEach((c: any) => {
            if (c.name === item.color && c.sizeStocks) {
              const st = c.sizeStocks.find((s: any) => s.size === item.size);
              if (st) st.stock = Math.max(0, st.stock - item.quantity);
            }
          });
        }
      });
    });

    // 1. Transaction Audit Log
    addAuditLog(
      'transaction',
      'NEW_ORDER_CREATED',
      `Đơn hàng mới #${newOrder.orderCode} trị giá ${newOrder.finalAmount.toLocaleString('vi-VN')}đ được tạo thành công! (Thanh toán: ${newOrder.paymentMethod})`,
      'success',
      { orderCode: newOrder.orderCode, amount: newOrder.finalAmount, itemsCount: newOrder.items.length }
    );

    // 2. Push to KiotViet POS
    pushOrderToKiotViet(newOrder).catch(console.error);

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
