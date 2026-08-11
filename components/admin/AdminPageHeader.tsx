'use client';

import React from 'react';
import { Plus, LucideIcon } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  children?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon = Plus,
  onAction,
  children
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {description && (
          <p className="text-xs text-slate-500 font-medium mt-0.5">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {children}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-2 shrink-0"
          >
            <ActionIcon className="w-4 h-4 stroke-[2.5px]" />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
