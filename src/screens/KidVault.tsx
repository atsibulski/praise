import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import Mascot from '../components/Mascot';

export default function KidVault() {
  const navigate = useNavigate();
  const { kids, activeKidId } = useStore();
  const kid = kids.find((k) => k.id === activeKidId) ?? kids[0];

  const pendingCashOuts = kid.cashOutRequests.filter(r => r.status === 'pending');
  const pendingAmount = pendingCashOuts.reduce((sum, r) => sum + r.cookies, 0);
  const rate = kid.financialSettings.conversionRate;

  // Next interest payout
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const timeSinceLast = Date.now() - kid.lastInterestDate;
  const timeUntilNext = Math.max(0, msPerWeek - timeSinceLast);
  const daysUntilNext = Math.ceil(timeUntilNext / (24 * 60 * 60 * 1000));
  const nextInterest = kid.vaultBalance > 0 ? Math.max(1, Math.round(kid.vaultBalance * kid.financialSettings.interestRate)) : 0;

  const getMascotMsg = () => {
    if (kid.vaultBalance > 100) return 'Your money is growing! 🌱';
    if (kid.vaultBalance > 0) return 'Smart saving! Keep going!';
    return 'Start saving today! 💰';
  };

  return (
    <div className="min-h-screen pb-24 bg-bg">
      {/* Header */}
      <div className="px-5 pt-14 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ink shadow-sm"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold font-heading text-ink flex-1">My Money</h1>
        <span className="text-2xl">💰</span>
      </div>

      {/* Big balance */}
      <div className="px-5 mt-4 mb-6">
        <div className="bg-gradient-to-br from-amber-dark to-[#F59E0B] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          {/* Decorative coins */}
          <div className="absolute top-3 right-4 text-4xl opacity-20">🪙</div>
          <div className="absolute bottom-2 right-12 text-2xl opacity-15">🪙</div>

          <p className="text-sm opacity-80 mb-1">Total Balance</p>
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-5xl font-extrabold font-heading tracking-tight"
          >
            {kid.cookieBalance + kid.vaultBalance}
            <span className="text-2xl ml-1">🪙</span>
          </motion.p>
          <div className="flex gap-3 mt-3">
            <span className="bg-white/20 text-xs font-bold px-2.5 py-1 rounded-full">
              🏦 {kid.vaultBalance} saved
            </span>
            <span className="bg-white/20 text-xs font-bold px-2.5 py-1 rounded-full">
              💳 {kid.cookieBalance} spendable
            </span>
          </div>
        </div>
      </div>

      {/* Three action cards */}
      <div className="px-5 space-y-3">
        {/* Rewards Shop */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('../rewards')}
          className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm text-left"
        >
          <div className="w-14 h-14 rounded-2xl bg-lavender-light flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🎁</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-ink text-lg">Rewards Shop</h3>
            <p className="text-sm text-ink-lighter">Spend coins on cool rewards</p>
            {kid.rewards.filter(r => !r.redeemed && kid.cookieBalance >= r.cost).length > 0 && (
              <p className="text-xs text-sage-dark font-semibold mt-0.5">
                {kid.rewards.filter(r => !r.redeemed && kid.cookieBalance >= r.cost).length} rewards you can afford!
              </p>
            )}
          </div>
          <svg className="w-5 h-5 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </motion.button>

        {/* Cash Out */}
        {kid.financialSettings.cashOutEnabled && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('../cashout')}
            className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🐷</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-ink text-lg">Cash Out</h3>
              <p className="text-sm text-ink-lighter">Turn coins into real money</p>
              {pendingAmount > 0 ? (
                <p className="text-xs text-amber-dark font-semibold mt-0.5">
                  💫 ${(pendingAmount / rate).toFixed(2)} pending
                </p>
              ) : (
                <p className="text-xs text-ink-lighter mt-0.5">
                  {rate} 🪙 = $1.00
                </p>
              )}
            </div>
            <svg className="w-5 h-5 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </motion.button>
        )}

        {/* Invest & Grow */}
        {kid.financialSettings.investEnabled && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('../invest')}
            className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-light flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🌱</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-ink text-lg">Savings Vault</h3>
              <p className="text-sm text-ink-lighter">Save & watch your money grow!</p>
              {kid.vaultBalance > 0 ? (
                <p className="text-xs text-amber-dark font-semibold mt-0.5">
                  🌱 {kid.vaultBalance} coins earning interest
                </p>
              ) : (
                <p className="text-xs text-ink-lighter mt-0.5">
                  Earn {(kid.financialSettings.interestRate * 100).toFixed(0)}% every week!
                </p>
              )}
            </div>
            <svg className="w-5 h-5 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </motion.button>
        )}
      </div>

      {/* Interest countdown */}
      {kid.vaultBalance > 0 && (
        <div className="px-5 mt-5">
          <div className="bg-amber-light/50 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div className="flex-1">
              <p className="font-bold text-ink text-sm">Next interest payout</p>
              <p className="text-xs text-ink-lighter">
                {daysUntilNext === 0 ? 'Today!' : `In ${daysUntilNext} day${daysUntilNext !== 1 ? 's' : ''}`}
                {nextInterest > 0 && ` · +${nextInterest} coins expected`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* What could I buy? */}
      {kid.vaultBalance > 0 && (
        <div className="px-5 mt-5">
          <h3 className="text-xs font-bold text-ink-lighter uppercase tracking-wider mb-3">
            What could I buy?
          </h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {kid.rewards.filter(r => !r.redeemed).sort((a, b) => a.cost - b.cost).slice(0, 4).map(reward => {
              const totalCoins = kid.cookieBalance + kid.vaultBalance;
              const canAfford = totalCoins >= reward.cost;
              const progress = Math.min(100, (totalCoins / reward.cost) * 100);
              return (
                <div key={reward.id} className="min-w-[140px] bg-white rounded-2xl p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{reward.emoji}</span>
                    <span className="text-xs font-bold text-ink truncate">{reward.name}</span>
                  </div>
                  <div className="h-1.5 bg-surface-dim rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full rounded-full ${canAfford ? 'bg-sage-dark' : 'bg-amber'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className={`text-xs font-semibold ${canAfford ? 'text-sage-dark' : 'text-ink-lighter'}`}>
                    {canAfford ? 'You can afford this!' : `${reward.cost - totalCoins} more coins needed`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mascot */}
      <div className="fixed bottom-24 right-4 z-30">
        <Mascot message={getMascotMsg()} size="md" />
      </div>
    </div>
  );
}
