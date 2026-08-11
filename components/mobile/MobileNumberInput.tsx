'use client';

import React from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';

interface MobileNumberInputProps {
  label?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  presets?: number[];
  unit?: string;
}

export default function MobileNumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 99999,
  step = 1,
  presets = [1, 5, 10, 50],
  unit = ''
}: MobileNumberInputProps) {
  const handleDecrement = () => {
    const next = Math.max(min, value - step);
    onChange(next);
  };

  const handleIncrement = () => {
    const next = Math.min(max, value + step);
    onChange(next);
  };

  const handleAddPreset = (p: number) => {
    const next = Math.min(max, value + p);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-slate-800">{label}</label>}

      <div className="flex items-center gap-2">
        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-900 font-bold flex items-center justify-center shrink-0 shadow-sm border border-slate-200 active:scale-95 transition-all"
        >
          <Minus className="w-5 h-5" />
        </button>

        {/* Input Field */}
        <div className="relative flex-1">
          <input
            type="number"
            inputMode="numeric"
            value={value}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            className="w-full h-12 px-4 rounded-xl border border-slate-300 font-mono font-bold text-center text-slate-900 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white shadow-inner"
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
              {unit}
            </span>
          )}
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-12 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Touch Presets Chips */}
      {presets && presets.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Cộng nhanh:</span>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleAddPreset(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-900 active:text-white text-slate-800 text-xs font-bold shrink-0 border border-slate-200 transition-colors"
            >
              +{p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChange(0)}
            className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold shrink-0 border border-rose-200 transition-colors ml-auto"
            title="Đặt lại về 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
