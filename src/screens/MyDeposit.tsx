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
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="px-5 pt-12 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500"
        >
          ←
        </button>
        <h1 className="text-xl font-extrabold text-gray-800">My Deposit</h1>
      </div>

      {/* Balance card */}
      <div className="mx-5 mt-4 bg-gradient-to-br from-purple to-purple-light rounded-3xl p-6 text-white shadow-lg">
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
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
          8-Week Growth
        </h3>
        {kid.depositBalance === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-3xl">
            <p className="text-4xl mb-2">📊</p>
            <p className="text-gray-400 text-sm font-semibold">
              No investments yet
            </p>
            <p className="text-gray-300 text-xs">Invest cookies to see growth!</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCookies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          Investment History
        </h3>
        {kid.depositHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-300">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm">No history yet</p>
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
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-50"
                >
                  <span className="text-lg">
                    {entry.type === 'deposit' ? '💰' : '✨'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">
                      {entry.type === 'deposit' ? 'Investment' : 'Monthly Bonus'}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(entry.date)}</p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      entry.type === 'bonus' ? 'text-mint' : 'text-purple'
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
