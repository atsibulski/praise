import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import PinPad from './components/PinPad';
import ParentDashboard from './screens/ParentDashboard';
import AwardFlow from './screens/AwardFlow';
import KidCookieJar from './screens/KidCookieJar';
import RedeemScreen from './screens/RedeemScreen';
import MyDeposit from './screens/MyDeposit';

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
