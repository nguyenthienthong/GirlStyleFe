'use client';

import React from 'react';
import { X, LucideIcon } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: LucideIcon;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  children: React.ReactNode;
}

export default function AdminModal({
  isOpen,
  onClose,
  title,
  icon: Icon,
  maxWidth = 'md',
  children
}: AdminModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl'
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div
        className={`relative w-full ${maxWidthClasses} bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-300 animate-in zoom-in-95 max-h-[92vh] flex flex-col justify-between`}
      >
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-slate-300" />}
            <h3 className="text-base font-bold uppercase tracking-wider">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}
