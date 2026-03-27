import { useNavigate, useLocation, useParams } from 'react-router-dom';

export default function KidBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { kidName } = useParams();
  const base = `/kid/${kidName}`;

  const tabs = [
    { path: base, label: 'My Jar', icon: '🍪' },
    { path: `${base}/redeem`, label: 'Redeem', icon: '🎁', center: true },
    { path: `${base}/deposit`, label: 'Deposit', icon: '📈' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}>
      <nav className="mx-auto max-w-md bg-white rounded-full shadow-[0_2px_20px_rgba(0,0,0,0.1)] px-2 py-1.5 flex items-end justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.path;

          if (tab.center) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center -mt-5 relative"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-colors ${
                    active
                      ? 'bg-mint text-white'
                      : 'bg-white text-warm-gray border-2 border-cream-dark'
                  }`}
                >
                  <span className="text-2xl">{tab.icon}</span>
                </div>
                <span className={`text-[10px] mt-1 ${active ? 'text-mint-dark font-bold' : 'text-warm-gray-light font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center py-2 px-4 transition-colors ${
                active ? 'text-warm-gray' : 'text-warm-gray-light'
              }`}
            >
              <span className="text-xl mb-0.5">{tab.icon}</span>
              <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
