import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import PinPad from './components/PinPad';
import ParentDashboard from './screens/ParentDashboard';
import AwardFlow from './screens/AwardFlow';
import KidCookieJar from './screens/KidCookieJar';
import RedeemScreen from './screens/RedeemScreen';
import MyDeposit from './screens/MyDeposit';

function KidNav() {
  const { kids, activeKidId, setActiveKid } = useStore();
  const kid = kids.find((k) => k.id === activeKidId) ?? kids[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-4 py-2 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {kids.map((k) => (
          <button
            key={k.id}
            onClick={() => setActiveKid(k.id)}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              k.id === (activeKidId ?? kids[0].id)
                ? 'text-cookie-dark'
                : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{k.emoji}</span>
            <span className="text-xs font-semibold">{k.name}</span>
          </button>
        ))}
        <button
          onClick={() => {}}
          className="flex flex-col items-center py-1 px-3 text-gray-400"
        >
          <span className="text-xl">🍪</span>
          <span className="text-xs font-semibold">Jar</span>
        </button>
        <button
          onClick={() => {}}
          className="flex flex-col items-center py-1 px-3 text-gray-400"
        >
          <span className="text-xl">💰</span>
          <span className="text-xs font-semibold">Deposit</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const viewMode = useStore((s) => s.viewMode);
  const activeKidId = useStore((s) => s.activeKidId);
  const setActiveKid = useStore((s) => s.setActiveKid);
  const kids = useStore((s) => s.kids);

  // Ensure an active kid is always set for kid mode
  if (viewMode === 'kid' && !activeKidId && kids.length > 0) {
    setActiveKid(kids[0].id);
  }

  if (viewMode === 'locked') return <PinPad />;

  return (
    <div className="max-w-md mx-auto min-h-screen relative">
      <Routes>
        <Route path="/" element={<ParentDashboard />} />
        <Route path="/award/:kidId" element={<AwardFlow />} />
        <Route path="/award" element={<AwardFlow />} />
        <Route path="/jar" element={<KidCookieJar />} />
        <Route path="/redeem" element={<RedeemScreen />} />
        <Route path="/deposit" element={<MyDeposit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
