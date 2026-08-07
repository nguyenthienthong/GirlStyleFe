'use client';

import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, XCircle, Search, Filter } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const loadOrders = () => {
    setLoading(true);
    let url = '/orders';
    if (filterStatus) url += `?status=${filterStatus}`;
    fetchApi(url)
      .then((data) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [filterStatus]);

  const handleUpdateStatus = async (orderId: string, newStatus: string, newPaymentStatus?: string) => {
    try {
      await fetchApi(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, paymentStatus: newPaymentStatus })
      });
      loadOrders();
    } catch (e: any) {
      alert(e.message || 'Cập nhật thất bại');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900">Quản Lý Luồng & Trạng Thái Đơn Hàng</h1>
          <p className="text-xs text-stone-500">Pipeline xử lý: Mới → Đang đóng gói → Đã giao ĐVVC → Hoàn thành</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-bold text-stone-700"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="new">🆕 Đơn Hàng Mới</option>
            <option value="packing">📦 Đang Đóng Gói</option>
            <option value="shipping">🚚 Đã Giao ĐVVC</option>
            <option value="completed">✅ Hoàn Thành</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-100 pb-3 gap-2">
              <div>
                <span className="text-sm font-extrabold text-fashion-primary font-mono">#{order.orderCode}</span>
                <span className="text-xs text-stone-400 ml-3">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                  order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {order.paymentStatus === 'paid' ? 'Đã Thanh Toán (VietQR)' : 'Chưa Thanh Toán'}
                </span>

                {/* Pipeline Status Change Buttons */}
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  className="px-3 py-1 bg-stone-100 border border-stone-300 rounded-lg text-xs font-bold text-stone-800"
                >
                  <option value="new">🆕 Đơn Mới</option>
                  <option value="packing">📦 Đang Đóng Gói</option>
                  <option value="shipping">🚚 Đã Giao ĐVVC</option>
                  <option value="completed">✅ Hoàn Thành</option>
                  <option value="cancelled">❌ Đã Hủy</option>
                </select>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600 bg-stone-50 p-4 rounded-xl">
              <div>
                <p className="font-bold text-stone-900">Thông tin nhận hàng:</p>
                <p>{order.customerInfo?.name} - <strong className="text-stone-900">{order.customerInfo?.phone}</strong></p>
                <p>{order.customerInfo?.address}, {order.customerInfo?.city}</p>
              </div>

              <div>
                <p className="font-bold text-stone-900">Chi tiết thanh toán:</p>
                <p>Tổng tiền món: {order.totalAmount?.toLocaleString('vi-VN')}đ</p>
                <p>Giảm giá: -{(order.discountAmount || 0).toLocaleString('vi-VN')}đ | Phí ship: {(order.shippingFee || 0).toLocaleString('vi-VN')}đ</p>
                <p className="font-extrabold text-fashion-primary text-sm mt-1">Tổng cộng: {order.finalAmount?.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase">Sản Phẩm Trong Đơn:</span>
              <div className="flex flex-wrap gap-4">
                {order.items?.map((it: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-stone-200 text-xs">
                    <img src={it.image} className="w-10 h-12 object-cover rounded" alt="" />
                    <div>
                      <p className="font-bold text-stone-800">{it.name}</p>
                      <p className="text-[10px] text-stone-500">{it.color} / Size {it.size} x{it.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
