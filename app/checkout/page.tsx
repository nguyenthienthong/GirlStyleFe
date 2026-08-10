'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QrCode, CheckCircle2, ShieldCheck, CreditCard, Truck, ArrowLeft, ChevronRight, Phone, Lock, Sparkles, Check, Ticket, X, Tag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { fetchApi } from '../../lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalCartPrice, appliedVoucher, clearCart, user, setUser, setAppliedVoucher } = useShop();

  const [step, setStep] = useState<number>(2); // Step 2: Đặt hàng
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    address: '45 Lê Lợi',
    note: ''
  });

  // Dynamic Address API lists
  const [provincesList, setProvincesList] = useState<any[]>([]);
  const [districtsList, setDistrictsList] = useState<any[]>([]);
  const [wardsList, setWardsList] = useState<any[]>([]);

  const [shippingMethod, setShippingMethod] = useState<'express'>('express');
  const [needVat, setNeedVat] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'credit' | 'atm' | 'momo' | 'cod'>('vietqr');
  const [supportStaffCode, setSupportStaffCode] = useState<string>('');
  
  // Voucher states
  const [voucherInput, setVoucherInput] = useState<string>('');
  const [voucherMsg, setVoucherMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState<boolean>(false);
  const [activeVoucherTab, setActiveVoucherTab] = useState<'input' | 'saved'>('saved');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState<boolean>(false);

  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const shippingFee = totalCartPrice >= 400000 ? 0 : 30000;
  const finalAmount = Math.max(0, totalCartPrice + shippingFee - discountAmount);

  // Fetch available vouchers from Backend
  useEffect(() => {
    fetchApi('/vouchers')
      .then((data) => {
        const active = (data.vouchers || []).filter((v: any) => v.active !== false);
        setAvailableVouchers(active);
      })
      .catch(console.error);
  }, []);

  // Fetch Provinces List via API
  useEffect(() => {
    fetchApi('/address/provinces')
      .then((res) => {
        if (res.success && res.provinces) {
          setProvincesList(res.provinces);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch Districts whenever selected City changes
  useEffect(() => {
    if (!shippingInfo.city) {
      setDistrictsList([]);
      setWardsList([]);
      return;
    }

    fetchApi(`/address/districts?province=${encodeURIComponent(shippingInfo.city)}`)
      .then((res) => {
        if (res.success && res.districts) {
          setDistrictsList(res.districts);
        }
      })
      .catch(console.error);
  }, [shippingInfo.city]);

  // Fetch Wards whenever selected District changes
  useEffect(() => {
    if (!shippingInfo.district) {
      setWardsList([]);
      return;
    }

    fetchApi(`/address/wards?province=${encodeURIComponent(shippingInfo.city)}&district=${encodeURIComponent(shippingInfo.district)}`)
      .then((res) => {
        if (res.success && res.wards) {
          setWardsList(res.wards);
        }
      })
      .catch(console.error);
  }, [shippingInfo.district]);

  // Apply voucher by code string
  const handleApplyVoucherCode = async (codeToApply: string) => {
    const code = codeToApply.trim().toUpperCase();
    if (!code) return;
    try {
      const res = await fetchApi('/vouchers/apply', {
        method: 'POST',
        body: JSON.stringify({ code, orderValue: totalCartPrice })
      });
      if (res.success && res.voucher) {
        setAppliedVoucher({
          code: res.voucher.code,
          discountAmount: res.voucher.discountAmount
        });
        setVoucherInput(res.voucher.code);
        setVoucherMsg({
          text: `🎉 Đã áp dụng thành công mã ${res.voucher.code}: Giảm ${res.voucher.discountAmount.toLocaleString('vi-VN')}đ`,
          success: true
        });
        setIsVoucherModalOpen(false);
      }
    } catch (err: any) {
      setVoucherMsg({ text: err.message || 'Mã giảm giá không hợp lệ', success: false });
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherMsg({ text: 'Đã gỡ mã giảm giá.', success: false });
  };

  // Submit Order Handler
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.district) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!');
      return;
    }

    if (cart.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      router.push('/products');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullAddress = `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`;

      // Authenticate or register guest phone
      const authRes = await fetchApi('/auth/quick-auth', {
        method: 'POST',
        body: JSON.stringify({
          name: shippingInfo.name,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
          address: fullAddress
        })
      });

      if (authRes.success && authRes.user) {
        setUser(authRes.user);
      }

      // Create Order
      const orderRes = await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerInfo: {
            name: shippingInfo.name,
            phone: shippingInfo.phone,
            email: shippingInfo.email,
            address: fullAddress,
            city: shippingInfo.city,
            district: shippingInfo.district,
            ward: shippingInfo.ward,
            note: shippingInfo.note,
            needVat,
            supportStaffCode
          },
          items: cart,
          totalAmount: totalCartPrice,
          discountAmount,
          voucherCode: appliedVoucher?.code || '',
          shippingFee,
          paymentMethod
        })
      });

      if (orderRes.success) {
        setCreatedOrder(orderRes.order);
        clearCart();
        setStep(3); // Proceed to Payment confirmation step
      }
    } catch (error: any) {
      alert(error.message || 'Tạo đơn hàng thất bại, vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmVietQRPayment = async () => {
    if (!createdOrder) return;
    setIsConfirmingPayment(true);
    try {
      const res = await fetchApi(`/orders/${createdOrder.orderCode}/confirm-payment`, {
        method: 'POST'
      });
      if (res.success) {
        setCreatedOrder(res.order);
        setStep(4); // Order Success Step
      }
    } catch (error: any) {
      alert(error.message || 'Xác nhận thanh toán thất bại');
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* 1. TOP STEPPER PROCESS BAR (Quy trình 4 bước) */}
      <div className="relative py-6">
        <div className="flex items-center justify-between max-w-3xl mx-auto relative z-10">
          
          {/* Step 1: Giỏ hàng */}
          <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => router.push('/cart')}>
            <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">✓</div>
            <span className="text-xs font-semibold text-stone-500">Giỏ hàng</span>
          </div>

          {/* Line 1-2 */}
          <div className="flex-1 h-0.5 bg-black mx-4"></div>

          {/* Step 2: Đặt hàng */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-black ring-4 ring-black/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <span className="text-xs font-bold text-black">Đặt hàng</span>
          </div>

          {/* Line 2-3 */}
          <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-black' : 'bg-stone-200'}`}></div>

          {/* Step 3: Thanh toán */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-black text-white' : 'bg-stone-200'}`}>
              {step >= 3 && <div className="w-2 h-2 rounded-full bg-white"></div>}
            </div>
            <span className={`text-xs font-semibold ${step >= 3 ? 'text-black font-bold' : 'text-stone-400'}`}>Thanh toán</span>
          </div>

          {/* Line 3-4 */}
          <div className={`flex-1 h-0.5 mx-4 ${step === 4 ? 'bg-black' : 'bg-stone-200'}`}></div>

          {/* Step 4: Hoàn thành đơn */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${step === 4 ? 'bg-emerald-600 text-white' : 'bg-stone-200'}`}>
              {step === 4 && <Check className="w-3 h-3" />}
            </div>
            <span className={`text-xs font-semibold ${step === 4 ? 'text-emerald-700 font-bold' : 'text-stone-400'}`}>Hoàn thành đơn</span>
          </div>

        </div>
      </div>

      {/* STEP 2: MAIN CHECKOUT FORM & SUMMARY */}
      {step === 2 && (
        <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: SHIPPING ADDRESS & PAYMENT OPTIONS (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Section 1: Địa chỉ giao hàng */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-stone-900">Địa chỉ giao hàng</h2>

              {/* Tabs ĐĂNG NHẬP / ĐĂNG KÝ */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`px-8 py-2.5 rounded-lg text-xs font-extrabold uppercase transition-all ${
                      authMode === 'login' ? 'bg-stone-900 text-white' : 'bg-white text-stone-900 border border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    ĐĂNG NHẬP
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`px-8 py-2.5 rounded-lg text-xs font-extrabold uppercase transition-all ${
                      authMode === 'register' ? 'bg-stone-900 text-white' : 'bg-white text-stone-900 border border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    ĐĂNG KÝ
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">
                  Đăng nhập/Đăng ký tài khoản để được tích điểm và nhận thêm nhiều ưu đãi từ GirlStyle.
                </p>
              </div>

              {/* Radio choice: Địa chỉ */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-900 cursor-pointer">
                  <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center">✓</span>
                  <span>Địa chỉ</span>
                </label>
              </div>

              {/* Address Form Inputs - DYNAMIC SELECT DROPDOWNS VIA API */}
              <div className="space-y-3 pt-2">
                
                {/* Row 1: Họ tên & SĐT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Họ tên"
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-stone-300 text-xs font-medium focus:outline-none focus:border-stone-900 bg-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Số điện thoại"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-stone-300 text-xs font-medium focus:outline-none focus:border-stone-900 bg-white"
                  />
                </div>

                {/* Row 2: Tỉnh/Thành phố & Quận/Huyện SELECT DROPDOWNS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <select
                      required
                      value={shippingInfo.city}
                      onChange={(e) => {
                        const selectedCity = e.target.value;
                        setShippingInfo(prev => ({ ...prev, city: selectedCity, district: '', ward: '' }));
                      }}
                      className="w-full px-3 py-3 rounded-md border border-stone-300 text-xs font-semibold text-stone-900 bg-white focus:outline-none focus:border-stone-900"
                    >
                      <option value="">-- Chọn Tỉnh / Thành phố --</option>
                      {provincesList.map((p: any) => (
                        <option key={p.code || p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      required
                      value={shippingInfo.district}
                      onChange={(e) => {
                        const selectedDistrict = e.target.value;
                        setShippingInfo(prev => ({ ...prev, district: selectedDistrict, ward: '' }));
                      }}
                      className="w-full px-3 py-3 rounded-md border border-stone-300 text-xs font-semibold text-stone-900 bg-white focus:outline-none focus:border-stone-900"
                    >
                      <option value="">-- Chọn Quận / Huyện --</option>
                      {districtsList.map((d: any) => (
                        <option key={d.code || d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: Phường/Xã SELECT DROPDOWN & Địa chỉ chi tiết */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <select
                      required
                      value={shippingInfo.ward}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, ward: e.target.value }))}
                      className="w-full px-3 py-3 rounded-md border border-stone-300 text-xs font-semibold text-stone-900 bg-white focus:outline-none focus:border-stone-900"
                    >
                      <option value="">-- Chọn Phường / Xã --</option>
                      {wardsList.map((w: any) => (
                        <option key={typeof w === 'string' ? w : w.name} value={typeof w === 'string' ? w : w.name}>
                          {typeof w === 'string' ? w : w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Địa chỉ chi tiết (Số nhà, tên đường)"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-md border border-stone-300 text-xs font-medium focus:outline-none focus:border-stone-900 bg-white"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Section 2: Phương thức giao hàng */}
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-stone-900">Phương thức giao hàng</h2>
              <div className="p-4 rounded-xl border border-stone-200 bg-white flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-900 cursor-pointer">
                  <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center">✓</span>
                  <span>Chuyển phát nhanh</span>
                </label>
                <span className="text-xs font-bold text-stone-600">
                  {shippingFee === 0 ? 'MIỄN PHÍ' : '30.000đ'}
                </span>
              </div>
            </div>

            {/* Section 3: Bạn có muốn nhận hoá đơn VAT không? */}
            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
              <span className="text-xs font-bold text-stone-900">Bạn có muốn nhận hoá đơn VAT không ?</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={needVat}
                  onChange={(e) => setNeedVat(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            {/* Section 4: Phương thức thanh toán */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Phương thức thanh toán</h2>
                <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                  Mọi giao dịch đều được bảo mật và mã hóa. Thông tin thẻ tín dụng sẽ không bao giờ được lưu lại.
                </p>
              </div>

              <div className="space-y-3">
                {/* 1. VietQR */}
                <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'vietqr' ? 'border-black bg-stone-50 ring-1 ring-black' : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}>
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'vietqr'}
                    onChange={() => setPaymentMethod('vietqr')}
                    className="accent-black"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">Thanh toán VietQR (Quét mã QR Ngân Hàng - Tự Động Duyệt)</span>
                      <span className="text-[11px] text-stone-500">Tạo mã QR có sẵn số tiền & nội dung chuyển khoản</span>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded uppercase">KHUYÊN DÙNG</span>
                  </div>
                </label>

                {/* 2. VISA / MasterCard */}
                <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'credit' ? 'border-black bg-stone-50 ring-1 ring-black' : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}>
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'credit'}
                    onChange={() => setPaymentMethod('credit')}
                    className="accent-black"
                  />
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <span>Thanh toán bằng thẻ tín dụng</span>
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded font-black">VISA</span>
                    <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] rounded font-black">MasterCard</span>
                  </div>
                </label>

                {/* 3. ATM Nội địa */}
                <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'atm' ? 'border-black bg-stone-50 ring-1 ring-black' : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}>
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'atm'}
                    onChange={() => setPaymentMethod('atm')}
                    className="accent-black"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Thanh toán bằng thẻ ATM</span>
                    <span className="text-[11px] text-stone-400">Hỗ trợ thanh toán online hơn 38 ngân hàng phổ biến Việt Nam.</span>
                  </div>
                </label>

                {/* 4. MoMo */}
                <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'momo' ? 'border-black bg-stone-50 ring-1 ring-black' : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}>
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'momo'}
                    onChange={() => setPaymentMethod('momo')}
                    className="accent-black"
                  />
                  <span className="text-xs font-bold text-stone-900">Thanh toán bằng Momo</span>
                </label>

                {/* 5. COD */}
                <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-black bg-stone-50 ring-1 ring-black' : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}>
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-black"
                  />
                  <span className="text-xs font-bold text-stone-900">Thanh toán khi nhận hàng (COD)</span>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: TÓM TẮT ĐƠN HÀNG */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-stone-50/70 p-6 rounded-2xl border border-stone-200 space-y-5">
              <h3 className="text-base font-bold text-stone-900">Tóm tắt đơn hàng</h3>

              <div className="space-y-2.5 text-xs text-stone-600 font-medium">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng</span>
                  <span className="font-semibold text-stone-900">{totalCartPrice.toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-stone-900">{(totalCartPrice - discountAmount).toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-stone-900">{shippingFee === 0 ? '0đ (Free)' : '30.000đ'}</span>
                </div>

                {appliedVoucher && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Voucher ({appliedVoucher.code}):</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}

                <div className="border-t border-stone-200 pt-3 flex justify-between items-center text-sm font-black text-stone-900">
                  <span>Tiền thanh toán</span>
                  <span className="text-base font-black text-black">{finalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {/* Voucher Section with Saved Vouchers Modal & Selector */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between text-xs font-bold text-stone-800 border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveVoucherTab('saved')}
                      className={`pb-2 -mb-2 ${activeVoucherTab === 'saved' ? 'text-black font-extrabold border-b-2 border-black' : 'text-stone-400 font-medium'}`}
                    >
                      Mã đã lưu ({availableVouchers.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveVoucherTab('input')}
                      className={`pb-2 -mb-2 ${activeVoucherTab === 'input' ? 'text-black font-extrabold border-b-2 border-black' : 'text-stone-400 font-medium'}`}
                    >
                      Mã nhập tay
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsVoucherModalOpen(true)}
                    className="text-[11px] font-extrabold text-[#C21A27] hover:underline flex items-center gap-1"
                  >
                    <Ticket className="w-3.5 h-3.5" /> Kho Voucher 🎟️
                  </button>
                </div>

                {/* If voucher applied, show status badge */}
                {appliedVoucher ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 font-black" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900 uppercase font-mono">{appliedVoucher.code}</p>
                        <p className="text-[10px] text-emerald-700 font-medium">Giảm {appliedVoucher.discountAmount.toLocaleString('vi-VN')}đ</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
                    >
                      Gỡ mã
                    </button>
                  </div>
                ) : activeVoucherTab === 'input' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá (VD: GIRLSTYLE50K)"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 text-xs rounded border border-stone-300 focus:outline-none uppercase font-bold text-stone-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyVoucherCode(voucherInput)}
                      className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-extrabold uppercase rounded transition-all"
                    >
                      ÁP DỤNG
                    </button>
                  </div>
                ) : (
                  /* Inline List of Saved Vouchers for 1-click select */
                  <div className="space-y-2">
                    {availableVouchers.slice(0, 3).map((v) => {
                      const meetsMin = !v.minOrderValue || totalCartPrice >= v.minOrderValue;
                      const isSelected = appliedVoucher?.code === v.code;

                      return (
                        <div
                          key={v._id || v.code}
                          className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-all ${
                            isSelected ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-stone-200 hover:border-black'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="font-mono font-extrabold text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded text-[11px]">
                              {v.code}
                            </span>
                            <p className="text-[11px] text-stone-600 font-medium line-clamp-1">{v.description}</p>
                          </div>

                          <button
                            type="button"
                            disabled={!meetsMin}
                            onClick={() => handleApplyVoucherCode(v.code)}
                            className={`px-3 py-1 rounded text-[11px] font-extrabold uppercase transition-all shrink-0 ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : meetsMin
                                ? 'bg-stone-900 hover:bg-black text-white'
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            }`}
                          >
                            {isSelected ? 'Đã Chọn' : meetsMin ? 'Áp dụng' : 'Chưa đủ đơn'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {voucherMsg && !appliedVoucher && (
                  <p className={`text-[11px] font-bold ${voucherMsg.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {voucherMsg.text}
                  </p>
                )}

                {/* Staff Code optional */}
                <div className="pt-2">
                  <select
                    value={supportStaffCode}
                    onChange={(e) => setSupportStaffCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-stone-300 text-stone-500 font-medium bg-white focus:outline-none"
                  >
                    <option value="">Mã nhân viên hỗ trợ</option>
                    <option value="NV01">NV01 - Linh Chi</option>
                    <option value="NV02">NV02 - Hoài An</option>
                  </select>
                </div>
              </div>

              {/* Main Submit Button "HOÀN THÀNH" */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-stone-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-lg transition-all"
              >
                {isSubmitting ? 'ĐANG XỬ LÝ ĐƠN HÀNG...' : 'HOÀN THÀNH'}
              </button>

            </div>

          </div>

        </form>
      )}

      {/* MODAL KHO VOUCHER / VOUCHER ĐÃ LƯU */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col justify-between max-h-[85vh]">
            
            {/* Header */}
            <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold uppercase tracking-wider">
                  KHO VOUCHER & MÃ ĐÃ LƯU
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVoucherModalOpen(false)}
                className="text-white/70 hover:text-white font-bold p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Voucher List */}
            <div className="p-6 space-y-3 overflow-y-auto max-h-[60vh]">
              <p className="text-xs text-stone-600 font-semibold mb-3">
                Chọn mã ưu đãi khả dụng bên dưới cho đơn hàng hiện tại ({totalCartPrice.toLocaleString('vi-VN')}đ):
              </p>

              {availableVouchers.map((v) => {
                const meetsMin = !v.minOrderValue || totalCartPrice >= v.minOrderValue;
                const isSelected = appliedVoucher?.code === v.code;

                return (
                  <div
                    key={v._id || v.code}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : meetsMin
                        ? 'border-stone-200 hover:border-black bg-white'
                        : 'border-stone-200 bg-stone-100/50 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black font-mono uppercase bg-stone-900 text-white px-2.5 py-0.5 rounded">
                          {v.code}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">
                            Đang áp dụng
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-stone-900">{v.description}</p>
                      {v.minOrderValue > 0 && (
                        <p className="text-[10px] text-stone-500 font-semibold">
                          Đơn tối thiểu: {v.minOrderValue.toLocaleString('vi-VN')}đ
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={!meetsMin}
                      onClick={() => handleApplyVoucherCode(v.code)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : meetsMin
                          ? 'bg-stone-900 hover:bg-black text-white shadow'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {isSelected ? 'Đã Chọn' : meetsMin ? 'Dùng Mã' : 'Chưa Đủ Đơn'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 text-center">
              <button
                type="button"
                onClick={() => setIsVoucherModalOpen(false)}
                className="px-6 py-2.5 bg-stone-900 text-white font-extrabold text-xs uppercase rounded-xl"
              >
                Đóng cửa sổ
              </button>
            </div>

          </div>
        </div>
      )}

      {/* STEP 3: VIETQR SCAN & RECONCILIATION */}
      {step === 3 && createdOrder && (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl border border-stone-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="space-y-1">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full inline-block">
              ĐƠN HÀNG KHỞI TẠO: #{createdOrder.orderCode}
            </span>
            <h2 className="text-xl font-black text-stone-900">Quét Mã VietQR Tự Động</h2>
            <p className="text-xs text-stone-500">
              Vui lòng mở App Ngân hàng quét mã QR bên dưới để thanh toán.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 inline-block shadow-inner">
            <img
              src={createdOrder.vietqrRef?.qrUrl || `https://img.vietqr.io/image/MBBank-0988889999-compact2.png?amount=${createdOrder.finalAmount}&addInfo=${createdOrder.orderCode}`}
              alt="VietQR Code"
              className="w-60 h-60 object-contain mx-auto rounded"
            />
          </div>

          <div className="p-4 bg-stone-50 rounded-xl text-left text-xs space-y-1.5 text-stone-700 font-medium">
            <div className="flex justify-between">
              <span>Chủ tài khoản:</span>
              <strong className="text-stone-900">{createdOrder.vietqrRef?.accountName || 'GIRLSTYLE FASHION STORE'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Số tài khoản:</span>
              <strong className="text-rose-600 font-mono">{createdOrder.vietqrRef?.accountNo || '0988889999'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Số tiền:</span>
              <strong className="text-rose-600 font-bold">{createdOrder.finalAmount.toLocaleString('vi-VN')}đ</strong>
            </div>
            <div className="flex justify-between">
              <span>Nội dung chuyển khoản:</span>
              <strong className="text-stone-900 font-mono bg-amber-100 px-2 py-0.5 rounded">{createdOrder.orderCode}</strong>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleConfirmVietQRPayment}
              disabled={isConfirmingPayment}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
            >
              {isConfirmingPayment ? 'Đang kiểm tra giao dịch...' : '⚡ Giả Lập Đã Chuyển Tiền (Tự Động Duyệt Đơn)'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ORDER SUCCESS */}
      {step === 4 && createdOrder && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-stone-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-stone-900">Đặt Hàng Thành Công!</h2>
            <p className="text-xs text-stone-600">
              Đơn hàng <strong className="text-black font-mono">#{createdOrder.orderCode}</strong> đã được gửi tới bộ phận đóng gói. Thông báo đã được gửi tới Admin CMS!
            </p>
          </div>

          <Link
            href="/"
            className="block w-full py-4 bg-black text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow"
          >
            Quay Về Trang Chủ
          </Link>
        </div>
      )}

    </div>
  );
}
