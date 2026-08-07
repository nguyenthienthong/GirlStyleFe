'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Edit3, CheckCircle2, Calendar, Tag, DollarSign, Percent, Copy, Check } from 'lucide-react';
import { fetchApi } from '../../../lib/api';

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'fixed', // 'fixed' | 'percent'
    discountValue: 50000,
    minOrderValue: 300000,
    maxDiscount: 100000,
    validUntil: '2026-12-31',
    active: true
  });

  const [copiedCode, setCopiedCode] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const loadVouchers = () => {
    setLoading(true);
    fetchApi('/vouchers')
      .then((data) => setVouchers(data.vouchers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Đã chép mã: ${code}`);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleOpenCreateModal = () => {
    setEditingVoucher(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'fixed',
      discountValue: 50000,
      minOrderValue: 300000,
      maxDiscount: 100000,
      validUntil: '2026-12-31',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (voucher: any) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code || '',
      description: voucher.description || '',
      discountType: voucher.discountType || 'fixed',
      discountValue: voucher.discountValue || 0,
      minOrderValue: voucher.minOrderValue || 0,
      maxDiscount: voucher.maxDiscount || 0,
      validUntil: voucher.validUntil ? voucher.validUntil.substring(0, 10) : '2026-12-31',
      active: voucher.active !== undefined ? voucher.active : true
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) {
      alert('Vui lòng điền mã Voucher và giá trị giảm!');
      return;
    }

    try {
      if (editingVoucher) {
        await fetchApi(`/vouchers/${editingVoucher._id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        showToast('Đã cập nhật mã giảm giá!');
      } else {
        await fetchApi('/vouchers', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        showToast('Đã thêm mã giảm giá mới!');
      }

      setIsModalOpen(false);
      loadVouchers();
    } catch (err: any) {
      alert('Lỗi lưu mã giảm giá: ' + err.message);
    }
  };

  const handleToggleActive = async (voucher: any) => {
    try {
      await fetchApi(`/vouchers/${voucher._id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !voucher.active })
      });
      showToast(`Đã ${!voucher.active ? 'kích hoạt' : 'khóa'} mã ${voucher.code}`);
      loadVouchers();
    } catch (err: any) {
      alert('Lỗi đổi trạng thái: ' + err.message);
    }
  };

  const handleDeleteVoucher = async (voucherId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) return;
    try {
      await fetchApi(`/vouchers/${voucherId}`, {
        method: 'DELETE'
      });
      showToast('Đã xóa mã giảm giá thành công!');
      loadVouchers();
    } catch (err: any) {
      alert('Lỗi xóa mã giảm giá: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#C21A27] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-black animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#EDE8E2] pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Quản Lý Mã Giảm Giá (Vouchers)</h1>
          <p className="text-xs text-black/60 font-semibold mt-1">
            Tạo và thiết lập các mã voucher ưu đãi cho khách hàng khi mua sắm tại cửa hàng
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-[#C21A27] hover:bg-[#a5131f] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 glow-red w-fit"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> Tạo Voucher Mới
        </button>
      </div>

      {/* Vouchers Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 bg-[#EDE8E2]/60 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : vouchers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.map((v) => (
            <div
              key={v._id}
              className={`relative bg-white rounded-2xl border-2 overflow-hidden shadow-md transition-all duration-300 flex flex-col justify-between p-5 space-y-4 ${
                v.active ? 'border-[#EDE8E2] hover:border-[#C21A27]' : 'border-gray-200 opacity-60'
              }`}
            >
              {/* Ticket Top Cutout Decoration */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#C21A27] text-white font-black text-sm tracking-wider rounded-lg shadow-sm font-mono flex items-center gap-1.5">
                      <Ticket className="w-4 h-4" /> {v.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(v.code)}
                      className="p-1.5 text-black/40 hover:text-[#C21A27] transition-colors"
                      title="Chép mã"
                    >
                      {copiedCode === v.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs font-bold text-black/70 mt-2">{v.description || 'Ưu đãi dành riêng cho đơn hàng GirlStyle'}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleActive(v)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center shrink-0 ${
                    v.active ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                  title={v.active ? 'Đang bật (Bấm để khóa)' : 'Đã khóa (Bấm để bật)'}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-md"></span>
                </button>
              </div>

              {/* Voucher Stats */}
              <div className="bg-[#EDE8E2]/50 p-3 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between items-center font-black text-black">
                  <span>Mức giảm:</span>
                  <span className="text-[#C21A27] text-sm">
                    {v.discountType === 'percent'
                      ? `${v.discountValue}% ${v.maxDiscount ? `(Tối đa ${v.maxDiscount.toLocaleString('vi-VN')}đ)` : ''}`
                      : `${v.discountValue.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-black/70 font-semibold text-[11px]">
                  <span>Đơn tối thiểu:</span>
                  <span className="font-bold">{v.minOrderValue ? `${v.minOrderValue.toLocaleString('vi-VN')}đ` : 'Không giới hạn'}</span>
                </div>

                <div className="flex justify-between items-center text-black/60 font-semibold text-[11px] pt-1 border-t border-[#EDE8E2]">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#C21A27]" /> Hạn dùng:</span>
                  <span>{v.validUntil ? v.validUntil.substring(0, 10) : '31/12/2026'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#EDE8E2]">
                <button
                  onClick={() => handleOpenEditModal(v)}
                  className="px-3 py-1.5 bg-[#EDE8E2] hover:bg-black hover:text-white text-black text-xs font-black rounded-xl transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Sửa
                </button>

                <button
                  onClick={() => handleDeleteVoucher(v._id)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-[#C21A27] hover:text-white text-[#C21A27] text-xs font-black rounded-xl transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-[#EDE8E2] space-y-4">
          <Ticket className="w-12 h-12 text-black/30 mx-auto" />
          <h3 className="text-base font-black text-black">Chưa có Mã Giảm Giá nào</h3>
          <p className="text-xs text-black/60 font-medium">Tạo voucher mới để thu hút khách hàng chốt đơn hàng nhanh hơn.</p>
          <button
            onClick={handleOpenCreateModal}
            className="px-6 py-3 bg-[#C21A27] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow"
          >
            + Tạo Voucher Mới Ngay
          </button>
        </div>
      )}

      {/* CREATE / EDIT VOUCHER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#C21A27] animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#C21A27] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                <h3 className="text-base font-black uppercase tracking-wider">
                  {editingVoucher ? 'Chỉnh Sửa Mã Giảm Giá' : 'Tạo Mã Giảm Giá Mới'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white font-black text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              
              {/* Code */}
              <div>
                <label className="block text-xs font-black text-black mb-1">Mã Voucher (Coupon Code) *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: GIRLSTYLE50K, SUMMER20..."
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#EDE8E2] text-sm font-black tracking-wider font-mono text-[#C21A27] uppercase focus:ring-2 focus:ring-[#C21A27] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-black mb-1">Mô Tả Mã Ưu Đãi</label>
                <input
                  type="text"
                  placeholder="Giảm 50.000đ cho đơn hàng từ 300.000đ..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#EDE8E2] text-xs font-medium text-black focus:ring-2 focus:ring-[#C21A27] focus:outline-none"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">Loại Giảm Giá</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#EDE8E2] text-xs font-black text-black focus:ring-2 focus:ring-[#C21A27] focus:outline-none bg-white"
                  >
                    <option value="fixed">Số tiền VNĐ (Cố định)</option>
                    <option value="percent">Phần trăm % (Tỷ lệ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1">Giá Trị Giảm *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#EDE8E2] text-xs font-black text-[#C21A27] focus:ring-2 focus:ring-[#C21A27] focus:outline-none"
                  />
                </div>
              </div>

              {/* Min Order & Max Discount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">Đơn Hàng Tối Thiểu (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#EDE8E2] text-xs font-black text-black focus:ring-2 focus:ring-[#C21A27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black mb-1">Giảm Tối Đa (Dành cho %)</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#EDE8E2] text-xs font-black text-black focus:ring-2 focus:ring-[#C21A27] focus:outline-none"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-black text-black mb-1">Ngày Hết Hạn</label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#EDE8E2] text-xs font-black text-black focus:ring-2 focus:ring-[#C21A27] focus:outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="pt-2 flex items-center justify-between">
                <label className="text-xs font-black text-black">Kích Hoạt Sử Dụng Ngay</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                    formData.active ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-md"></span>
                </button>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#EDE8E2] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-[#EDE8E2] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-black/10"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#C21A27] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-[#a5131f] transition-all glow-red"
                >
                  {editingVoucher ? 'Lưu Thay Đổi' : 'Tạo Voucher Mới'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
