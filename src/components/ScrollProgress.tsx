'use client';

import { useEffect } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const el = document.getElementById('scroll-progress');
    if (el) el.style.width = `${v * 100}%`;
  });

  // Reset to 0 on mount
  useEffect(() => {
    const el = document.getElementById('scroll-progress');
    if (el) el.style.width = '0%';
  }, []);

  return null;
}
