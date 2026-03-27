import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Mascot from '../components/Mascot';
import Confetti from '../components/Confetti';

const FOCUS_PRESETS = [
  { minutes: 15, label: '15 min', emoji: '🌱' },
  { minutes: 25, label: '25 min', emoji: '🌿' },
  { minutes: 45, label: '45 min', emoji: '🌳' },
];

export default function KidFocus() {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const totalSeconds = focusMinutes * 60;

  useEffect(() => {
    if (isRunning && !isPaused && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, secondsLeft]);

  const startFocus = (minutes: number) => {
    setFocusMinutes(minutes);
    setSecondsLeft(minutes * 60);
    setIsRunning(true);
    setIsPaused(false);
    setIsComplete(false);
  };

  const togglePause = () => setIsPaused(!isPaused);

  const addMinute = () => setSecondsLeft(prev => prev + 60);

  const reset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    setSecondsLeft(0);
    clearInterval(intervalRef.current);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const circumference = 2 * Math.PI * 120;
  const dashOffset = circumference * (1 - progress);

  // Calculate start/end times
  const now = new Date();
  const endTime = new Date(now.getTime() + secondsLeft * 1000);
  const formatTimeOfDay = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="min-h-screen pb-24 bg-bg">
      {isComplete && <Confetti />}

      {/* Top bar */}
      <div className="px-5 pt-14 pb-2 flex items-center justify-between">
        {isRunning ? (
          <>
            <span className="bg-surface rounded-full px-4 py-2 text-sm font-semibold text-ink-light flex items-center gap-2 shadow-sm">
              🎵 Focus Mode
              <span className="flex gap-0.5">
                <span className="w-1 h-3 bg-lavender rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-lavender rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                <span className="w-1 h-2 bg-lavender rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              </span>
            </span>
            <button
              onClick={reset}
              className="bg-surface rounded-full px-4 py-2 text-sm font-semibold text-coral-dark shadow-sm"
            >
              End
            </button>
          </>
        ) : (
          <>
            <div />
            <span className="bg-surface rounded-full px-4 py-2 text-sm font-semibold text-sage-dark shadow-sm flex items-center gap-1.5">
              🕐 Start focus
            </span>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center px-5 pt-8">
        {!isRunning && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <h1 className="text-3xl font-bold font-heading text-ink text-center mb-2">Focus</h1>
            <p className="text-ink-lighter text-center mb-10">Pick a focus time and get to work!</p>

            <div className="space-y-3 max-w-xs mx-auto">
              {FOCUS_PRESETS.map(preset => (
                <motion.button
                  key={preset.minutes}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startFocus(preset.minutes)}
                  className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm active:bg-surface-dim transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-lavender-light flex items-center justify-center">
                    <span className="text-2xl">{preset.emoji}</span>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-ink text-lg">{preset.label}</p>
                    <p className="text-xs text-ink-lighter">Focus session</p>
                  </div>
                  <span className="text-lavender-dark font-bold text-sm">+{preset.minutes} XP</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl font-bold font-heading text-ink mb-1">Focus</h1>
            <p className="text-ink-lighter text-sm mb-8">
              {formatTimeOfDay(now)} → {formatTimeOfDay(endTime)}
            </p>

            {/* Timer ring */}
            <div className="relative w-64 h-64 mb-8">
              {/* Decorative confetti dots */}
              <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => {
                  const angle = (i / 12) * 360;
                  const r = 140;
                  const x = 128 + Math.cos(angle * Math.PI / 180) * r / 2;
                  const y = 128 + Math.sin(angle * Math.PI / 180) * r / 2;
                  return (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-lavender/30"
                      style={{ left: x, top: y }}
                    />
                  );
                })}
              </div>

              <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
                {/* Background ring */}
                <circle cx="140" cy="140" r="120" fill="none" stroke="#F5F3F0" strokeWidth="12" />
                {/* Progress ring */}
                <circle
                  cx="140" cy="140" r="120"
                  fill="none"
                  stroke="url(#focusGrad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
                <defs>
                  <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C4B5FD" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-peach-light flex items-center justify-center mb-3">
                  <span className="text-4xl">⏳</span>
                </div>
                <p className="text-5xl font-bold font-heading text-ink tracking-tight">
                  {formatTime(secondsLeft)}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={addMinute}
                className="text-sm font-bold text-ink-light bg-surface-dim px-4 py-2.5 rounded-full"
              >
                + 1 min
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={togglePause}
                className="bg-ink text-white font-bold px-8 py-3 rounded-full text-lg"
              >
                {isPaused ? '▶' : '⏸'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {isComplete && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center pt-16"
          >
            <p className="text-6xl mb-4 animate-celebrate">🎉</p>
            <h1 className="text-3xl font-bold font-heading text-ink mb-2">Focus Complete!</h1>
            <p className="text-ink-lighter mb-2">{focusMinutes} minutes of focus</p>
            <p className="text-lavender-dark font-bold text-lg mb-8">+{focusMinutes} XP earned!</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="bg-lavender-dark text-white font-bold px-8 py-3 rounded-full"
            >
              Done
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Mascot */}
      {!isRunning && (
        <div className="fixed bottom-24 right-4 z-30">
          <Mascot size="md" />
        </div>
      )}
    </div>
  );
}
