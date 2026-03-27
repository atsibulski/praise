import { useNavigate, useLocation, useParams } from 'react-router-dom';

export default function KidBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { kidName } = useParams();
  const base = `/kid/${kidName}`;

  const tabs = [
    { path: base, label: 'My Jar', icon: '🍪' },
    { path: `${base}/redeem`, label: 'Redeem', icon: '🎁' },
    { path: `${base}/deposit`, label: 'Deposit', icon: '📈' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white/90 backdrop-blur-md border-t border-cream-dark z-40">
      <div className="flex" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}>
        {tabs.map((tab) => {
          const active = pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center py-2 pt-3 transition-colors ${
                active ? 'text-mint-dark' : 'text-warm-gray-light'
              }`}
            >
              <span className="text-xl mb-0.5">{tab.icon}</span>
              <span className={`text-[11px] ${active ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
