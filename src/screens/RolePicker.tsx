import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function RolePicker() {
  const navigate = useNavigate();
  const { kids, setViewMode, setActiveKid } = useStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-cream">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="text-7xl mb-4"
      >
        🍪
      </motion.div>

      <h1 className="text-4xl font-bold text-warm-gray font-heading mb-2">Praise</h1>
      <p className="text-warm-gray-light mb-10 text-center">
        Who's using the app?
      </p>

      <div className="w-full max-w-xs space-y-3">
        {/* Parent */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setViewMode('parent');
            navigate('/');
          }}
          className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 active:bg-cream transition-colors"
        >
          <div className="w-14 h-14 rounded-full bg-purple-light flex items-center justify-center">
            <span className="text-3xl">👨‍👩‍👧</span>
          </div>
          <div className="text-left">
            <p className="font-bold text-warm-gray text-lg">I'm a Parent</p>
            <p className="text-sm text-warm-gray-light">Manage tasks & award cookies</p>
          </div>
        </motion.button>

        {/* Kids */}
        {kids.map((kid, i) => (
          <motion.button
            key={kid.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setActiveKid(kid.id);
              setViewMode('kid');
              navigate(`/kid/${kid.name.toLowerCase()}`);
            }}
            className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 active:bg-cream transition-colors"
          >
            <div className="w-14 h-14 rounded-full bg-mint-light flex items-center justify-center">
              <span className="text-3xl">{kid.emoji}</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-warm-gray text-lg">I'm {kid.name}</p>
              <p className="text-sm text-warm-gray-light">
                {kid.cookieBalance} cookies · 🔥 {kid.streak} day streak
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
