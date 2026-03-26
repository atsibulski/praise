import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  value: number;
  className?: string;
  duration?: number;
  showEuro?: boolean;
}

export default function AnimatedCookieCount({
  value,
  className = '',
  duration = 800,
  showEuro = false,
}: Props) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span className={className}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={display}
          initial={{ y: 4, opacity: 0.7 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block"
        >
          {display} 🍪
        </motion.span>
      </AnimatePresence>
      {showEuro && (
        <span className="text-sm font-normal text-gray-400 ml-2">
          €{(value / 10).toFixed(2)}
        </span>
      )}
    </span>
  );
}
