'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QrCode, CheckCircle2, ShieldCheck, CreditCard, Truck, ArrowLeft, Sparkles, Phone, Lock } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { fetchApi } from '../../lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalCartPrice, appliedVoucher, clearCart, user, setUser } = useShop();

  const [step, setStep] = useState<number>(2); // Step 2: Shipping info
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '123 Lê Duẩn, Q.1',
    city: 'TP. Hồ Chí Minh',
    note: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'vnpay' | 'cod'>('vietqr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const shippingFee = totalCartPrice >= 400000 ? 0 : 30000;
  const finalAmount = Math.max(0, totalCartPrice + shippingFee - discountAmount);

  // Submit Order Handler
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      alert('Vui lòng điền Tên, Số điện thoại và Địa chỉ nhận hàng!');
      return;
    }

    setIsSubmitting(true);

    try {
      // 2.1 Auto create account or authenticate by phone
      const authRes = await fetchApi('/auth/quick-auth', {
        method: 'POST',
        body: JSON.stringify({
          name: shippingInfo.name,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
          address: shippingInfo.address
        })
      });

      if (authRes.success && authRes.user) {
        setUser(authRes.user);
      }

      // Create Order
      const orderRes = await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerInfo: shippingInfo,
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
        setStep(3); // Proceed to Payment QR step
      }
    } catch (error: any) {
      alert(error.message || 'Tạo đơn hàng thất bại, vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // VietQR Live Auto Reconciliation Simulation
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Step Stepper Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2">
          <Link href="/cart" className="text-stone-400 hover:text-stone-700 p-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-extrabold text-stone-900">Thanh Toán Đơn Hàng</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-fashion-primary text-white' : 'bg-stone-100 text-stone-400'}`}>
            1. Địa chỉ
          </span>
          <span>→</span>
          <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-fashion-primary text-white' : 'bg-stone-100 text-stone-400'}`}>
            2. Thanh toán
          </span>
          <span>→</span>
          <span className={`px-3 py-1 rounded-full ${step === 4 ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-400'}`}>
            3. Hoàn tất
          </span>
        </div>
      </div>

      {/* STEP 2: SHIPPING ADDRESS FORM */}
      {step === 2 && (
        <form onSubmit={handleCreateOrder} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Truck className="w-5 h-5 text-fashion-primary" />
              <h2 className="text-base font-bold text-stone-900">Thông Tin Nhận Hàng</h2>
            </div>

            <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
              <Phone className="w-4 h-4 text-fashion-primary shrink-0" />
              <span>
                <strong>Tự động tạo tài khoản:</strong> Bạn chỉ cần nhập SĐT, hệ thống sẽ tự lưu lịch sử mua hàng để bạn tiện theo dõi đơn sau này!
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Họ & Tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Thị Ngọc Anh"
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-fashion-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="0912345678"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-fashion-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Địa chỉ giao hàng chi tiết *</label>
              <input
                type="text"
                required
                placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-fashion-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tỉnh / Thành phố</label>
                <input
                  type="text"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-fashion-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Ghi chú giao hàng</label>
                <input
                  type="text"
                  placeholder="VD: Giao ngoài giờ hành chính..."
                  value={shippingInfo.note}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, note: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-fashion-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-800 block">Phương Thức Thanh Toán</label>
              
              <div className="space-y-2">
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'vietqr' ? 'bg-rose-50 border-fashion-primary ring-2 ring-fashion-primary/30' : 'bg-white border-stone-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'vietqr'}
                      onChange={() => setPaymentMethod('vietqr')}
                      className="text-fashion-primary focus:ring-fashion-primary"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-900 block flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-fashion-primary" /> Thanh Toán Chuyển Khoản Auto VietQR
                      </span>
                      <span className="text-[11px] text-stone-500">Tự tạo mã QR chuẩn số tiền. Tiền về tự động duyệt đơn 1 giây.</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">KHUYÊN DÙNG</span>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'vnpay' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/30' : 'bg-white border-stone-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'vnpay'}
                      onChange={() => setPaymentMethod('vnpay')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-900 block flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-600" /> Thanh Toán Thẻ / Ví VNPay
                      </span>
                      <span className="text-[11px] text-stone-500">Thanh toán qua cổng VNPay (ATM, Visa/Mastercard, Ví điện tử)</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3">Chi Tiết Đơn Hàng ({cart.length} món)</h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={item.image} className="w-10 h-12 object-cover rounded-md" alt="" />
                      <div>
                        <p className="font-bold text-stone-800 line-clamp-1">{item.name}</p>
                        <span className="text-stone-400 text-[10px]">{item.color} / Size {item.size} x{item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{totalCartPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Giảm giá:</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí ship:</span>
                  <span>{shippingFee === 0 ? 'MIỄN PHÍ' : '30.000đ'}</span>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-3 flex justify-between items-center">
                <span className="text-xs font-bold text-stone-900">Tổng Tiền:</span>
                <span className="text-xl font-extrabold text-fashion-primary">{finalAmount.toLocaleString('vi-VN')}đ</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-fashion-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl hover:bg-fashion-primaryHover transition-all flex items-center justify-center gap-2 glow-pink"
              >
                {isSubmitting ? 'Đang tạo đơn...' : 'Đặt Hàng & Thanh Toán'}
              </button>
            </div>
          </div>

        </form>
      )}

      {/* STEP 3: VIETQR AUTOMATIC PAYMENT GENERATION & CONFIRMATION */}
      {step === 3 && createdOrder && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-stone-200 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full inline-block">
              ĐƠN HÀNG ĐÃ ĐƯỢC KHỞI TẠO: #{createdOrder.orderCode}
            </span>
            <h2 className="text-2xl font-black text-stone-900">Quét Mã VietQR Tự Động</h2>
            <p className="text-xs text-stone-500">
              Vui lòng mở App Ngân Hàng hoặc Ví Điện Tử quét mã QR bên dưới để hoàn tất thanh toán.
            </p>
          </div>

          {/* Dynamic VietQR Image */}
          <div className="p-4 bg-rose-50 rounded-2xl border-2 border-dashed border-rose-300 inline-block shadow-inner">
            <img
              src={createdOrder.vietqrRef?.qrUrl || `https://img.vietqr.io/image/MBBank-0988889999-compact2.png?amount=${createdOrder.finalAmount}&addInfo=${createdOrder.orderCode}`}
              alt="VietQR Code"
              className="w-64 h-64 object-contain mx-auto rounded-lg shadow-sm"
            />
          </div>

          <div className="p-4 bg-stone-50 rounded-xl text-left text-xs space-y-1.5 text-stone-700 font-medium">
            <div className="flex justify-between">
              <span>Chủ tài khoản:</span>
              <strong className="text-stone-900">{createdOrder.vietqrRef?.accountName || 'GIRLSTYLE FASHION STORE'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Số tài khoản:</span>
              <strong className="text-fashion-primary font-mono text-sm">{createdOrder.vietqrRef?.accountNo || '0988889999'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Số tiền:</span>
              <strong className="text-fashion-primary font-bold text-sm">{createdOrder.finalAmount.toLocaleString('vi-VN')}đ</strong>
            </div>
            <div className="flex justify-between">
              <span>Nội dung chuyển khoản:</span>
              <strong className="text-stone-900 font-mono bg-amber-100 px-2 py-0.5 rounded">{createdOrder.orderCode}</strong>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleConfirmVietQRPayment}
              disabled={isConfirmingPayment}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isConfirmingPayment ? 'Hệ thống đang kiểm tra tiền về...' : '⚡ Giả Lập Đã Chuyển Tiền Thành Công (Tự Động Duyệt)'}
            </button>

            <p className="text-[11px] text-stone-400">
              Hệ thống tự động phát hiện tiền về trong 1-3 giây và chuyển trạng thái đơn sang Đang đóng gói.
            </p>
          </div>
        </div>
      )}

      {/* STEP 4: ORDER COMPLETED */}
      {step === 4 && createdOrder && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-stone-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-stone-900">Đặt Hàng Thành Công!</h2>
            <p className="text-xs text-stone-600">
              Đơn hàng <strong className="text-fashion-primary">#{createdOrder.orderCode}</strong> của bạn đã được duyệt và đang trong quá trình đóng gói.
            </p>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl text-left text-xs text-stone-700 space-y-2">
            <p><strong>Người nhận:</strong> {createdOrder.customerInfo?.name} - {createdOrder.customerInfo?.phone}</p>
            <p><strong>Địa chỉ:</strong> {createdOrder.customerInfo?.address}</p>
            <p><strong>Trạng thái:</strong> <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">ĐÃ THANH TOÁN (Đang đóng gói)</span></p>
          </div>

          <Link
            href="/"
            className="block w-full py-4 bg-fashion-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-fashion-primaryHover transition-all"
          >
            Quay Về Trang Chủ Mua Sắm Tiếp
          </Link>
        </div>
      )}

    </div>
  );
}
