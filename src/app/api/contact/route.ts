import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = 'mahdi.mahmoud2008@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const { name, email, betreff, nachricht, zweck } = await req.json();

    if (!name || !email || !nachricht) {
      return NextResponse.json({ error: 'Name, E-Mail und Nachricht sind Pflichtfelder.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
    }
    if (nachricht.length > 5000) {
      return NextResponse.json({ error: 'Nachricht zu lang (max. 5000 Zeichen).' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      // Fallback: log only (until API key is set)
      console.log('[KONTAKT]', { name, email, betreff, zweck, nachricht: nachricht.slice(0, 100) });
      return NextResponse.json({ success: true, fallback: true });
    }

    const betreffLine = betreff
      ? `${zweck ? `[${zweck}] ` : ''}${betreff}`
      : `${zweck ? `[${zweck}] ` : ''}Neue Kontaktanfrage von ${name}`;

    const { error } = await resend.emails.send({
      from: 'sicherheit.ai <kontakt@sicherheit.ai>',
      to: TO_EMAIL,
      replyTo: email,
      subject: betreffLine,
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; background: #060B18; color: #e0e0e0; padding: 32px; border-radius: 12px;">
          <div style="color: #00F0FF; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 20px;">
            // Neue Anfrage — sicherheit.ai
          </div>
          <h2 style="color: #ffffff; margin: 0 0 24px; font-size: 20px;">${betreffLine}</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 12px; width: 120px;">Name</td>
              <td style="padding: 10px 0; color: #e0e0e0; font-size: 14px;">${name}</td>
            </tr>
            <tr style="border-top: 1px solid #1a2035;">
              <td style="padding: 10px 0; color: #888; font-size: 12px;">E-Mail</td>
              <td style="padding: 10px 0; color: #00F0FF; font-size: 14px;"><a href="mailto:${email}" style="color: #00F0FF;">${email}</a></td>
            </tr>
            ${zweck ? `
            <tr style="border-top: 1px solid #1a2035;">
              <td style="padding: 10px 0; color: #888; font-size: 12px;">Zweck</td>
              <td style="padding: 10px 0; color: #e0e0e0; font-size: 14px;">${zweck}</td>
            </tr>` : ''}
            ${betreff ? `
            <tr style="border-top: 1px solid #1a2035;">
              <td style="padding: 10px 0; color: #888; font-size: 12px;">Betreff</td>
              <td style="padding: 10px 0; color: #e0e0e0; font-size: 14px;">${betreff}</td>
            </tr>` : ''}
          </table>
          <div style="margin-top: 24px; padding: 20px; background: #0A0F1E; border-radius: 8px; border: 1px solid #1a2035;">
            <div style="color: #888; font-size: 11px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.08em;">Nachricht</div>
            <div style="color: #e0e0e0; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${nachricht}</div>
          </div>
          <div style="margin-top: 24px; color: #555; font-size: 11px; border-top: 1px solid #1a2035; padding-top: 16px;">
            Gesendet über sicherheit.ai · ${new Date().toLocaleString('de-DE')}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[CONTACT] Resend error:', error);
      return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[CONTACT] Unexpected error:', err);
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 });
  }
}
