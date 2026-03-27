import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useStore } from '../store/useStore';
import AnimatedCookieCount from '../components/AnimatedCookieCount';

export default function MyDeposit() {
  const navigate = useNavigate();
  const { kids, activeKidId } = useStore();
  const kid = kids.find((k) => k.id === activeKidId) ?? kids[0];

  const chartData = kid.weeklyGrowth.map((val, i) => ({
    week: `W${i + 1}`,
    cookies: val,
    euros: +(val / 10).toFixed(2),
  }));

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen pb-24 bg-bg">
      {/* Header */}
      <div className="px-5 pt-14 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate('..')}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ink shadow-sm"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-ink font-heading">My Deposit</h1>
      </div>

      {/* Balance card */}
      <div className="mx-5 mt-4 bg-gradient-to-br from-lavender-dark to-lavender rounded-3xl p-6 text-white shadow-lg">
        <p className="text-sm opacity-80 mb-1">Savings Balance</p>
        <AnimatedCookieCount
          value={kid.depositBalance}
          className="text-4xl font-extrabold block"
          showEuro
          duration={1000}
        />
        <div className="mt-3 flex items-center gap-2">
          <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded-full">
            📈 5% monthly bonus
          </span>
        </div>
      </div>

      {/* Growth chart */}
      <div className="px-5 mt-8">
        <h3 className="text-xs font-bold text-ink-lighter uppercase tracking-wider mb-4">
          8-Week Growth
        </h3>
        {kid.depositBalance === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm">
            <p className="text-4xl mb-2">📊</p>
            <p className="text-ink text-sm font-semibold">No investments yet</p>
            <p className="text-ink-lighter text-xs">Invest cookies to see growth!</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCookies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C4B5FD" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F3F0" />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value} 🍪 (€${(Number(value) / 10).toFixed(2)})`, 'Balance']}
                />
                <Area
                  type="monotone"
                  dataKey="cookies"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fill="url(#colorCookies)"
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Investment history */}
      <div className="px-5 mt-8">
        <h3 className="text-xs font-bold text-ink-lighter uppercase tracking-wider mb-3">
          Investment History
        </h3>
        {kid.depositHistory.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-3xl shadow-sm">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm text-ink-lighter">No history yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {kid.depositHistory
              .slice()
              .reverse()
              .map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    entry.type === 'deposit' ? 'bg-lavender-light' : 'bg-sage-light'
                  }`}>
                    <span className="text-lg">
                      {entry.type === 'deposit' ? '💰' : '✨'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">
                      {entry.type === 'deposit' ? 'Investment' : 'Monthly Bonus'}
                    </p>
                    <p className="text-xs text-ink-lighter">{formatDate(entry.date)}</p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      entry.type === 'bonus' ? 'text-sage-dark' : 'text-lavender-dark'
                    }`}
                  >
                    +{entry.cookies} 🍪
                  </span>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
