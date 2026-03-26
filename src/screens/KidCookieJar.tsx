import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import AnimatedCookieCount from '../components/AnimatedCookieCount';
import CookieBurst from '../components/CookieBurst';

function SwipeTask({
  task,
  onComplete,
}: {
  task: { id: string; name: string; cookies: number; completedToday: boolean };
  onComplete: () => void;
}) {
  const x = useMotionValue(0);
  const bg = useTransform(x, [-120, 0], ['#10B981', '#FFFFFF']);
  const checkOpacity = useTransform(x, [-120, -60, 0], [1, 0.5, 0]);
  const constraintsRef = useRef(null);

  return (
    <div ref={constraintsRef} className="relative overflow-hidden rounded-2xl">
      {/* Background reveal */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-6 rounded-2xl"
        style={{ backgroundColor: bg }}
      >
        <motion.span style={{ opacity: checkOpacity }} className="text-white text-2xl font-bold">
          ✓ Done!
        </motion.span>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -100) onComplete();
        }}
        className={`relative flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-gray-100 z-10 ${
          task.completedToday ? 'opacity-50' : ''
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completedToday
              ? 'bg-mint border-mint text-white'
              : 'border-gray-300'
          }`}
        >
          {task.completedToday && <span className="text-xs">✓</span>}
        </div>
        <div className="flex-1">
          <p
            className={`font-semibold ${
              task.completedToday ? 'line-through text-gray-400' : 'text-gray-700'
            }`}
          >
            {task.name}
          </p>
        </div>
        <span className="text-cookie-dark font-bold text-sm">+{task.cookies} 🍪</span>
        {!task.completedToday && (
          <span className="text-gray-300 text-xs animate-swipe-hint">← swipe</span>
        )}
      </motion.div>
    </div>
  );
}

export default function KidCookieJar() {
  const navigate = useNavigate();
  const { kids, activeKidId, completeTask, setViewMode } = useStore();
  const kid = kids.find((k) => k.id === activeKidId) ?? kids[0];
  const [burst, setBurst] = useState<string | null>(null);

  const handleComplete = (taskId: string) => {
    completeTask(kid.id, taskId);
    setBurst(taskId);
    setTimeout(() => setBurst(null), 800);
  };

  const completedCount = kid.tasks.filter((t) => t.completedToday).length;
  const allDone = completedCount === kid.tasks.length;

  return (
    <div className="min-h-screen pb-24">
      <AnimatePresence>
        {burst && <CookieBurst originX={50} originY={30} />}
      </AnimatePresence>

      {/* Header */}
      <div className="px-5 pt-12 pb-2 flex items-center justify-between">
        <button
          onClick={() => {
            setViewMode('parent');
            navigate('/');
          }}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500"
        >
          ←
        </button>
        <div className="text-center">
          <p className="text-sm text-gray-400">{kid.emoji} {kid.name}'s</p>
          <h1 className="text-lg font-extrabold text-gray-800">Cookie Jar</h1>
        </div>
        <div className="w-10" />
      </div>

      {/* Hero balance */}
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="text-6xl mb-3"
        >
          🍪
        </motion.div>
        <AnimatedCookieCount
          value={kid.cookieBalance}
          className="text-5xl font-extrabold text-cookie-dark block"
          showEuro
          duration={1200}
        />
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="bg-orange-100 text-orange-600 text-sm font-bold px-3 py-1 rounded-full">
            🔥 {kid.streak} day streak
          </span>
          {kid.depositBalance > 0 && (
            <span className="bg-purple-100 text-purple-600 text-sm font-bold px-3 py-1 rounded-full">
              💰 {kid.depositBalance} saved
            </span>
          )}
        </div>
      </div>

      {/* Today's tasks */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Today's Tasks
          </h3>
          <span className="text-xs text-gray-400">
            {completedCount}/{kid.tasks.length} done
          </span>
        </div>

        {allDone ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8 bg-mint-light rounded-3xl"
          >
            <p className="text-4xl mb-2">🌟</p>
            <p className="font-bold text-mint-dark">All tasks complete!</p>
            <p className="text-sm text-gray-400">Amazing work today!</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {kid.tasks.map((task) => (
              <SwipeTask
                key={task.id}
                task={task}
                onComplete={() => handleComplete(task.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Redeem CTA */}
      <div className="px-5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/redeem')}
          className="w-full bg-gradient-to-r from-cookie to-cookie-dark text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg shadow-cookie/30"
        >
          Redeem Cookies 🎁
        </motion.button>
      </div>
    </div>
  );
}
