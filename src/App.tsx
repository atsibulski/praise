import { useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import PinPad from './components/PinPad';
import KidBottomNav from './components/KidBottomNav';
import ParentDashboard from './screens/ParentDashboard';
import AwardFlow from './screens/AwardFlow';
import KidCookieJar from './screens/KidCookieJar';
import RedeemScreen from './screens/RedeemScreen';
import MyDeposit from './screens/MyDeposit';

function KidEntry() {
  const { kidName } = useParams();
  const kids = useStore((s) => s.kids);
  const setActiveKid = useStore((s) => s.setActiveKid);
  const setViewMode = useStore((s) => s.setViewMode);

  const kid = kids.find((k) => k.name.toLowerCase() === kidName?.toLowerCase());

  useEffect(() => {
    if (kid) {
      setActiveKid(kid.id);
      setViewMode('kid');
    }
  }, [kid, setActiveKid, setViewMode]);

  if (!kid) return <Navigate to="/" replace />;
  return <KidCookieJar />;
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

  const { pathname } = useLocation();
  const showKidNav = ['/jar', '/redeem', '/deposit'].includes(pathname) || pathname.startsWith('/kid/');

  return (
    <div className="max-w-md mx-auto min-h-screen relative">
      <Routes>
        <Route path="/" element={<ParentDashboard />} />
        <Route path="/kid/:kidName" element={<KidEntry />} />
        <Route path="/award/:kidId" element={<AwardFlow />} />
        <Route path="/award" element={<AwardFlow />} />
        <Route path="/jar" element={<KidCookieJar />} />
        <Route path="/redeem" element={<RedeemScreen />} />
        <Route path="/deposit" element={<MyDeposit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showKidNav && <KidBottomNav />}
    </div>
  );
}
