import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  CheckIcon as CheckOutline,
  CalendarDaysIcon as CalendarOutline,
  ClockIcon as ClockOutline,
  UserCircleIcon as UserOutline,
} from '@heroicons/react/24/outline';
import {
  CheckIcon as CheckSolid,
  CalendarDaysIcon as CalendarSolid,
  ClockIcon as ClockSolid,
  UserCircleIcon as UserSolid,
} from '@heroicons/react/24/solid';

export default function KidBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { kidName } = useParams();
  const base = `/kid/${kidName}`;

  const tabs = [
    { path: `${base}/todo`, label: 'To-do', Icon: CheckOutline, ActiveIcon: CheckSolid },
    { path: base, label: 'Today', Icon: CalendarOutline, ActiveIcon: CalendarSolid },
    { path: `${base}/focus`, label: 'Focus', Icon: ClockOutline, ActiveIcon: ClockSolid },
    { path: `${base}/me`, label: 'Me', Icon: UserOutline, ActiveIcon: UserSolid },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}>
      <nav className="mx-auto max-w-md bg-white rounded-full shadow-[0_2px_24px_rgba(0,0,0,0.10)] px-2 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const active = tab.path === base
            ? pathname === base || pathname === base + '/'
            : pathname.startsWith(tab.path);
          const Icon = active ? tab.ActiveIcon : tab.Icon;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center py-1.5 px-4 rounded-full transition-all min-w-[60px] ${
                active
                  ? 'bg-ink text-white'
                  : 'text-ink-lighter'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className={`text-[10px] leading-tight ${active ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
