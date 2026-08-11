import { getStore, saveStore } from '../dataStore';

export interface AuditLogItem {
  id: string;
  type: 'transaction' | 'integration_zalo' | 'integration_sms' | 'integration_kiotviet' | 'integration_facebook' | 'system';
  action: string;
  detail: string;
  status: 'success' | 'failed' | 'pending';
  metadata?: any;
  createdAt: string;
}

export function addAuditLog(
  type: AuditLogItem['type'],
  action: string,
  detail: string,
  status: AuditLogItem['status'] = 'success',
  metadata: any = {}
) {
  const store = getStore();
  const newLog: AuditLogItem = {
    id: `LOG_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    type,
    action,
    detail,
    status,
    metadata,
    createdAt: new Date().toISOString()
  };

  store.logs.unshift(newLog);
  // Keep last 500 log items
  if (store.logs.length > 500) {
    store.logs = store.logs.slice(0, 500);
  }
  saveStore();
  return newLog;
}

export function getAuditLogs(typeFilter?: string) {
  const store = getStore();
  if (!typeFilter || typeFilter === 'ALL') {
    return store.logs || [];
  }
  return (store.logs || []).filter((l: AuditLogItem) => l.type === typeFilter);
}
