import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import Mascot from '../components/Mascot';

export default function RolePicker() {
  const navigate = useNavigate();
  const { kids, setViewMode, setActiveKid } = useStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-bg relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-20 left-8 w-16 h-16 rounded-full bg-lavender/20" />
      <div className="absolute top-40 right-12 w-10 h-10 rounded-full bg-peach/30" />
      <div className="absolute bottom-40 left-16 w-12 h-12 rounded-full bg-sage/20" />
      <div className="absolute bottom-20 right-8 w-8 h-8 rounded-full bg-coral/20" />

      {/* Mascot + Title */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="mb-2"
      >
        <Mascot size="lg" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-ink font-heading mb-1"
      >
        Praise
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-ink-lighter mb-10 text-center text-sm"
      >
        Who's using the app today?
      </motion.p>

      <div className="w-full max-w-xs space-y-3">
        {/* Parent */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setViewMode('parent');
            navigate('/');
          }}
          className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm active:bg-surface-dim transition-colors"
        >
          <div className="w-14 h-14 rounded-2xl bg-lavender-light flex items-center justify-center">
            <span className="text-3xl">👨‍👩‍👧</span>
          </div>
          <div className="text-left">
            <p className="font-bold text-ink text-lg">I'm a Parent</p>
            <p className="text-sm text-ink-lighter">Manage tasks & rewards</p>
          </div>
        </motion.button>

        {/* Kids */}
        {kids.map((kid, i) => (
          <motion.button
            key={kid.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setActiveKid(kid.id);
              setViewMode('kid');
              navigate(`/kid/${kid.name.toLowerCase()}`);
            }}
            className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm active:bg-surface-dim transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center">
              <span className="text-3xl">{kid.emoji}</span>
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-ink text-lg">I'm {kid.name}</p>
              <p className="text-sm text-ink-lighter flex items-center gap-2">
                <span>⚡ {kid.xp} XP</span>
                <span>·</span>
                <span>🔥 {kid.streak} day streak</span>
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-10">
        <div className="w-2 h-2 rounded-full bg-ink" />
        <div className="w-2 h-2 rounded-full bg-ink-faint" />
        <div className="w-2 h-2 rounded-full bg-ink-faint" />
      </div>
    </div>
  );
}
