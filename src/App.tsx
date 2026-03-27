import { Routes, Route, Navigate } from 'react-router-dom';
import KidShell from './components/KidShell';
import RolePicker from './screens/RolePicker';
import ParentDashboard from './screens/ParentDashboard';
import AwardFlow from './screens/AwardFlow';
import KidCookieJar from './screens/KidCookieJar';
import KidTodo from './screens/KidTodo';
import KidFocus from './screens/KidFocus';
import KidMe from './screens/KidMe';
import KidRewards from './screens/KidRewards';
import KidVault from './screens/KidVault';
import KidInvest from './screens/KidInvest';
import KidCashOut from './screens/KidCashOut';
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
          <Route path="todo" element={<KidTodo />} />
          <Route path="focus" element={<KidFocus />} />
          <Route path="me" element={<KidMe />} />
          <Route path="rewards" element={<KidRewards />} />
          <Route path="vault" element={<KidVault />} />
          <Route path="invest" element={<KidInvest />} />
          <Route path="cashout" element={<KidCashOut />} />
          <Route path="redeem" element={<RedeemScreen />} />
          <Route path="deposit" element={<MyDeposit />} />
        </Route>

        <Route path="*" element={<Navigate to="/start" replace />} />
      </Routes>
    </div>
  );
}
