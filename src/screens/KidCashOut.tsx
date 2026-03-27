import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import Mascot from '../components/Mascot';

export default function KidCashOut() {
  const navigate = useNavigate();
  const { kids, activeKidId, requestCashOut } = useStore();
  const kid = kids.find((k) => k.id === activeKidId) ?? kids[0];

  const [amount, setAmount] = useState(Math.min(10, kid.cookieBalance));
  const [submitted, setSubmitted] = useState(false);

  const rate = kid.financialSettings.conversionRate;
  const realAmount = amount / rate;
  const maxAmount = kid.cookieBalance;

  const pendingRequests = kid.cashOutRequests.filter(r => r.status === 'pending');
  const pastRequests = kid.cashOutRequests.filter(r => r.status !== 'pending');

  const handleSubmit = () => {
    if (amount <= 0 || amount > kid.cookieBalance) return;
    requestCashOut(kid.id, amount);
    setSubmitted(true);
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-bg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-7xl mb-4"
        >
          🐷
        </motion.div>
        <h2 className="text-2xl font-bold text-ink mb-2 font-heading text-center">
          Cash out requested!
        </h2>
        <p className="text-ink-lighter text-center mb-1">
          {amount} coins → ${realAmount.toFixed(2)}
        </p>
        <p className="text-sm text-amber-dark font-semibold text-center mb-8">
          Your parent will review this soon
        </p>

        {/* Receipt */}
        <div className="w-full max-w-xs bg-white rounded-2xl p-5 shadow-sm mb-6">
          <div className="border-b border-dashed border-surface-dimmer pb-3 mb-3">
            <p className="text-xs text-ink-lighter uppercase tracking-wider font-bold">Cash Out Receipt</p>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink-lighter">Coins</span>
            <span className="font-bold text-ink">{amount} 🪙</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink-lighter">Rate</span>
            <span className="font-semibold text-ink">{rate} coins = $1</span>
          </div>
          <div className="border-t border-dashed border-surface-dimmer pt-3 mt-3">
            <div className="flex justify-between">
              <span className="font-bold text-ink">You get</span>
              <span className="font-extrabold text-sage-dark text-lg">${realAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 bg-amber-light/50 rounded-lg p-2">
            <span>⏳</span>
            <span className="text-xs text-amber-dark font-semibold">Waiting for parent approval</span>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="bg-surface-dimmer text-ink font-bold px-8 py-3 rounded-2xl"
        >
          Back to My Money
        </button>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold font-heading text-ink flex-1">Cash Out</h1>
        <span className="text-2xl">🐷</span>
      </div>

      {/* Balance */}
      <div className="px-5 mt-4 text-center mb-6">
        <p className="text-sm text-ink-lighter">Available to cash out</p>
        <p className="text-3xl font-bold text-ink font-heading">
          {kid.cookieBalance} <span className="text-xl">🪙</span>
        </p>
        <p className="text-sm text-ink-lighter">= ${(kid.cookieBalance / rate).toFixed(2)}</p>
      </div>

      {/* Pending requests */}
      {pendingRequests.length > 0 && (
        <div className="px-5 mb-4">
          <div className="bg-amber-light/50 rounded-2xl p-4">
            <p className="font-bold text-amber-dark text-sm mb-1">Pending cash outs</p>
            {pendingRequests.map(req => (
              <div key={req.id} className="flex items-center justify-between mt-2">
                <span className="text-sm text-ink">{req.cookies} 🪙</span>
                <span className="text-sm font-bold text-amber-dark">${req.realAmount.toFixed(2)}</span>
                <span className="text-xs bg-amber/20 text-amber-dark px-2 py-0.5 rounded-full font-semibold">⏳ Waiting</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amount selector */}
      {kid.cookieBalance > 0 ? (
        <div className="px-5">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-center text-5xl mb-4">🐷</p>
            <p className="text-center text-sm text-ink-lighter mb-2">How many coins?</p>
            <p className="text-center text-4xl font-bold text-ink font-heading mb-1">
              {amount} <span className="text-xl">🪙</span>
            </p>
            <p className="text-center text-lg font-bold text-sage-dark mb-6">
              = ${realAmount.toFixed(2)}
            </p>

            <input
              type="range"
              min={1}
              max={maxAmount}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="w-full mb-2"
            />
            <div className="flex justify-between text-xs text-ink-lighter mb-6">
              <span>1 🪙</span>
              <span>{maxAmount} 🪙</span>
            </div>

            <div className="bg-surface-dim rounded-xl p-3 mb-4 text-left">
              <p className="text-xs text-ink-light font-semibold">
                💡 Your parent will need to approve this request and mark it as paid.
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleSubmit}
              className="w-full bg-sage-dark text-white font-bold py-4 rounded-2xl shadow-lg"
            >
              Request ${realAmount.toFixed(2)} Cash Out
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="px-5">
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm">
            <p className="text-5xl mb-3">🐷</p>
            <p className="text-ink font-semibold">No coins to cash out!</p>
            <p className="text-sm text-ink-lighter">Complete tasks to earn more coins.</p>
          </div>
        </div>
      )}

      {/* Past requests */}
      {pastRequests.length > 0 && (
        <div className="px-5 mt-6">
          <h3 className="text-xs font-bold text-ink-lighter uppercase tracking-wider mb-3">
            Past Cash Outs
          </h3>
          <div className="space-y-2">
            {pastRequests.slice().reverse().map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  req.status === 'approved' ? 'bg-sage-light' : 'bg-coral-light'
                }`}>
                  <span className="text-lg">{req.status === 'approved' ? '✅' : '❌'}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">
                    {req.cookies} coins → ${req.realAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-ink-lighter">{formatDate(req.createdAt)}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  req.status === 'approved' ? 'bg-sage-light text-sage-dark' : 'bg-coral-light text-coral-dark'
                }`}>
                  {req.status === 'approved' ? 'Paid' : 'Denied'}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Mascot */}
      <div className="fixed bottom-24 right-4 z-30">
        <Mascot message="Save or spend? Your choice!" size="md" />
      </div>
    </div>
  );
}
