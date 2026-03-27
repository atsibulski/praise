import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import Confetti from '../components/Confetti';
import Mascot from '../components/Mascot';

// Simple projection calculator
function projectGrowth(balance: number, rate: number, weeks: number): number {
  let b = balance;
  for (let i = 0; i < weeks; i++) b = b * (1 + rate);
  return Math.round(b);
}

export default function KidInvest() {
  const navigate = useNavigate();
  const { kids, activeKidId, depositToVault, withdrawFromVault, creditInterest } = useStore();
  const kid = kids.find((k) => k.id === activeKidId) ?? kids[0];

  const [mode, setMode] = useState<'overview' | 'deposit' | 'withdraw'>('overview');
  const [amount, setAmount] = useState(Math.min(10, kid.cookieBalance));
  const [showConfetti, setShowConfetti] = useState(false);

  const { interestRate, lockInWeeks } = kid.financialSettings;

  // Check if interest should be credited
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const timeSince = Date.now() - kid.lastInterestDate;
  const shouldCreditInterest = timeSince >= msPerWeek && kid.vaultBalance > 0;

  useEffect(() => {
    if (shouldCreditInterest) {
      creditInterest(kid.id);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [shouldCreditInterest, kid.id, creditInterest]);

  // Can withdraw? Check lock-in
  const oldestDeposit = kid.vaultHistory.filter(v => v.type === 'deposit').sort((a, b) => a.date - b.date)[0];
  const lockInMs = lockInWeeks * msPerWeek;
  const canWithdraw = oldestDeposit ? (Date.now() - oldestDeposit.date >= lockInMs) : false;
  const daysUntilUnlock = oldestDeposit ? Math.max(0, Math.ceil((lockInMs - (Date.now() - oldestDeposit.date)) / (24 * 60 * 60 * 1000))) : 0;

  // Projections
  const proj1w = projectGrowth(kid.vaultBalance, interestRate, 1);
  const proj1m = projectGrowth(kid.vaultBalance, interestRate, 4);
  const proj3m = projectGrowth(kid.vaultBalance, interestRate, 12);

  // Interest countdown
  const timeUntilNext = Math.max(0, msPerWeek - timeSince);
  const daysUntilNext = Math.ceil(timeUntilNext / (24 * 60 * 60 * 1000));
  const hoursUntilNext = Math.ceil(timeUntilNext / (60 * 60 * 1000)) % 24;

  // Growing plant stage based on vault balance
  const plantEmoji = kid.vaultBalance >= 200 ? '🌳' : kid.vaultBalance >= 100 ? '🌿' : kid.vaultBalance >= 50 ? '🌱' : kid.vaultBalance > 0 ? '🌱' : '🫘';
  const plantLabel = kid.vaultBalance >= 200 ? 'Mighty Oak' : kid.vaultBalance >= 100 ? 'Growing Strong' : kid.vaultBalance >= 50 ? 'Sprouting' : kid.vaultBalance > 0 ? 'Seedling' : 'Plant a Seed';

  const handleDeposit = () => {
    depositToVault(kid.id, amount);
    setShowConfetti(true);
    setTimeout(() => { setShowConfetti(false); setMode('overview'); }, 2000);
  };

  const handleWithdraw = () => {
    withdrawFromVault(kid.id, amount);
    setMode('overview');
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen pb-24 bg-bg">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="px-5 pt-14 pb-2 flex items-center gap-3">
        <button
          onClick={() => mode === 'overview' ? navigate(-1) : setMode('overview')}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ink shadow-sm"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold font-heading text-ink flex-1">Savings Vault</h1>
        <span className="text-2xl">{plantEmoji}</span>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Vault balance card */}
            <div className="px-5 mt-4">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#FCD34D] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-8xl opacity-10">{plantEmoji}</div>

                <p className="text-sm opacity-80 mb-1">Vault Balance</p>
                <motion.p
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-extrabold font-heading tracking-tight"
                >
                  {kid.vaultBalance} <span className="text-2xl">🪙</span>
                </motion.p>

                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="bg-white/20 text-xs font-bold px-2.5 py-1 rounded-full">
                    ✨ {kid.totalInterestEarned} earned from interest
                  </span>
                  <span className="bg-white/20 text-xs font-bold px-2.5 py-1 rounded-full">
                    {plantLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Growing plant visualization */}
            <div className="px-5 mt-5">
              <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                  className="text-6xl mb-2"
                >
                  {plantEmoji}
                </motion.div>
                <p className="font-bold text-ink font-heading">{plantLabel}</p>
                <p className="text-xs text-ink-lighter mt-1">
                  {kid.vaultBalance > 0
                    ? 'Your money is growing every week!'
                    : 'Deposit coins to start growing!'}
                </p>

                {/* Interest rate badge */}
                <div className="inline-flex items-center gap-1 bg-amber-light text-amber-dark text-xs font-bold px-3 py-1.5 rounded-full mt-3">
                  📈 {(interestRate * 100).toFixed(0)}% interest every week
                </div>
              </div>
            </div>

            {/* Interest countdown */}
            {kid.vaultBalance > 0 && (
              <div className="px-5 mt-4">
                <div className="bg-amber-light/50 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-ink text-sm">Next interest payout</p>
                      <p className="text-xs text-ink-lighter">
                        {daysUntilNext === 0
                          ? `In ${hoursUntilNext} hour${hoursUntilNext !== 1 ? 's' : ''}!`
                          : `In ${daysUntilNext} day${daysUntilNext !== 1 ? 's' : ''}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-amber-dark">+{Math.max(1, Math.round(kid.vaultBalance * interestRate))}</p>
                      <p className="text-xs text-ink-lighter">coins expected</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projected earnings */}
            {kid.vaultBalance > 0 && (
              <div className="px-5 mt-5">
                <h3 className="text-xs font-bold text-ink-lighter uppercase tracking-wider mb-3">
                  If you keep saving...
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '1 week', value: proj1w, emoji: '📅' },
                    { label: '1 month', value: proj1m, emoji: '📆' },
                    { label: '3 months', value: proj3m, emoji: '🗓️' },
                  ].map(p => (
                    <div key={p.label} className="bg-white rounded-2xl p-3 shadow-sm text-center">
                      <span className="text-xl">{p.emoji}</span>
                      <p className="text-lg font-bold text-amber-dark font-heading mt-1">{p.value}</p>
                      <p className="text-[10px] text-ink-lighter font-semibold">{p.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="px-5 mt-5 flex gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => { setAmount(Math.min(10, kid.cookieBalance)); setMode('deposit'); }}
                disabled={kid.cookieBalance === 0}
                className="flex-1 bg-amber-dark text-white font-bold py-4 rounded-2xl shadow-lg disabled:opacity-40"
              >
                Deposit 🪙
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => { setAmount(Math.min(10, kid.vaultBalance)); setMode('withdraw'); }}
                disabled={kid.vaultBalance === 0}
                className="flex-1 bg-white border-2 border-surface-dimmer text-ink font-bold py-4 rounded-2xl disabled:opacity-40"
              >
                Withdraw
              </motion.button>
            </div>

            {/* Vault history */}
            {kid.vaultHistory.length > 0 && (
              <div className="px-5 mt-6">
                <h3 className="text-xs font-bold text-ink-lighter uppercase tracking-wider mb-3">
                  Vault Activity
                </h3>
                <div className="space-y-2">
                  {kid.vaultHistory.slice().reverse().slice(0, 8).map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        entry.type === 'interest' ? 'bg-amber-light' : entry.type === 'deposit' ? 'bg-sage-light' : 'bg-coral-light'
                      }`}>
                        <span className="text-lg">{entry.type === 'interest' ? '✨' : entry.type === 'deposit' ? '💰' : '💸'}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-ink">
                          {entry.type === 'interest' ? 'Interest earned' : entry.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                        </p>
                        <p className="text-xs text-ink-lighter">{formatDate(entry.date)}</p>
                      </div>
                      <span className={`text-sm font-bold ${entry.type === 'withdrawal' ? 'text-coral-dark' : 'text-sage-dark'}`}>
                        {entry.type === 'withdrawal' ? '-' : '+'}{entry.cookies} 🪙
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Deposit mode */}
        {mode === 'deposit' && (
          <motion.div key="deposit" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-5 mt-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm text-center">
              <span className="text-5xl">🌱</span>
              <h2 className="text-xl font-bold font-heading text-ink mt-3 mb-1">Deposit to Vault</h2>
              <p className="text-sm text-ink-lighter mb-4">Your coins will earn {(interestRate * 100).toFixed(0)}% interest every week!</p>

              <p className="text-4xl font-bold text-amber-dark font-heading mb-1">
                {amount} <span className="text-xl">🪙</span>
              </p>
              <p className="text-sm text-ink-lighter mb-6">
                from {kid.cookieBalance} available
              </p>

              <input
                type="range"
                min={1}
                max={kid.cookieBalance}
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="w-full mb-2"
              />
              <div className="flex justify-between text-xs text-ink-lighter mb-4">
                <span>1</span>
                <span>{kid.cookieBalance}</span>
              </div>

              {lockInWeeks > 0 && (
                <div className="bg-amber-light/50 rounded-xl p-3 mb-4 text-left">
                  <p className="text-xs text-amber-dark font-semibold">
                    🔒 Lock-in: You can't withdraw for {lockInWeeks} week{lockInWeeks !== 1 ? 's' : ''} — this teaches patience!
                  </p>
                </div>
              )}

              <div className="bg-surface-dim rounded-xl p-3 mb-6 text-left">
                <p className="text-xs text-ink-light font-semibold">
                  💡 In 1 month, {amount} coins could become {projectGrowth(amount, interestRate, 4)} coins!
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleDeposit}
                className="w-full bg-amber-dark text-white font-bold py-4 rounded-2xl shadow-lg"
              >
                Deposit {amount} coins 🌱
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Withdraw mode */}
        {mode === 'withdraw' && (
          <motion.div key="withdraw" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-5 mt-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm text-center">
              <span className="text-5xl">💸</span>
              <h2 className="text-xl font-bold font-heading text-ink mt-3 mb-1">Withdraw from Vault</h2>

              {!canWithdraw ? (
                <div className="mt-4">
                  <div className="bg-amber-light/50 rounded-xl p-4">
                    <p className="text-sm text-amber-dark font-semibold">
                      🔒 Your coins are locked for {daysUntilUnlock} more day{daysUntilUnlock !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-ink-lighter mt-1">
                      This helps you learn to save! Hang in there!
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setMode('overview')}
                    className="mt-4 w-full bg-surface-dim text-ink font-bold py-3 rounded-2xl"
                  >
                    OK, I'll wait
                  </motion.button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-ink-lighter mb-4">Move coins back to your wallet</p>

                  <p className="text-4xl font-bold text-ink font-heading mb-1">
                    {amount} <span className="text-xl">🪙</span>
                  </p>
                  <p className="text-sm text-ink-lighter mb-6">
                    from {kid.vaultBalance} in vault
                  </p>

                  <input
                    type="range"
                    min={1}
                    max={kid.vaultBalance}
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    className="w-full mb-6"
                  />

                  <div className="bg-coral-light rounded-xl p-3 mb-4 text-left">
                    <p className="text-xs text-coral-dark font-semibold">
                      ⚠️ Withdrawn coins won't earn interest anymore
                    </p>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleWithdraw}
                    className="w-full bg-ink text-white font-bold py-4 rounded-2xl"
                  >
                    Withdraw {amount} coins
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot */}
      <div className="fixed bottom-24 right-4 z-30">
        <Mascot message={kid.vaultBalance > 0 ? 'Your money is growing!' : 'Start saving today!'} size="md" />
      </div>
    </div>
  );
}
