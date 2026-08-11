'use client';

import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, XCircle, Search, Filter } from 'lucide-react';
import { fetchApi } from '../../../lib/api';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import StatusBadge from '../../../components/StatusBadge';

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
      
      {/* Reusable Admin Page Header */}
      <AdminPageHeader
        title="Quản Lý Luồng & Trạng Thái Đơn Hàng"
        description="Pipeline xử lý: Mới → Đang đóng gói → Đã giao ĐVVC → Hoàn thành"
      >
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">Tất cả trạng thái đơn hàng</option>
            <option value="new">🆕 Đơn Hàng Mới</option>
            <option value="packing">📦 Đang Đóng Gói</option>
            <option value="shipping">🚚 Đã Giao ĐVVC</option>
            <option value="completed">✅ Hoàn Thành</option>
          </select>
        </div>
      </AdminPageHeader>

      {/* Orders Mobile Card List & Desktop Cards */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <span className="text-sm font-bold text-slate-900 font-mono">#{order.orderCode}</span>
                <span className="text-[11px] text-slate-400 ml-2 font-medium">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2">
                {/* Reusable Payment Status Badge */}
                <StatusBadge type="payment" value={order.paymentStatus} />

                {/* Pipeline Status Change Dropdown */}
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <p className="font-bold text-slate-900 mb-0.5">Thông tin nhận hàng:</p>
                <p className="font-bold text-slate-900">{order.customerInfo?.name} - {order.customerInfo?.phone}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">{order.customerInfo?.address}, {order.customerInfo?.city}</p>
              </div>

              <div>
                <p className="font-bold text-slate-900 mb-0.5">Chi tiết thanh toán:</p>
                <p className="text-[11px]">Tổng tiền món: {order.totalAmount?.toLocaleString('vi-VN')}đ</p>
                <p className="text-[11px]">Giảm giá: -{(order.discountAmount || 0).toLocaleString('vi-VN')}đ | Phí ship: {(order.shippingFee || 0).toLocaleString('vi-VN')}đ</p>
                <p className="font-bold text-slate-900 text-sm mt-1">Tổng tiền: {order.finalAmount?.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sản Phẩm Trong Đơn:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {order.items?.map((it: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 text-xs">
                    <img src={it.image} className="w-10 h-12 object-cover rounded-lg border border-slate-200 shrink-0" alt="" />
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 truncate">{it.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{it.color} / Size {it.size} x{it.quantity}</p>
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
