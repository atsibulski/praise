import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, LEVEL_EMOJI } from '../store/useStore';
import Mascot from '../components/Mascot';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MOOD_OPTIONS = ['🌸', '😊', '😐', '😢', '😠'];

export default function KidMe() {
  const navigate = useNavigate();
  const { kids, activeKidId, logMood } = useStore();
  const kid = kids.find((k) => k.id === activeKidId) ?? kids[0];
  const [showMoodPicker, setShowMoodPicker] = useState<string | null>(null);

  const todayIdx = new Date().getDay();
  const todayName = DAYS[todayIdx];

  const unlockedAchievements = kid.achievements.filter(a => a.unlocked);

  // XP progress to next level
  const levelThresholds = { bronze: 0, silver: 200, gold: 500, diamond: 1000 };
  const nextLevel = kid.level === 'bronze' ? 'silver' : kid.level === 'silver' ? 'gold' : kid.level === 'gold' ? 'diamond' : null;
  const nextThreshold = nextLevel ? levelThresholds[nextLevel] : kid.totalXp;
  const currentThreshold = levelThresholds[kid.level];
  const xpProgress = nextLevel
    ? ((kid.totalXp - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100;

  return (
    <div className="min-h-screen pb-24 bg-bg">
      {/* Header */}
      <div className="px-5 pt-14 pb-2 flex items-center justify-between">
        <span className="bg-surface rounded-full px-4 py-2 text-sm font-bold text-ink shadow-sm">
          {kid.emoji} {kid.name}
        </span>
        <button
          onClick={() => navigate('/start')}
          className="w-9 h-9 rounded-full bg-surface-dim flex items-center justify-center text-ink-lighter"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>

      <div className="px-5 space-y-6 mt-4">
        {/* Level & XP Card */}
        <div className="bg-white rounded-3xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-lavender-light flex items-center justify-center">
              <span className="text-3xl">{LEVEL_EMOJI[kid.level]}</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink text-lg capitalize">{kid.level} Level</p>
              <p className="text-xs text-ink-lighter">{kid.totalXp} total XP</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold font-heading text-lavender-dark">⚡ {kid.xp}</p>
              <p className="text-xs text-ink-lighter">Available XP</p>
            </div>
          </div>

          {nextLevel && (
            <div>
              <div className="flex justify-between text-xs text-ink-lighter mb-1">
                <span>{kid.level}</span>
                <span>{nextLevel}</span>
              </div>
              <div className="h-2 bg-surface-dim rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-lavender to-lavender-dark rounded-full"
                />
              </div>
              <p className="text-xs text-ink-lighter mt-1 text-right">{nextThreshold - kid.totalXp} XP to {nextLevel}</p>
            </div>
          )}
        </div>

        {/* Weekly Insights */}
        <h2 className="text-xl font-bold font-heading text-ink">My Weekly Insights</h2>

        {/* Mood tracker */}
        <div className="bg-white rounded-3xl p-5">
          <h3 className="font-bold text-ink mb-4">Mood and Daily Reflections</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {DAYS.map((day, i) => {
              const logged = kid.moodLog.find(m => m.day === day);
              const isToday = day === todayName;
              const isPast = i < todayIdx;

              return (
                <div key={day} className="flex flex-col items-center gap-1.5 min-w-[44px]">
                  {logged ? (
                    <button
                      onClick={() => setShowMoodPicker(day)}
                      className="w-11 h-11 rounded-full bg-peach-light flex items-center justify-center"
                    >
                      <span className="text-xl">{logged.emoji}</span>
                    </button>
                  ) : isToday ? (
                    <button
                      onClick={() => setShowMoodPicker(day)}
                      className="w-11 h-11 rounded-full bg-ink flex items-center justify-center"
                    >
                      <span className="text-white text-lg">+</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => isPast ? setShowMoodPicker(day) : null}
                      className="w-11 h-11 rounded-full bg-surface-dim flex items-center justify-center"
                    >
                      <span className="text-ink-faint text-lg">+</span>
                    </button>
                  )}
                  <span className={`text-xs ${isToday ? 'font-bold text-ink' : 'text-ink-lighter'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mood picker popup */}
          <AnimatePresence>
            {showMoodPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-3 flex items-center gap-2 bg-surface-dim rounded-full p-2 justify-center"
              >
                {MOOD_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      logMood(kid.id, showMoodPicker, emoji);
                      setShowMoodPicker(null);
                    }}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center active:scale-90 transition-transform shadow-sm"
                  >
                    <span className="text-xl">{emoji}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Streak Stats */}
        <div className="bg-white rounded-3xl p-5">
          <p className="text-ink-light text-sm mb-3">I've been planning every day for</p>
          <div className="flex gap-3">
            <div className="flex-1 bg-lavender-light rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold font-heading text-ink">{kid.streak}</span>
                <span className="text-xl">🌱</span>
              </div>
              <p className="text-xs font-bold text-ink-light uppercase tracking-wider mt-1">Days in a row</p>
            </div>
            <div className="flex-1 bg-surface-dim rounded-2xl p-4">
              <span className="text-3xl font-bold font-heading text-ink">{kid.totalDaysPlanned}</span>
              <p className="text-xs font-bold text-ink-light uppercase tracking-wider mt-1">Total days</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <span className="text-sm font-semibold text-ink-light">Share</span>
            <svg className="w-4 h-4 text-ink-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="bg-amber-light rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="font-bold text-amber-dark text-sm">Longest streak: {kid.longestStreak} days!</p>
            <p className="text-xs text-amber-dark/70">Keep going to beat your record!</p>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
            Achievements
            <span className="text-xs bg-lavender-light text-lavender-dark px-2 py-0.5 rounded-full font-bold">
              {unlockedAchievements.length}/{kid.achievements.length}
            </span>
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {kid.achievements.map(achievement => (
              <motion.div
                key={achievement.id}
                whileTap={{ scale: 0.95 }}
                className={`rounded-2xl p-3 flex flex-col items-center gap-1 ${
                  achievement.unlocked
                    ? 'bg-white shadow-sm'
                    : 'bg-surface-dim opacity-40'
                }`}
              >
                <span className="text-2xl">{achievement.emoji}</span>
                <span className="text-[10px] font-semibold text-ink-light text-center leading-tight">
                  {achievement.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* My Money CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('../vault')}
          className="w-full bg-gradient-to-r from-amber-dark to-[#F59E0B] text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2"
        >
          <span className="text-lg">💰</span>
          My Money
          <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{kid.cookieBalance + kid.vaultBalance} 🪙</span>
        </motion.button>

        {/* Learn how to section */}
        <div>
          <p className="text-xs font-bold text-ink-lighter uppercase tracking-wider mb-2">Learn how to</p>
          <h3 className="text-xl font-bold font-heading text-ink mb-3">Plan like a pro ⚡</h3>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            <div className="min-w-[160px] h-28 bg-lavender-light rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl">📅</span>
                <p className="text-xs font-semibold text-lavender-dark mt-1">Use the Today view</p>
              </div>
            </div>
            <div className="min-w-[160px] h-28 bg-peach-light rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl">🎯</span>
                <p className="text-xs font-semibold text-peach-dark mt-1">Set priorities</p>
              </div>
            </div>
            <div className="min-w-[160px] h-28 bg-sage-light rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl">⏱️</span>
                <p className="text-xs font-semibold text-sage-dark mt-1">Try Focus mode</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mascot */}
      <div className="fixed bottom-24 right-4 z-30">
        <Mascot size="md" />
      </div>
    </div>
  );
}
