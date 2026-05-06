'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';

type HoverState = 'default' | 'link' | 'image';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hover, setHover]   = useState<HoverState>('default');
  const [isTouch, setIsTouch] = useState(true); // assume touch until proven otherwise

  const dotX  = useMotionValue(0);
  const dotY  = useMotionValue(0);

  // Ring lags behind with spring
  const ringX = useSpring(dotX, { stiffness: 200, damping: 22, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 200, damping: 22, mass: 0.4 });

  useEffect(() => {
    // Only enable on fine-pointer devices (mouse)
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setIsTouch(false);
    document.body.classList.add('custom-cursor');

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visible) setVisible(true);

      const el = e.target as Element;
      if (el.closest('img, video, canvas')) setHover('image');
      else if (el.closest('a, button, [role="button"], label, input, textarea, select')) setHover('link');
      else setHover('default');
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.body.classList.remove('custom-cursor');
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isTouch) return null;

  const ringSize = hover === 'image' ? 72 : hover === 'link' ? 52 : 36;
  const ringColor =
    hover === 'image' ? 'var(--magenta)' :
    hover === 'link'  ? 'var(--cyan)'    :
    'rgba(255,255,255,0.65)';

  return (
    <>
      {/* Exact-position dot */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'var(--cyan)',
          pointerEvents: 'none',
          zIndex: 99999,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference',
        }}
        animate={{ opacity: visible ? 1 : 0, scale: hover === 'link' ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
      />

      {/* Lagging ring */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
          borderColor: ringColor,
          borderWidth: 1.5,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        initial={{ width: 36, height: 36, borderColor: 'rgba(255,255,255,0.65)', borderStyle: 'solid', borderWidth: 1.5 }}
      >
        {hover === 'image' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: '9px',
              fontFamily: 'var(--mono)',
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.9)',
              userSelect: 'none',
            }}
          >
            VIEW
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
