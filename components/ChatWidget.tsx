'use client';

import React, { useState } from 'react';
import { MessageCircle, X, PhoneCall, Send, Sparkles } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border-2 border-[#C21A27] overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#C21A27] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white text-[#C21A27] flex items-center justify-center font-black text-sm">
                  GS
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-white border-2 border-[#C21A27] rounded-full"></span>
              </div>
              <div>
                <h4 className="text-sm font-black">GirlStyle Assistant</h4>
                <p className="text-[11px] text-white/90 flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3 h-3" /> Trợ lý tư vấn Size & Outfit
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 text-xs bg-[#EDE8E2]/40">
            <div className="bg-white p-3 rounded-xl border border-[#EDE8E2] shadow-sm text-black font-medium">
              👋 Chào nàng! GirlStyle® có thể hỗ trợ nàng tư vấn màu sắc, size hay kiểm tra đơn hàng nào ạ?
            </div>
            
            <div className="pt-2 space-y-2">
              <a
                href="https://zalo.me/0901234567"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-black text-white font-extrabold hover:bg-black/90 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#C21A27] text-white flex items-center justify-center text-[10px] font-black">ZALO</span>
                  <span>Chat tư vấn qua Zalo OA</span>
                </div>
                <Send className="w-4 h-4 text-[#C21A27]" />
              </a>

              <a
                href="https://m.me/girlstyle.fashion"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#EDE8E2] text-black font-extrabold hover:bg-[#EDE8E2]/80 transition-colors border border-black/10"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-black text-white flex items-center justify-center text-[10px] font-black">FB</span>
                  <span>Nhắn tin Facebook Fanpage</span>
                </div>
                <Send className="w-4 h-4 text-black" />
              </a>

              <a
                href="tel:19006868"
                className="flex items-center justify-between p-3 rounded-xl bg-[#C21A27] text-white font-extrabold hover:bg-[#a5131f] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-white" />
                  <span>Gọi Hotline 1900 6868</span>
                </div>
                <span className="text-[10px] bg-white text-[#C21A27] px-2 py-0.5 rounded font-black">24/7</span>
              </a>
            </div>
          </div>

          <div className="p-3 bg-black text-center text-[10px] text-[#EDE8E2] font-bold">
            Phản hồi nhanh trong vòng 2 phút ⚡
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-[#C21A27] text-white p-4 rounded-full shadow-2xl hover:bg-[#a5131f] transition-all transform hover:scale-110 flex items-center justify-center glow-red"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-[#C21A27] animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-[#C21A27]"></span>
      </button>
    </div>
  );
}
