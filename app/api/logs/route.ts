import { NextResponse } from 'next/server';
import { getAuditLogs } from '../../../lib/services/auditLogger';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  const logs = getAuditLogs(type || 'ALL');
  return NextResponse.json({ success: true, logs });
}
