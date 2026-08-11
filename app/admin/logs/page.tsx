'use client';

import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw, CheckCircle2, XCircle, Clock, Filter, ShieldCheck, Share2, MessageSquare, Ticket } from 'lucide-react';
import { fetchApi } from '../../../lib/api';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');

  const loadLogs = () => {
    setLoading(true);
    fetchApi(`/logs?type=${typeFilter}`)
      .then((data) => setLogs(data.logs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, [typeFilter]);

  return (
    <div className="space-y-6">
      
      <AdminPageHeader
        title="Nhật Ký Hệ Thống & Giao Dịch Audit Logs"
        description="Ghi lại lịch sử giao dịch thanh toán, lịch sử tích hợp Zalo, SMS, KiotViet & Facebook"
      >
        <button
          onClick={loadLogs}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Tải Lại Nhật Ký
        </button>
      </AdminPageHeader>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { key: 'ALL', label: 'Tất Cả Logs' },
          { key: 'transaction', label: '💳 Giao Dịch Đơn Hàng' },
          { key: 'integration_kiotviet', label: '🏬 KiotViet Sync' },
          { key: 'integration_facebook', label: '🌐 Facebook Cross-Post' },
          { key: 'integration_zalo', label: '💬 Zalo ZNS / SMS' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTypeFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              typeFilter === tab.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Logs Table & Mobile Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-slate-500">
          Đang tải hòm nhật ký...
        </div>
      ) : logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log) => {
            const isSuccess = log.status === 'success';
            const isFailed = log.status === 'failed';

            return (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        log.type === 'transaction'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.type === 'integration_kiotviet'
                          ? 'bg-blue-100 text-blue-800'
                          : log.type === 'integration_facebook'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.type}
                    </span>

                    <span className="font-mono text-xs font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(log.createdAt).toLocaleString('vi-VN')}</span>
                  </div>

                  <p className="text-xs font-medium text-slate-700">{log.detail}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
                      isSuccess
                        ? 'bg-emerald-600 text-white'
                        : isFailed
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {isSuccess ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Thành công
                      </>
                    ) : isFailed ? (
                      <>
                        <XCircle className="w-3 h-3" /> Thất bại
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" /> Đang chờ
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Chưa có nhật ký nào cho mục này</h3>
        </div>
      )}

    </div>
  );
}
