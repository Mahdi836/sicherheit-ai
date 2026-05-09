'use client';

import { useEffect, useState } from 'react';

export default function IntroAnimation() {
  const [phase, setPhase] = useState<'show' | 'fadeout' | 'done'>('show');

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem('intro_played')) {
      setPhase('done');
      return;
    }
    sessionStorage.setItem('intro_played', '1');

    // Phase timeline
    const t1 = setTimeout(() => setPhase('fadeout'), 2200);
    const t2 = setTimeout(() => setPhase('done'), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 'done') return null;

  return (
    <>
      <style>{`
        @keyframes sai-scan {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(1800%); opacity: 0; }
        }
        @keyframes sai-logo-in {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes sai-tag-in {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes sai-shield-draw {
          0%   { stroke-dashoffset: 200; opacity: 0; }
          20%  { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes sai-dot-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes sai-bar-grow {
          0%   { width: 0; opacity: 0; }
          20%  { opacity: 1; }
          100% { width: 80px; opacity: 1; }
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#060B18',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: phase === 'fadeout' ? 0 : 1,
        transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: phase === 'fadeout' ? 'none' : 'all',
        overflow: 'hidden',
      }}>

        {/* Scan line */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.6), transparent)',
            animation: 'sai-scan 1.8s ease-in-out 0.2s both',
          }} />
        </div>

        {/* Subtle grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(0,240,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* Center content */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
        }}>

          {/* Shield icon */}
          <div style={{
            animation: 'sai-logo-in 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both',
          }}>
            <svg width="48" height="52" viewBox="0 0 48 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M24 2 L44 10 L44 30 Q44 44 24 50 Q4 44 4 30 L4 10 Z"
                stroke="#00F0FF"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeDasharray="200"
                style={{ animation: 'sai-shield-draw 0.9s ease-out 0.35s both' }}
              />
              <text
                x="24" y="33"
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="18"
                fontWeight="900"
                fill="#00F0FF"
                style={{ animation: 'sai-logo-in 0.5s ease-out 0.75s both', opacity: 0 }}
              >
                S
              </text>
            </svg>
          </div>

          {/* Wordmark */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            animation: 'sai-logo-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both',
          }}>
            <div style={{
              fontFamily: 'monospace',
              fontSize: 'clamp(26px, 5vw, 36px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#fff',
              lineHeight: 1,
            }}>
              sicherheit
              <span style={{ color: '#00F0FF' }}>.ai</span>
            </div>

            {/* Animated bar */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #00F0FF, transparent)',
              animation: 'sai-bar-grow 0.6s ease-out 0.9s both',
            }} />

            {/* Tagline */}
            <div style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(0,240,255,0.6)',
              animation: 'sai-tag-in 0.6s ease-out 1.1s both',
            }}>
              KI-Sicherheit & Cybersecurity
            </div>
          </div>

          {/* Blinking cursor */}
          <div style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#00F0FF',
            animation: 'sai-dot-pulse 0.8s ease-in-out 1.3s 3',
            opacity: 0,
          }}>
            _
          </div>
        </div>

        {/* Corner decorations */}
        {[
          { top: '20px', left: '20px', borderTop: '1px solid', borderLeft: '1px solid' },
          { top: '20px', right: '20px', borderTop: '1px solid', borderRight: '1px solid' },
          { bottom: '20px', left: '20px', borderBottom: '1px solid', borderLeft: '1px solid' },
          { bottom: '20px', right: '20px', borderBottom: '1px solid', borderRight: '1px solid' },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: '16px', height: '16px',
            borderColor: 'rgba(0,240,255,0.25)',
            ...s,
            animation: `sai-tag-in 0.4s ease-out ${0.2 + i * 0.05}s both`,
          }} />
        ))}
      </div>
    </>
  );
}
