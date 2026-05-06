import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const BADGE_COLORS: Record<string, string> = {
  KRITISCH: '#FF2D6F',
  HOCH: '#FF9632',
  NEU: '#78C864',
  default: '#00F0FF',
};

function getBadgeColor(badge?: string) {
  if (!badge) return BADGE_COLORS.default;
  if (badge.includes('CVSS')) return BADGE_COLORS.KRITISCH;
  return BADGE_COLORS[badge] ?? BADGE_COLORS.default;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') ?? 'sicherheit.ai';
  const category = searchParams.get('category') ?? 'KI-Sicherheit';
  const badge = searchParams.get('badge') ?? undefined;
  const author = searchParams.get('author') ?? '';
  const readTime = searchParams.get('readTime') ?? '';

  const badgeColor = getBadgeColor(badge);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: '#060B18',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,240,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Cyan glow top-left */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,240,255,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Magenta glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-60px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,45,111,0.10) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '56px 64px',
          }}
        >
          {/* Top: logo + site name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(0,240,255,0.12)',
                border: '1px solid rgba(0,240,255,0.25)',
                fontSize: '20px',
              }}
            >
              🛡
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#E8EDF8',
                letterSpacing: '-0.01em',
              }}
            >
              sicherheit.ai
            </span>
            <div
              style={{
                marginLeft: '8px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#00F0FF',
                boxShadow: '0 0 8px #00F0FF',
              }}
            />
          </div>

          {/* Middle: badges + title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div
                style={{
                  padding: '5px 14px',
                  borderRadius: '5px',
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: 'rgba(0,240,255,0.12)',
                  color: '#00F0FF',
                  display: 'flex',
                }}
              >
                {category}
              </div>
              {badge && (
                <div
                  style={{
                    padding: '5px 14px',
                    borderRadius: '5px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    background: `${badgeColor}18`,
                    color: badgeColor,
                    display: 'flex',
                  }}
                >
                  {badge}
                </div>
              )}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: title.length > 60 ? '40px' : title.length > 40 ? '48px' : '56px',
                fontWeight: 800,
                color: '#E8EDF8',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom: author + meta */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {author && (
                <>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(0,240,255,0.15)',
                      border: '1px solid rgba(0,240,255,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#00F0FF',
                    }}
                  >
                    {author[0]}
                  </div>
                  <span style={{ fontSize: '15px', color: 'rgba(232,237,248,0.6)' }}>
                    {author}
                  </span>
                  {readTime && (
                    <>
                      <span style={{ color: 'rgba(232,237,248,0.2)', fontSize: '15px' }}>·</span>
                      <span style={{ fontSize: '15px', color: 'rgba(232,237,248,0.6)', fontFamily: 'monospace' }}>
                        {readTime} min
                      </span>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Bottom-right: decorative bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: 'rgba(0,240,255,0.5)',
                letterSpacing: '0.1em',
              }}
            >
              KI-SICHERHEIT · CYBERSECURITY
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #00F0FF, #FF2D6F)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
