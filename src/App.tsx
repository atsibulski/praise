import { Routes, Route, Navigate } from 'react-router-dom';
import KidShell from './components/KidShell';
import RolePicker from './screens/RolePicker';
import ParentDashboard from './screens/ParentDashboard';
import AwardFlow from './screens/AwardFlow';
import KidCookieJar from './screens/KidCookieJar';
import RedeemScreen from './screens/RedeemScreen';
import MyDeposit from './screens/MyDeposit';

export default function App() {
  return (
    <div className="max-w-md mx-auto min-h-screen relative">
      <Routes>
        {/* Role picker */}
        <Route path="/start" element={<RolePicker />} />

        {/* Parent routes */}
        <Route path="/" element={<ParentDashboard />} />
        <Route path="/award/:kidId" element={<AwardFlow />} />
        <Route path="/award" element={<AwardFlow />} />

        {/* Kid standalone app */}
        <Route path="/kid/:kidName" element={<KidShell />}>
          <Route index element={<KidCookieJar />} />
          <Route path="redeem" element={<RedeemScreen />} />
          <Route path="deposit" element={<MyDeposit />} />
        </Route>

        <Route path="*" element={<Navigate to="/start" replace />} />
      </Routes>
    </div>
  );
}
