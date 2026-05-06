'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import JsonLd, { faqSchema } from './JsonLd';

interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  items: FaqItem[];
  title?: string;
}

export default function FaqAccordion({ items, title = 'Häufige Fragen' }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section>
      <JsonLd data={faqSchema(items)} />

      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: '16px' }}>
        // FAQ
      </div>
      <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '24px' }}>
        {title}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              style={{
                background: isOpen ? 'var(--card-bg)' : 'transparent',
                border: '1px solid',
                borderColor: isOpen ? 'var(--border-bright)' : 'var(--border)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'border-color 0.2s, background 0.2s',
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  width: '100%', textAlign: 'left',
                  padding: '18px 20px',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--cyan)', fontWeight: 700, flexShrink: 0 }}>
                  Q{String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ flex: 1, fontSize: '15px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>
                  {item.q}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ flexShrink: 0 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 20px 20px 48px' }}>
                      <p style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.75, margin: 0 }}>
                        {item.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
