'use client';

import React from 'react';

type BadgeType = 'payment' | 'order' | 'role' | 'active' | 'custom';

interface StatusBadgeProps {
  type: BadgeType;
  value: string | boolean;
  label?: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ type, value, label, size = 'sm' }: StatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  if (type === 'payment') {
    const isPaid = value === 'paid' || value === true;
    return (
      <span
        className={`rounded-full font-bold uppercase ${sizeClasses} ${
          isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}
      >
        {label || (isPaid ? 'Đã thanh toán (VietQR)' : 'Chưa thanh toán')}
      </span>
    );
  }

  if (type === 'order') {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      new: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đơn mới' },
      packing: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Đang đóng gói' },
      shipping: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Đã giao ĐVVC' },
      completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Hoàn thành' },
      cancelled: { bg: 'bg-rose-100', text: 'text-rose-800', label: 'Đã hủy' }
    };

    const cfg = statusConfig[String(value)] || { bg: 'bg-slate-100', text: 'text-slate-800', label: String(value) };

    return (
      <span className={`rounded-full font-bold uppercase ${sizeClasses} ${cfg.bg} ${cfg.text}`}>
        {label || cfg.label}
      </span>
    );
  }

  if (type === 'role') {
    const roleConfig: Record<string, { bg: string; text: string; label: string }> = {
      admin: { bg: 'bg-slate-900', text: 'text-white', label: '👑 Admin Master' },
      content: { bg: 'bg-purple-600', text: 'text-white', label: '📝 Biên Tập Viên' },
      customer: { bg: 'bg-slate-100', text: 'text-slate-700 border border-slate-200', label: '🛍️ Khách Hàng' }
    };

    const cfg = roleConfig[String(value)] || { bg: 'bg-slate-100', text: 'text-slate-700', label: String(value) };

    return (
      <span className={`rounded-full font-bold uppercase tracking-wider ${sizeClasses} ${cfg.bg} ${cfg.text}`}>
        {label || cfg.label}
      </span>
    );
  }

  if (type === 'active') {
    const isActive = value === true || value === 'active' || value === 'resolved';
    return (
      <span
        className={`rounded-full font-bold uppercase ${sizeClasses} ${
          isActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
        }`}
      >
        {label || (isActive ? 'Đang Hiển Thị' : 'Đã Ẩn')}
      </span>
    );
  }

  return (
    <span className={`rounded-full font-bold bg-slate-100 text-slate-800 border border-slate-200 ${sizeClasses}`}>
      {label || String(value)}
    </span>
  );
}
