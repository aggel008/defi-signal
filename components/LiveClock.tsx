'use client';

import { useEffect, useState } from 'react';

export function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toUTCString().split(' ').slice(4, 5)[0] + ' UTC'
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-xs font-mono text-slate-400 tabular-nums">
      {time || '00:00:00 UTC'}
    </span>
  );
}
