import { motion } from 'framer-motion';

const COLORS = ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6', '#EF4444'];
const EMOJIS = ['🍪', '🎉', '⭐', '🌟', '✨'];

export default function Confetti() {
  const items = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 1.8 + Math.random() * 1.5,
    color: COLORS[i % COLORS.length],
    emoji: i % 5 === 0 ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : null,
    size: 6 + Math.random() * 10,
    rotation: Math.random() * 720,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: -20,
            fontSize: item.emoji ? '1.5rem' : undefined,
            width: item.emoji ? undefined : item.size,
            height: item.emoji ? undefined : item.size * 0.6,
            backgroundColor: item.emoji ? undefined : item.color,
            borderRadius: item.emoji ? undefined : 2,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: '100vh',
            opacity: [1, 1, 0],
            rotate: item.rotation,
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            ease: 'easeIn',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
