import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, source, tool } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
    }

    // TODO: Mit n8n/Supabase verbinden — Webhook-URL eintragen
    // const n8nWebhook = process.env.N8N_LEAD_WEBHOOK;
    // if (n8nWebhook) await fetch(n8nWebhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source, tool, ts: new Date().toISOString() }) });

    console.log('[LEAD]', { email, source: source ?? 'tool', tool: tool ?? 'unknown', ts: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 });
  }
}
