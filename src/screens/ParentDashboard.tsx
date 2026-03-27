import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, LEVEL_EMOJI, type TimeSlot, type Priority } from '../store/useStore';

const EMOJI_OPTIONS = ['📚', '🧹', '🪥', '🛏️', '📖', '💧', '🏃', '🎨', '🎵', '🐕', '🍳', '🌱', '📝', '🧮', '🎯'];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ParentDashboard() {
  const { kids, activity, addTask, addReward, approveCashOut, denyCashOut, updateFinancialSettings } = useStore();
  const navigate = useNavigate();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddReward, setShowAddReward] = useState(false);
  const [selectedKidForAdd, setSelectedKidForAdd] = useState(kids[0]?.id || '');

  // Task form state
  const [taskName, setTaskName] = useState('');
  const [taskEmoji, setTaskEmoji] = useState('📚');
  const [taskCookies, setTaskCookies] = useState(5);
  const [taskXp, setTaskXp] = useState(10);
  const [taskDuration, setTaskDuration] = useState(15);
  const [taskSlot, setTaskSlot] = useState<TimeSlot>('morning');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');

  // Reward form state
  const [rewardName, setRewardName] = useState('');
  const [rewardEmoji, setRewardEmoji] = useState('🎁');
  const [rewardCost, setRewardCost] = useState(50);
  const [rewardDesc, setRewardDesc] = useState('');

  const handleAddTask = () => {
    if (!taskName.trim()) return;
    addTask(selectedKidForAdd, {
      id: Math.random().toString(36).slice(2, 9),
      name: taskName,
      emoji: taskEmoji,
      cookies: taskCookies,
      xp: taskXp,
      duration: taskDuration,
      timeSlot: taskSlot,
      priority: taskPriority,
    });
    setTaskName('');
    setShowAddTask(false);
  };

  const handleAddReward = () => {
    if (!rewardName.trim()) return;
    addReward(selectedKidForAdd, {
      id: Math.random().toString(36).slice(2, 9),
      name: rewardName,
      emoji: rewardEmoji,
      cost: rewardCost,
      description: rewardDesc,
    });
    setRewardName('');
    setRewardDesc('');
    setShowAddReward(false);
  };

  return (
    <div className="min-h-screen pb-8 bg-bg">
      {/* Header */}
      <div className="px-5 pt-14 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink font-heading">Praise</h1>
          <p className="text-xs text-ink-lighter">Parent Dashboard</p>
        </div>
        <button
          onClick={() => navigate('/start')}
          className="w-9 h-9 rounded-full bg-surface-dim flex items-center justify-center text-ink-lighter"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>

      {/* Kid cards */}
      <div className="px-5 space-y-4 mt-4 mb-6">
        {kids.map((kid, i) => {
          const completedCount = kid.tasks.filter(t => t.completedToday).length;
          const totalTasks = kid.tasks.length;
          const completionPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

          return (
            <motion.div
              key={kid.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-lavender-light flex items-center justify-center">
                    <span className="text-2xl">{kid.emoji}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-ink">{kid.name}</h2>
                    <p className="text-xs text-ink-lighter flex items-center gap-2">
                      <span>{LEVEL_EMOJI[kid.level]} {kid.level}</span>
                      <span>·</span>
                      <span>🔥 {kid.streak} days</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-lavender-dark">⚡ {kid.xp}</p>
                  <p className="text-xs text-ink-lighter">{kid.cookieBalance} 🍪</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-ink-lighter mb-1">
                  <span>Today's progress</span>
                  <span>{completedCount}/{totalTasks} tasks ({completionPct}%)</span>
                </div>
                <div className="h-2 bg-surface-dim rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPct}%` }}
                    className="h-full bg-sage-dark rounded-full"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/award/${kid.id}`)}
                  className="flex-1 bg-lavender-dark text-white font-bold py-3 rounded-2xl text-sm active:scale-95 transition-transform"
                >
                  Award 🍪
                </button>
                <button
                  onClick={() => navigate(`/kid/${kid.name.toLowerCase()}`)}
                  className="px-5 bg-surface-dim text-ink font-semibold py-3 rounded-2xl text-sm active:scale-95 transition-transform"
                >
                  View
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-ink-lighter uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddTask(true)}
            className="flex-1 bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-lavender-light flex items-center justify-center">
              <span className="text-lg">➕</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-ink text-sm">Add Task</p>
              <p className="text-xs text-ink-lighter">Create a new task</p>
            </div>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddReward(true)}
            className="flex-1 bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-peach-light flex items-center justify-center">
              <span className="text-lg">🎁</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-ink text-sm">Add Reward</p>
              <p className="text-xs text-ink-lighter">Set up a reward</p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Pending Cash-Out Requests */}
      {kids.some(k => k.cashOutRequests.some(r => r.status === 'pending')) && (
        <div className="px-5 mb-6">
          <h3 className="text-xs font-bold text-ink-lighter uppercase tracking-wider mb-3">Pending Cash-Out Requests</h3>
          <div className="space-y-2">
            {kids.flatMap(kid =>
              kid.cashOutRequests
                .filter(r => r.status === 'pending')
                .map(req => (
                  <div key={req.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{kid.emoji}</span>
                        <span className="font-bold text-ink">{kid.name}</span>
                      </div>
                      <span className="text-xs bg-amber-light text-amber-dark px-2 py-0.5 rounded-full font-semibold">⏳ Pending</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-ink-lighter">{req.cookies} coins</p>
                        <p className="text-lg font-bold text-ink">${req.realAmount.toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-ink-lighter">{new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => approveCashOut(kid.id, req.id)}
                        className="flex-1 bg-sage-dark text-white font-bold py-2.5 rounded-xl text-sm"
                      >
                        Approve ✓
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => denyCashOut(kid.id, req.id)}
                        className="flex-1 bg-coral-light text-coral-dark font-bold py-2.5 rounded-xl text-sm"
                      >
                        Deny
                      </motion.button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* Financial Settings */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-bold text-ink-lighter uppercase tracking-wider mb-3">Financial Settings</h3>
        <div className="space-y-3">
          {kids.map(kid => (
            <div key={kid.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{kid.emoji}</span>
                <span className="font-bold text-ink">{kid.name}</span>
                <span className="text-xs text-ink-lighter ml-auto">🏦 {kid.vaultBalance} saved · 💳 {kid.cookieBalance} spendable</span>
              </div>

              {/* Rate controls */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-surface-dim rounded-xl p-3">
                  <p className="text-[10px] text-ink-lighter font-bold uppercase mb-1">Coins per $1</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateFinancialSettings(kid.id, { conversionRate: Math.max(10, kid.financialSettings.conversionRate - 10) })}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-ink-light text-sm font-bold active:bg-surface-dimmer"
                    >−</button>
                    <span className="flex-1 text-center font-bold text-ink">{kid.financialSettings.conversionRate}</span>
                    <button
                      onClick={() => updateFinancialSettings(kid.id, { conversionRate: kid.financialSettings.conversionRate + 10 })}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-ink-light text-sm font-bold active:bg-surface-dimmer"
                    >+</button>
                  </div>
                </div>
                <div className="bg-surface-dim rounded-xl p-3">
                  <p className="text-[10px] text-ink-lighter font-bold uppercase mb-1">Weekly Interest</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateFinancialSettings(kid.id, { interestRate: Math.max(0.01, +(kid.financialSettings.interestRate - 0.01).toFixed(2)) })}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-ink-light text-sm font-bold active:bg-surface-dimmer"
                    >−</button>
                    <span className="flex-1 text-center font-bold text-ink">{(kid.financialSettings.interestRate * 100).toFixed(0)}%</span>
                    <button
                      onClick={() => updateFinancialSettings(kid.id, { interestRate: +(kid.financialSettings.interestRate + 0.01).toFixed(2) })}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-ink-light text-sm font-bold active:bg-surface-dimmer"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Feature toggles */}
              <div className="flex gap-2">
                <button
                  onClick={() => updateFinancialSettings(kid.id, { cashOutEnabled: !kid.financialSettings.cashOutEnabled })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                    kid.financialSettings.cashOutEnabled ? 'bg-sage-light text-sage-dark' : 'bg-surface-dim text-ink-lighter'
                  }`}
                >
                  🐷 Cash Out {kid.financialSettings.cashOutEnabled ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => updateFinancialSettings(kid.id, { investEnabled: !kid.financialSettings.investEnabled })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                    kid.financialSettings.investEnabled ? 'bg-sage-light text-sage-dark' : 'bg-surface-dim text-ink-lighter'
                  }`}
                >
                  🌱 Vault {kid.financialSettings.investEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="px-5">
        <h3 className="text-xs font-bold text-ink-lighter uppercase tracking-wider mb-3">
          Recent Activity
        </h3>
        {activity.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-sm text-ink-lighter">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activity.slice(0, 10).map((item, i) => {
              const kid = kids.find((k) => k.id === item.kidId);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-full bg-surface-dim flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{kid?.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {item.description}
                    </p>
                    <p className="text-xs text-ink-lighter">{timeAgo(item.timestamp)}</p>
                  </div>
                  <span
                    className={`text-sm font-bold flex-shrink-0 ${
                      item.type === 'award'
                        ? 'text-sage-dark'
                        : item.type === 'invest'
                        ? 'text-lavender-dark'
                        : 'text-coral-dark'
                    }`}
                  >
                    {item.type === 'award' ? '+' : '-'}
                    {item.cookies} 🍪
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
            onClick={() => setShowAddTask(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md bg-white rounded-t-3xl p-5 pb-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-surface-dimmer rounded-full mx-auto mb-4" />
              <h2 className="text-xl font-bold font-heading text-ink mb-4">Add Task</h2>

              {/* Kid selector */}
              <div className="flex gap-2 mb-4">
                {kids.map(k => (
                  <button
                    key={k.id}
                    onClick={() => setSelectedKidForAdd(k.id)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
                      selectedKidForAdd === k.id ? 'bg-lavender-dark text-white' : 'bg-surface-dim text-ink-light'
                    }`}
                  >
                    {k.emoji} {k.name}
                  </button>
                ))}
              </div>

              {/* Emoji picker */}
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {EMOJI_OPTIONS.map(e => (
                  <button
                    key={e}
                    onClick={() => setTaskEmoji(e)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${taskEmoji === e ? 'bg-lavender-light ring-2 ring-lavender-dark' : 'bg-surface-dim'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>

              <input
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                placeholder="Task name"
                className="w-full bg-surface-dim rounded-xl px-4 py-3 text-ink font-semibold mb-3 focus:outline-none focus:ring-2 focus:ring-lavender"
              />

              {/* Stepper controls */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {([
                  { label: 'Cookies', icon: '🍪', value: taskCookies, set: setTaskCookies, step: 1, min: 1 },
                  { label: 'XP', icon: '⚡', value: taskXp, set: setTaskXp, step: 5, min: 5 },
                  { label: 'Minutes', icon: '⏱️', value: taskDuration, set: setTaskDuration, step: 5, min: 5 },
                ] as const).map(({ label, icon, value, set, step, min }) => (
                  <div key={label} className="flex flex-col items-center">
                    <button
                      onClick={() => set(value + step)}
                      className="w-12 h-12 rounded-xl bg-surface-dim flex items-center justify-center text-ink-light text-2xl font-light active:bg-surface-dimmer transition-colors"
                    >
                      +
                    </button>
                    <span className="text-2xl mt-1">{icon}</span>
                    <p className="text-xs text-ink-lighter mt-0.5">{label}</p>
                    <p className="text-xl font-bold text-ink">{value}</p>
                    <button
                      onClick={() => set(Math.max(min, value - step))}
                      className="w-12 h-12 rounded-xl bg-surface-dim flex items-center justify-center text-ink-light text-2xl font-light active:bg-surface-dimmer transition-colors mt-1"
                    >
                      −
                    </button>
                  </div>
                ))}
              </div>

              {/* Time slot pills */}
              <div className="mb-3">
                <label className="text-xs text-ink-lighter block mb-2">Time slot</label>
                <div className="flex gap-1.5">
                  {([
                    { value: 'morning' as TimeSlot, label: '🌅 Morning' },
                    { value: 'afternoon' as TimeSlot, label: '☀️ Afternoon' },
                    { value: 'evening' as TimeSlot, label: '🌙 Evening' },
                    { value: 'anytime' as TimeSlot, label: '🕐 Any' },
                  ]).map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setTaskSlot(opt.value)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                        taskSlot === opt.value
                          ? 'bg-lavender-dark text-white'
                          : 'bg-surface-dim text-ink-light'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority pills */}
              <div className="mb-5">
                <label className="text-xs text-ink-lighter block mb-2">Priority</label>
                <div className="flex gap-1.5">
                  {([
                    { value: 'high' as Priority, label: '▲ High', activeBg: 'bg-coral-dark', activeTxt: 'text-white' },
                    { value: 'medium' as Priority, label: '● Medium', activeBg: 'bg-peach-dark', activeTxt: 'text-white' },
                    { value: 'low' as Priority, label: '▼ Low', activeBg: 'bg-lavender-dark', activeTxt: 'text-white' },
                  ]).map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setTaskPriority(opt.value)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                        taskPriority === opt.value
                          ? `${opt.activeBg} ${opt.activeTxt}`
                          : 'bg-surface-dim text-ink-light'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTask}
                disabled={!taskName.trim()}
                className="w-full bg-lavender-dark text-white font-bold py-3.5 rounded-2xl disabled:opacity-40"
              >
                Add Task
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Reward Modal */}
      <AnimatePresence>
        {showAddReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
            onClick={() => setShowAddReward(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md bg-white rounded-t-3xl p-5 pb-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-surface-dimmer rounded-full mx-auto mb-4" />
              <h2 className="text-xl font-bold font-heading text-ink mb-4">Add Reward</h2>

              <div className="flex gap-2 mb-4">
                {kids.map(k => (
                  <button
                    key={k.id}
                    onClick={() => setSelectedKidForAdd(k.id)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
                      selectedKidForAdd === k.id ? 'bg-lavender-dark text-white' : 'bg-surface-dim text-ink-light'
                    }`}
                  >
                    {k.emoji} {k.name}
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5 mb-3 flex-wrap">
                {['🎁', '📱', '🍦', '🎬', '🌟', '🧸', '🎮', '🎨', '🏊', '🎢'].map(e => (
                  <button
                    key={e}
                    onClick={() => setRewardEmoji(e)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${rewardEmoji === e ? 'bg-lavender-light ring-2 ring-lavender-dark' : 'bg-surface-dim'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>

              <input
                value={rewardName}
                onChange={e => setRewardName(e.target.value)}
                placeholder="Reward name"
                className="w-full bg-surface-dim rounded-xl px-4 py-3 text-ink font-semibold mb-3 focus:outline-none focus:ring-2 focus:ring-lavender"
              />
              <input
                value={rewardDesc}
                onChange={e => setRewardDesc(e.target.value)}
                placeholder="Description"
                className="w-full bg-surface-dim rounded-xl px-4 py-3 text-ink text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-lavender"
              />

              {/* Coin Cost stepper */}
              <div className="mb-5">
                <label className="text-xs text-ink-lighter block mb-2">Coin Cost</label>
                <div className="flex items-center justify-center gap-4 bg-surface-dim rounded-2xl py-3 px-4">
                  <button
                    onClick={() => setRewardCost(Math.max(10, rewardCost - 10))}
                    className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-ink-light text-2xl font-light active:bg-surface-dimmer transition-colors shadow-sm"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl">🪙</span>
                    <p className="text-3xl font-bold text-ink">{rewardCost}</p>
                    <p className="text-xs text-ink-lighter">coins</p>
                  </div>
                  <button
                    onClick={() => setRewardCost(rewardCost + 10)}
                    className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-ink-light text-2xl font-light active:bg-surface-dimmer transition-colors shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddReward}
                disabled={!rewardName.trim()}
                className="w-full bg-lavender-dark text-white font-bold py-3.5 rounded-2xl disabled:opacity-40"
              >
                Add Reward
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
