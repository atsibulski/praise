import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import AnimatedCookieCount from '../components/AnimatedCookieCount';

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
  const { kids, activity, setViewMode } = useStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Praise</h1>
          <p className="text-sm text-gray-400">Parent Dashboard</p>
        </div>
        <button
          onClick={() => setViewMode('locked')}
          className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full font-semibold"
        >
          Lock 🔒
        </button>
      </div>

      {/* Kid cards */}
      <div className="px-5 space-y-4 mb-8">
        {kids.map((kid, i) => (
          <motion.div
            key={kid.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{kid.emoji}</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{kid.name}</h2>
                  <p className="text-xs text-gray-400">
                    🔥 {kid.streak} day streak
                  </p>
                </div>
              </div>
              <div className="text-right">
                <AnimatedCookieCount
                  value={kid.cookieBalance}
                  className="text-xl font-extrabold text-cookie-dark"
                  showEuro
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/award/${kid.id}`)}
                className="flex-1 bg-cookie text-white font-bold py-2.5 rounded-2xl text-sm active:scale-95 transition-transform shadow-sm"
              >
                Award Cookies 🍪
              </button>
              <button
                onClick={() => {
                  useStore.getState().setActiveKid(kid.id);
                  setViewMode('kid');
                  navigate('/jar');
                }}
                className="px-4 bg-gray-100 text-gray-600 font-semibold py-2.5 rounded-2xl text-sm active:scale-95 transition-transform"
              >
                View
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="px-5">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          Recent Activity
        </h3>
        {activity.length === 0 ? (
          <div className="text-center py-12 text-gray-300">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-sm">No activity yet. Award some cookies!</p>
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
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-50"
                >
                  <span className="text-lg">{kid?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-400">{timeAgo(item.timestamp)}</p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      item.type === 'award'
                        ? 'text-mint'
                        : item.type === 'invest'
                        ? 'text-purple'
                        : 'text-pink'
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
    </div>
  );
}
