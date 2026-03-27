import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import PinPad from './components/PinPad';
import KidShell from './components/KidShell';
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

  if (viewMode === 'kid' && !activeKidId && kids.length > 0) {
    setActiveKid(kids[0].id);
  }

  if (viewMode === 'locked') return <PinPad />;

  return (
    <div className="max-w-md mx-auto min-h-screen relative">
      <Routes>
        {/* Parent routes */}
        <Route path="/" element={<ParentDashboard />} />
        <Route path="/award/:kidId" element={<AwardFlow />} />
        <Route path="/award" element={<AwardFlow />} />

        {/* Kid standalone app — all nested under /kid/:kidName */}
        <Route path="/kid/:kidName" element={<KidShell />}>
          <Route index element={<KidCookieJar />} />
          <Route path="redeem" element={<RedeemScreen />} />
          <Route path="deposit" element={<MyDeposit />} />
        </Route>

        {/* Legacy kid routes redirect */}
        <Route path="/jar" element={<KidJarRedirect />} />
        <Route path="/redeem" element={<KidJarRedirect />} />
        <Route path="/deposit" element={<KidJarRedirect />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function KidJarRedirect() {
  const kids = useStore((s) => s.kids);
  const activeKidId = useStore((s) => s.activeKidId);
  const kid = kids.find((k) => k.id === activeKidId) ?? kids[0];
  return <Navigate to={`/kid/${kid.name.toLowerCase()}`} replace />;
}
