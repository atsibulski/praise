import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  HomeIcon as HomeOutline,
  GiftIcon as GiftOutline,
  ArrowTrendingUpIcon as TrendOutline,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  GiftIcon as GiftSolid,
  ArrowTrendingUpIcon as TrendSolid,
} from '@heroicons/react/24/solid';

export default function KidBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { kidName } = useParams();
  const base = `/kid/${kidName}`;

  const tabs = [
    { path: base, label: 'My Jar', Icon: HomeOutline, ActiveIcon: HomeSolid },
    { path: `${base}/redeem`, label: 'Redeem', Icon: GiftOutline, ActiveIcon: GiftSolid, center: true },
    { path: `${base}/deposit`, label: 'Deposit', Icon: TrendOutline, ActiveIcon: TrendSolid },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}>
      <nav className="mx-auto max-w-md bg-white rounded-full shadow-[0_2px_24px_rgba(0,0,0,0.12)] px-3 py-1.5 flex items-end justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.path;
          const Icon = active ? tab.ActiveIcon : tab.Icon;

          if (tab.center) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center -mt-5 relative"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    active
                      ? 'bg-mint text-white scale-110'
                      : 'bg-white text-warm-gray-light border border-cream-dark'
                  }`}
                >
                  <Icon className="w-7 h-7" />
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
              className={`flex flex-col items-center py-2 px-5 rounded-2xl transition-all ${
                active
                  ? 'text-mint-dark bg-mint-light'
                  : 'text-warm-gray-light'
              }`}
            >
              <Icon className={`w-6 h-6 mb-0.5 ${active ? 'text-mint-dark' : ''}`} />
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
