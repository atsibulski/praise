import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, type Priority, type Task } from '../store/useStore';
import CookieBurst from '../components/CookieBurst';
import Mascot from '../components/Mascot';

const PRIORITY_CONFIG: Record<Priority, { label: string; icon: string; bgColor: string; textColor: string; dotColor: string }> = {
  high: { label: 'HIGH', icon: '▲', bgColor: 'bg-coral-light', textColor: 'text-coral-dark', dotColor: 'text-coral-dark' },
  medium: { label: 'MEDIUM', icon: '●', bgColor: 'bg-peach-light', textColor: 'text-peach-dark', dotColor: 'text-peach-dark' },
  low: { label: 'LOW', icon: '▼', bgColor: 'bg-lavender-light', textColor: 'text-lavender-dark', dotColor: 'text-lavender-dark' },
};

const CONFIRM_MESSAGES = [
  { heading: 'did you finish this?', sub: "Once you mark it done, you'll earn your reward!" },
  { heading: 'all done with this one?', sub: "Let's check it off and earn some XP!" },
  { heading: 'ready to check this off?', sub: "You're doing awesome today!" },
  { heading: 'is this one complete?', sub: "Every task gets you closer to your goals!" },
];

export default function KidTodo() {
  const { kids, activeKidId, completeTask } = useStore();
  const kid = kids.find((k) => k.id === activeKidId) ?? kids[0];
  const [burst, setBurst] = useState<string | null>(null);
  const [confirmTask, setConfirmTask] = useState<Task | null>(null);
  const [confirmMsg] = useState(() => CONFIRM_MESSAGES[Math.floor(Math.random() * CONFIRM_MESSAGES.length)]);

  const handleTapComplete = (task: Task) => {
    if (task.completedToday) return;
    setConfirmTask(task);
  };

  const handleConfirmYes = () => {
    if (!confirmTask) return;
    completeTask(kid.id, confirmTask.id);
    setBurst(confirmTask.id);
    setConfirmTask(null);
    setTimeout(() => setBurst(null), 800);
  };

  const completedCount = kid.tasks.filter((t) => t.completedToday).length;
  const totalTasks = kid.tasks.length;

  // Group by priority
  const grouped = (['high', 'medium', 'low'] as Priority[]).map(p => ({
    priority: p,
    tasks: kid.tasks.filter(t => t.priority === p && !t.completedToday),
  })).filter(g => g.tasks.length > 0);

  // Completed tasks section
  const completedTasks = kid.tasks.filter(t => t.completedToday);

  return (
    <div className="min-h-screen pb-24 bg-bg">
      <AnimatePresence>
        {burst && <CookieBurst originX={50} originY={30} />}
      </AnimatePresence>

      {/* Top bar */}
      <div className="px-5 pt-14 pb-2 flex items-center justify-between">
        <span className="bg-surface-dim rounded-full px-3 py-1.5 text-xs font-bold text-ink-light flex items-center gap-1">
          🎉 {completedCount} / {totalTasks}
        </span>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-surface-dim flex items-center justify-center text-ink-lighter">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-surface-dim flex items-center justify-center text-ink-lighter text-lg">+</button>
        </div>
      </div>

      {/* Title */}
      <div className="px-5 pt-4 pb-6 text-center">
        <h1 className="text-3xl font-bold font-heading text-ink">To-do</h1>
      </div>

      {/* Priority groups */}
      <div className="px-5 space-y-6">
        {grouped.map(({ priority, tasks }) => {
          const config = PRIORITY_CONFIG[priority];

          return (
            <div key={priority}>
              {/* Section header pill */}
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1.5 ${config.bgColor} ${config.textColor} text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full`}>
                  <span>{config.icon}</span>
                  {config.label} ({tasks.length})
                </span>
                <button className="w-7 h-7 rounded-full bg-surface-dim flex items-center justify-center text-ink-lighter text-sm">+</button>
              </div>

              <div className="space-y-2">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-dim flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{task.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[15px] text-ink">{task.name}</p>
                    </div>
                    <button
                      onClick={() => handleTapComplete(task)}
                      className="w-8 h-8 rounded-full border-2 border-ink-faint flex items-center justify-center transition-all flex-shrink-0 hover:border-lavender active:scale-90"
                    >
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Completed section */}
        {completedTasks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 bg-sage-light text-sage-dark text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                ✓ DONE ({completedTasks.length})
              </span>
            </div>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 opacity-50"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-dim flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{task.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px] text-ink-lighter line-through">{task.name}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-sage border-2 border-sage-dark flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {grouped.length === 0 && completedTasks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-bold text-ink text-lg font-heading">No tasks yet!</p>
            <p className="text-sm text-ink-lighter">Ask your parent to add some tasks.</p>
          </div>
        )}
      </div>

      {/* Mascot */}
      <div className="fixed bottom-24 right-4 z-30">
        <Mascot size="md" />
      </div>

      {/* Confirm completion dialog */}
      <AnimatePresence>
        {confirmTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
            onClick={() => setConfirmTask(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-t-3xl px-6 pt-4 pb-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-surface-dimmer rounded-full mx-auto mb-6" />

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                className="mb-5"
              >
                <div className="w-20 h-20 rounded-2xl bg-lavender-light flex items-center justify-center">
                  <span className="text-5xl">{confirmTask.emoji}</span>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl font-bold font-heading text-ink mb-2"
              >
                {confirmMsg.heading}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-ink-light text-[15px] leading-relaxed mb-2"
              >
                {confirmMsg.sub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-3 bg-surface-dim rounded-2xl px-4 py-3 mb-8"
              >
                <span className="text-lg font-bold text-ink">{confirmTask.name}</span>
                <span className="ml-auto text-sm font-bold text-lavender-dark bg-lavender-light px-2.5 py-1 rounded-full">
                  +{confirmTask.xp} XP
                </span>
                <span className="text-sm font-bold text-amber-dark">
                  +{confirmTask.cookies} 🍪
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setConfirmTask(null)}
                  className="flex-1 bg-white border-2 border-surface-dimmer text-ink font-bold py-4 rounded-full text-base"
                >
                  not yet
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleConfirmYes}
                  className="flex-[1.3] bg-ink text-white font-bold py-4 rounded-full text-base"
                >
                  yes, done! 🎉
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
