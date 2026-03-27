import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import Confetti from '../components/Confetti';

export default function RedeemScreen() {
  const navigate = useNavigate();
  const { kids, activeKidId, redeemCashOut, investCookies } = useStore();
  const kid = kids.find((k) => k.id === activeKidId) ?? kids[0];

  const [mode, setMode] = useState<'choose' | 'cashout' | 'invest'>('choose');
  const [amount, setAmount] = useState(Math.min(10, kid.cookieBalance));
  const [success, setSuccess] = useState(false);

  const maxAmount = kid.cookieBalance;

  const handleCashOut = () => {
    redeemCashOut(kid.id, amount);
    setSuccess(true);
  };

  const handleInvest = () => {
    investCookies(kid.id, amount);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-cream">
        <Confetti />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <p className="text-6xl mb-4">{mode === 'cashout' ? '💸' : '🏦'}</p>
        </motion.div>
        <h2 className="text-2xl font-bold text-warm-gray mb-2 font-heading">
          {mode === 'cashout' ? 'Cash Out Complete!' : 'Invested!'}
        </h2>
        <p className="text-warm-gray-light mb-1">
          {amount} 🍪 {mode === 'cashout' ? 'cashed out' : 'invested'}
        </p>
        <p className="text-mint-dark font-bold mb-8">
          {mode === 'cashout'
            ? `€${(amount / 10).toFixed(2)} coming your way!`
            : 'Earning 5% bonus/month!'}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-cream-dark text-warm-gray font-bold px-8 py-3 rounded-2xl"
        >
          Back to Cookie Jar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pt-14 pb-8 bg-cream">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => (mode === 'choose' ? navigate(-1) : setMode('choose'))}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-warm-gray"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-warm-gray font-heading">Redeem Cookies</h1>
      </div>

      {/* Balance */}
      <div className="text-center mb-8">
        <p className="text-sm text-warm-gray-light">Available</p>
        <p className="text-3xl font-bold text-cookie-dark font-heading">
          {kid.cookieBalance} 🍪
        </p>
        <p className="text-sm text-warm-gray-light">€{(kid.cookieBalance / 10).toFixed(2)}</p>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {kid.cookieBalance === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl">
                <p className="text-5xl mb-3">🍪</p>
                <p className="text-warm-gray font-semibold">No cookies to redeem yet!</p>
                <p className="text-sm text-warm-gray-light">Complete tasks to earn cookies.</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setMode('cashout'); setAmount(Math.min(10, maxAmount)); }}
                  className="w-full bg-white rounded-2xl p-5 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-mint-light flex items-center justify-center">
                      <span className="text-2xl">💸</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-warm-gray text-lg">Cash Out</h3>
                      <p className="text-sm text-warm-gray-light">
                        Turn cookies into real euros
                      </p>
                      <p className="text-xs text-mint-dark font-semibold mt-1">
                        10 🍪 = €1.00
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => { setMode('invest'); setAmount(Math.min(10, maxAmount)); }}
                  className="w-full bg-white rounded-2xl p-5 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-light flex items-center justify-center">
                      <span className="text-2xl">🏦</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-warm-gray text-lg">Save & Grow</h3>
                      <p className="text-sm text-warm-gray-light">
                        Invest into your deposit
                      </p>
                      <p className="text-xs text-purple font-semibold mt-1">
                        Earn 5% bonus/month 📈
                      </p>
                    </div>
                  </div>
                </button>
              </>
            )}
          </motion.div>
        )}

        {(mode === 'cashout' || mode === 'invest') && (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-white rounded-3xl p-6 mb-6">
              <p className="text-center text-5xl mb-4">
                {mode === 'cashout' ? '💸' : '🏦'}
              </p>
              <p className="text-center text-sm text-warm-gray-light mb-2">
                {mode === 'cashout' ? 'Cash out amount' : 'Investment amount'}
              </p>
              <p className="text-center text-4xl font-bold text-cookie-dark mb-1 font-heading">
                {amount} 🍪
              </p>
              <p className="text-center text-sm text-warm-gray-light mb-6">
                €{(amount / 10).toFixed(2)}
              </p>

              <input
                type="range"
                min={1}
                max={maxAmount}
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-xs text-warm-gray-light mt-1">
                <span>1 🍪</span>
                <span>{maxAmount} 🍪</span>
              </div>
            </div>

            {mode === 'invest' && (
              <div className="bg-purple-light rounded-2xl p-4 mb-6">
                <p className="text-purple text-sm font-semibold">
                  💡 Investing {amount} 🍪 will earn ~{Math.ceil(amount * 0.05)} bonus cookies next month!
                </p>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={mode === 'cashout' ? handleCashOut : handleInvest}
              className={`w-full font-extrabold text-lg py-4 rounded-2xl shadow-lg text-white ${
                mode === 'cashout'
                  ? 'bg-mint shadow-mint/25'
                  : 'bg-purple shadow-purple/25'
              }`}
            >
              {mode === 'cashout'
                ? `Cash Out €${(amount / 10).toFixed(2)}`
                : `Invest ${amount} 🍪`}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
