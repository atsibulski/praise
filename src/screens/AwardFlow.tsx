import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import Confetti from '../components/Confetti';

const TASKS = [
  { name: 'Plan your day', cookies: 3, icon: '📋' },
  { name: 'Morning routine', cookies: 5, icon: '📅' },
  { name: 'Quick tidy', cookies: 3, icon: '🧹' },
  { name: 'Drink water', cookies: 2, icon: '💧' },
  { name: 'Do homework', cookies: 15, icon: '📚' },
  { name: 'Read 20 min', cookies: 10, icon: '📖' },
  { name: 'Evening routine', cookies: 5, icon: '🌙' },
  { name: 'Tidy room', cookies: 10, icon: '🏠' },
];

type Step = 'select-kid' | 'select-task' | 'confirm';

export default function AwardFlow() {
  const { kidId: paramKid } = useParams();
  const navigate = useNavigate();
  const { kids, awardCookies } = useStore();

  const [step, setStep] = useState<Step>(paramKid ? 'select-task' : 'select-kid');
  const [selectedKid, setSelectedKid] = useState(paramKid || '');
  const [selectedTask, setSelectedTask] = useState<{ name: string; cookies: number } | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const kid = kids.find((k) => k.id === selectedKid);

  const handleSelectKid = (id: string) => {
    setSelectedKid(id);
    setStep('select-task');
  };

  const handleSelectTask = (task: { name: string; cookies: number }) => {
    setSelectedTask(task);
    setStep('confirm');
  };

  const handleConfirm = useCallback(() => {
    if (!selectedTask || !selectedKid) return;
    const amount = customAmount ? parseInt(customAmount) : selectedTask.cookies;
    awardCookies(selectedKid, selectedTask.name, amount);
    setShowConfetti(true);
    setTimeout(() => navigate(-1), 2500);
  }, [selectedTask, selectedKid, customAmount, awardCookies, navigate]);

  const slideVariants = {
    enter: { x: 80, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -80, opacity: 0 },
  };

  return (
    <div className="min-h-screen px-5 pt-14 pb-8 relative bg-bg">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => {
            if (step === 'select-task' && !paramKid) setStep('select-kid');
            else if (step === 'confirm') setStep('select-task');
            else navigate(-1);
          }}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ink shadow-sm"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-ink font-heading">Award Cookies</h1>
      </div>

      {/* Step indicators */}
      <div className="flex gap-2 mb-8">
        {['Kid', 'Task', 'Confirm'].map((label, i) => {
          const stepIdx = step === 'select-kid' ? 0 : step === 'select-task' ? 1 : 2;
          return (
            <div key={label} className="flex-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  i <= stepIdx ? 'bg-lavender-dark' : 'bg-surface-dimmer'
                }`}
              />
              <p
                className={`text-xs mt-1 ${
                  i <= stepIdx ? 'text-lavender-dark font-semibold' : 'text-ink-faint'
                }`}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 'select-kid' && (
          <motion.div
            key="kid"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <p className="text-ink-lighter text-sm mb-4">Who did a great job?</p>
            {kids.map((k) => (
              <button
                key={k.id}
                onClick={() => handleSelectKid(k.id)}
                className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 active:scale-[0.98] transition-transform shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-lavender-light flex items-center justify-center">
                  <span className="text-2xl">{k.emoji}</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-ink">{k.name}</p>
                  <p className="text-sm text-ink-lighter">
                    {k.cookieBalance} 🍪 · 🔥 {k.streak} days
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {step === 'select-task' && (
          <motion.div
            key="task"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <p className="text-ink-lighter text-sm mb-4">
              What did {kid?.name} do? {kid?.emoji}
            </p>
            {TASKS.map((task) => (
              <button
                key={task.name}
                onClick={() => handleSelectTask(task)}
                className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 active:scale-[0.98] transition-transform shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-dim flex items-center justify-center">
                  <span className="text-xl">{task.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-ink">{task.name}</p>
                </div>
                <span className="text-lavender-dark font-bold text-sm">
                  +{task.cookies} 🍪
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {step === 'confirm' && !showConfetti && (
          <motion.div
            key="confirm"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-7xl mb-4"
            >
              🍪
            </motion.div>
            <p className="text-lg text-ink-lighter mb-1">Awarding</p>
            <p className="text-4xl font-bold text-amber-dark mb-2 font-heading">
              {customAmount || selectedTask?.cookies} 🍪
            </p>
            <p className="text-ink-lighter text-sm mb-1">
              €{((customAmount ? parseInt(customAmount) : selectedTask?.cookies ?? 0) / 10).toFixed(2)}
            </p>
            <p className="text-ink mb-6">
              to {kid?.emoji} {kid?.name} for {selectedTask?.name}
            </p>

            <div className="mb-6">
              <label className="text-xs text-ink-lighter block mb-2">
                Custom amount (optional)
              </label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder={String(selectedTask?.cookies)}
                className="w-24 text-center text-xl font-bold border-2 border-surface-dimmer rounded-xl px-3 py-2 focus:border-lavender-dark focus:outline-none bg-white"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
              className="w-full bg-lavender-dark text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg shadow-lavender-dark/25"
            >
              Confirm Award 🎉
            </motion.button>
          </motion.div>
        )}

        {showConfetti && (
          <motion.div
            key="celebration"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center pt-20"
          >
            <p className="text-6xl mb-4 animate-celebrate">🎉</p>
            <p className="text-2xl font-bold text-ink mb-2 font-heading">
              Great job, {kid?.name}!
            </p>
            <p className="text-lavender-dark font-bold text-lg">
              +{customAmount || selectedTask?.cookies} cookies earned!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
