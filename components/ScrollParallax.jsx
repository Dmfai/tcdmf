'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 滚动视差文字组件：随滚动产生轻微纵向位移 + 打字机闪烁光标
 * @param {object} props
 * @param {string} props.text
 */
export default function ScrollParallax({ text }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(center * -0.15);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={ref} className="parallax">
      <h1 style={{ transform: `translateY(${offset}px)` }}>
        {text}
        <span style={{
          display: 'inline-block',
          width: 3,
          height: '0.8em',
          background: 'var(--color-accent)',
          marginLeft: 4,
          verticalAlign: 'text-bottom',
          animation: 'blink 1s step-end infinite',
        }} />
      </h1>
    </div>
  );
}
