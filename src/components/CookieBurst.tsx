import { motion } from 'framer-motion';

interface Props {
  count?: number;
  originX?: number;
  originY?: number;
}

export default function CookieBurst({ count = 8, originX = 50, originY = 50 }: Props) {
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i + Math.random() * 30;
    const distance = 40 + Math.random() * 60;
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;
    return { id: i, x, y, rotate: Math.random() * 360, scale: 0.6 + Math.random() * 0.6 };
  });

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{ perspective: 600 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-2xl"
          style={{ left: `${originX}%`, top: `${originY}%` }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
          animate={{
            opacity: 0,
            x: p.x,
            y: p.y,
            scale: p.scale * 0.3,
            rotate: p.rotate,
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          🍪
        </motion.div>
      ))}
    </div>
  );
}
