import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import Confetti from '../components/Confetti';
import Mascot from '../components/Mascot';

export default function KidRewards() {
  const navigate = useNavigate();
  const { kids, activeKidId, redeemReward } = useStore();
  const kid = kids.find((k) => k.id === activeKidId) ?? kids[0];
  const [showConfetti, setShowConfetti] = useState(false);

  const handleRedeem = (rewardId: string) => {
    const reward = kid.rewards.find(r => r.id === rewardId);
    if (!reward || reward.redeemed || kid.cookieBalance < reward.cost) return;
    redeemReward(kid.id, rewardId);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const available = kid.rewards.filter(r => !r.redeemed);
  const redeemedRewards = kid.rewards.filter(r => r.redeemed);

  return (
    <div className="min-h-screen pb-24 bg-bg">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="px-5 pt-14 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ink shadow-sm"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold font-heading text-ink flex-1">Rewards Shop</h1>
        <span className="bg-amber-light rounded-full px-3 py-1.5 text-xs font-bold text-amber-dark">
          {kid.cookieBalance} 🪙
        </span>
      </div>

      {/* Coin balance hint */}
      <div className="px-5 mt-4 mb-6">
        <div className="bg-gradient-to-r from-amber-light to-amber/30 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-3xl">🪙</span>
          <div>
            <p className="font-bold text-ink">{kid.cookieBalance} coins available</p>
            <p className="text-xs text-ink-lighter">Earn coins by completing tasks!</p>
          </div>
        </div>
      </div>

      {/* Available rewards */}
      <div className="px-5 space-y-3">
        <h3 className="text-xs font-bold text-ink-lighter uppercase tracking-wider">Available Rewards</h3>
        {available.map((reward, i) => {
          const canAfford = kid.cookieBalance >= reward.cost;
          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-lavender-light flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">{reward.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-ink">{reward.name}</p>
                <p className="text-xs text-ink-lighter">{reward.description}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRedeem(reward.id)}
                disabled={!canAfford}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex-shrink-0 ${
                  canAfford
                    ? 'bg-lavender-dark text-white shadow-sm'
                    : 'bg-surface-dim text-ink-lighter'
                }`}
              >
                {reward.cost} 🪙
              </motion.button>
            </motion.div>
          );
        })}

        {/* Redeemed */}
        {redeemedRewards.length > 0 && (
          <>
            <h3 className="text-xs font-bold text-ink-lighter uppercase tracking-wider mt-6">Redeemed</h3>
            {redeemedRewards.map(reward => (
              <div
                key={reward.id}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 opacity-50"
              >
                <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{reward.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink-lighter line-through">{reward.name}</p>
                  <p className="text-xs text-sage-dark font-semibold">Redeemed!</p>
                </div>
                <span className="text-sage-dark text-lg">✓</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Mascot */}
      <div className="fixed bottom-24 right-4 z-30">
        <Mascot message="What will you pick?" size="md" />
      </div>
    </div>
  );
}
