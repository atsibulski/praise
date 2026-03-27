import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, type TimeSlot, type Task } from '../store/useStore';
import CookieBurst from '../components/CookieBurst';
import Mascot from '../components/Mascot';

const TIME_SLOT_CONFIG: Record<TimeSlot, { label: string; emoji: string; bgColor: string; textColor: string }> = {
  anytime: { label: 'ANYTIME', emoji: '🕐', bgColor: 'bg-surface-dim', textColor: 'text-ink-light' },
  morning: { label: 'MORNING', emoji: '🌅', bgColor: 'bg-lavender-light', textColor: 'text-lavender-dark' },
  afternoon: { label: 'AFTERNOON', emoji: '☀️', bgColor: 'bg-peach-light', textColor: 'text-peach-dark' },
  evening: { label: 'EVENING', emoji: '🌙', bgColor: 'bg-[#E0E7FF]', textColor: 'text-[#4338CA]' },
};

const CONFIRM_MESSAGES = [
  { heading: 'did you finish this?', sub: "Once you mark it done, you'll earn your reward!" },
  { heading: 'all done with this one?', sub: "Let's check it off and earn some XP!" },
  { heading: 'ready to check this off?', sub: "You're doing awesome today!" },
  { heading: 'is this one complete?', sub: "Every task gets you closer to your goals!" },
];

function TaskCard({
  task,
  onTapComplete,
}: {
  task: Task;
  onTapComplete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const subtasksDone = task.subtasks?.filter(s => s.done).length ?? 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl px-4 py-3.5 ${task.completedToday ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Emoji icon */}
        <div className="w-10 h-10 rounded-xl bg-surface-dim flex items-center justify-center flex-shrink-0">
          <span className="text-xl">{task.emoji}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-[15px] ${task.completedToday ? 'line-through text-ink-lighter' : 'text-ink'}`}>
            {task.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-ink-lighter">{task.duration}m</span>
            {hasSubtasks && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-ink-lighter flex items-center gap-0.5"
              >
                <span className="bg-surface-dim rounded px-1.5 py-0.5 text-[10px] font-semibold">
                  {subtasksDone}/{task.subtasks!.length}
                </span>
                <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            )}
          </div>
        </div>

        {/* XP badge */}
        <span className="text-xs font-bold text-lavender-dark bg-lavender-light px-2 py-1 rounded-full flex-shrink-0">
          +{task.xp} XP
        </span>

        {/* Circle checkbox */}
        <button
          onClick={onTapComplete}
          disabled={task.completedToday}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            task.completedToday
              ? 'bg-sage border-sage-dark'
              : 'border-ink-faint hover:border-lavender active:scale-90'
          }`}
        >
          {task.completedToday && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Subtasks expansion */}
      <AnimatePresence>
        {expanded && hasSubtasks && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 ml-13 space-y-2 border-t border-surface-dim pt-3">
              {task.subtasks!.map(sub => (
                <div key={sub.id} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sub.done ? 'bg-sage border-sage-dark' : 'border-ink-faint'}`}>
                    {sub.done && <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className={`text-sm ${sub.done ? 'line-through text-ink-lighter' : 'text-ink-light'}`}>{sub.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function KidCookieJar() {
  const { kids, activeKidId, completeTask } = useStore();
  const kid = kids.find((k) => k.id === activeKidId) ?? kids[0];
  const [burst, setBurst] = useState<string | null>(null);
  const [confirmTask, setConfirmTask] = useState<Task | null>(null);

  // Pick a random confirmation message per dialog open
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

  // Group tasks by time slot
  const grouped = (['anytime', 'morning', 'afternoon', 'evening'] as TimeSlot[]).map(slot => ({
    slot,
    tasks: kid.tasks.filter(t => t.timeSlot === slot),
  })).filter(g => g.tasks.length > 0);

  // Get the current day name
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Mascot encouragement messages
  const getMascotMessage = () => {
    if (completedCount === totalTasks) return 'All done! Amazing! 🌟';
    if (completedCount > totalTasks / 2) return `${totalTasks - completedCount} more to go! 💪`;
    if (completedCount > 0) return 'Great start! Keep going!';
    return "Let's do this! 🎯";
  };

  return (
    <div className="min-h-screen pb-24 bg-bg">
      <AnimatePresence>
        {burst && <CookieBurst originX={50} originY={30} />}
      </AnimatePresence>

      {/* Top bar */}
      <div className="px-5 pt-14 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-surface-dim rounded-full px-3 py-1.5 text-xs font-bold text-ink-light flex items-center gap-1">
            🎉 {completedCount} / {totalTasks}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-lavender-light rounded-full px-3 py-1.5 text-xs font-bold text-lavender-dark">
            ⚡ {kid.xp} XP
          </span>
          <span className="bg-amber-light rounded-full px-3 py-1.5 text-xs font-bold text-amber-dark">
            🔥 {kid.streak}
          </span>
        </div>
      </div>

      {/* Day header */}
      <div className="px-5 pt-4 pb-6 flex items-center justify-between">
        <div>
          <button className="text-ink-lighter text-lg">‹</button>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold font-heading text-ink">{dayName}</h1>
          <p className="text-sm text-ink-lighter">{dateStr}</p>
        </div>
        <div>
          <button className="text-ink-lighter text-lg">›</button>
        </div>
      </div>

      {/* Task groups */}
      <div className="px-5 space-y-6">
        {grouped.map(({ slot, tasks }) => {
          const config = TIME_SLOT_CONFIG[slot];
          return (
            <div key={slot}>
              {/* Section header pill */}
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1.5 ${config.bgColor} ${config.textColor} text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full`}>
                  <span>{config.emoji}</span>
                  {config.label} ({tasks.length})
                </span>
                <button className="w-7 h-7 rounded-full bg-surface-dim flex items-center justify-center text-ink-lighter text-sm">+</button>
              </div>

              {slot === 'anytime' && tasks.length === 0 ? null : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onTapComplete={() => handleTapComplete(task)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* All done celebration */}
      {completedCount === totalTasks && totalTasks > 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-5 mt-6 text-center py-10 bg-sage-light rounded-3xl border-2 border-sage"
        >
          <p className="text-4xl mb-2 animate-celebrate">🌟</p>
          <p className="font-bold text-sage-dark text-lg font-heading">All tasks complete!</p>
          <p className="text-sm text-ink-lighter">Amazing work today, {kid.name}!</p>
        </motion.div>
      )}

      {/* Mascot */}
      <div className="fixed bottom-24 right-4 z-30">
        <Mascot message={getMascotMessage()} size="md" />
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
              {/* Drag handle */}
              <div className="w-10 h-1 bg-surface-dimmer rounded-full mx-auto mb-6" />

              {/* Task emoji — big and playful */}
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

              {/* Heading */}
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

              {/* Reward preview */}
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

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleConfirmYes}
                  className="flex-[1.3] bg-ink text-white font-bold py-4 rounded-full text-base"
                >
                  yes, done! 🎉
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setConfirmTask(null)}
                  className="flex-1 bg-white border-2 border-surface-dimmer text-ink font-bold py-4 rounded-full text-base"
                >
                  not yet
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
