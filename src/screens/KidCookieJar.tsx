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
  task: { id: string; name: string; cookies: number; completedToday: boolean; icon?: string };
  onComplete: () => void;
}) {
  const x = useMotionValue(0);
  const bg = useTransform(x, [-120, 0], ['#22C55E', '#FFFFFF']);
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
        className={`relative flex items-center gap-3 bg-white rounded-2xl px-4 py-4 z-10 ${
          task.completedToday ? 'opacity-60' : ''
        }`}
      >
        {/* Circle checkbox */}
        <div
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            task.completedToday
              ? 'bg-mint border-mint text-white'
              : 'border-warm-gray-lighter'
          }`}
        >
          {task.completedToday && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`font-bold text-[15px] ${
              task.completedToday ? 'line-through text-warm-gray-light' : 'text-warm-gray'
            }`}
          >
            {task.name}
          </p>
          <p className="text-xs text-warm-gray-light mt-0.5">
            ↻ daily
          </p>
        </div>
        <span className="text-mint-dark font-bold text-sm flex-shrink-0">+{task.cookies}🍪</span>
        {!task.completedToday && (
          <span className="text-warm-gray-lighter text-[10px] animate-swipe-hint flex-shrink-0">← swipe</span>
        )}
      </motion.div>
    </div>
  );
}

export default function KidCookieJar() {
  const navigate = useNavigate();
  const { kids, activeKidId, completeTask } = useStore();
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
    <div className="min-h-screen pb-24 bg-cream">
      <AnimatePresence>
        {burst && <CookieBurst originX={50} originY={30} />}
      </AnimatePresence>

      {/* Header bar */}
      <div className="bg-mint px-5 pt-14 pb-6 rounded-b-[28px]">
        <div className="flex items-center justify-center mb-5">
          <p className="text-white/80 font-semibold text-sm font-heading">{kid.emoji} {kid.name}'s Cookie Jar</p>
        </div>

        {/* Hero balance */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="text-5xl mb-2"
          >
            🍪
          </motion.div>
          <AnimatedCookieCount
            value={kid.cookieBalance}
            className="text-4xl font-extrabold text-white block"
            showEuro
            duration={1200}
          />
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              🔥 {kid.streak} day streak
            </span>
            {kid.depositBalance > 0 && (
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                📈 {kid.depositBalance} saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Today's tasks */}
      <div className="px-5 mt-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-warm-gray-light uppercase tracking-wider">
            Today's Tasks
          </h3>
          <span className="text-xs font-semibold text-mint-dark">
            {completedCount}/{kid.tasks.length} done
          </span>
        </div>

        {allDone ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-10 bg-mint-light rounded-3xl"
          >
            <p className="text-4xl mb-2">🌟</p>
            <p className="font-bold text-mint-dark text-lg">All tasks complete!</p>
            <p className="text-sm text-warm-gray-light">Amazing work today!</p>
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
          onClick={() => navigate('redeem')}
          className="w-full bg-mint text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg shadow-mint/25"
        >
          Redeem Cookies 🎁
        </motion.button>
      </div>
    </div>
  );
}
