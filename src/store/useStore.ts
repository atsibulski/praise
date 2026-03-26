import { create } from 'zustand';

export interface Task {
  id: string;
  name: string;
  cookies: number;
  completedToday: boolean;
}

export interface ActivityItem {
  id: string;
  kidId: string;
  type: 'award' | 'redeem' | 'invest';
  description: string;
  cookies: number;
  timestamp: number;
}

export interface DepositEntry {
  id: string;
  cookies: number;
  date: number;
  type: 'deposit' | 'bonus';
}

export interface Kid {
  id: string;
  name: string;
  emoji: string;
  cookieBalance: number;
  streak: number;
  tasks: Task[];
  depositBalance: number;
  depositHistory: DepositEntry[];
  weeklyGrowth: number[];
}

export type ViewMode = 'locked' | 'parent' | 'kid';

interface StoreState {
  kids: Kid[];
  activeKidId: string | null;
  viewMode: ViewMode;
  activity: ActivityItem[];

  setViewMode: (mode: ViewMode) => void;
  setActiveKid: (id: string | null) => void;
  awardCookies: (kidId: string, taskName: string, amount: number) => void;
  completeTask: (kidId: string, taskId: string) => void;
  redeemCashOut: (kidId: string, cookies: number) => void;
  investCookies: (kidId: string, cookies: number) => void;
}

const DEFAULT_TASKS: Omit<Task, 'completedToday'>[] = [
  { id: 'make-bed', name: 'Make bed', cookies: 5 },
  { id: 'homework', name: 'Do homework', cookies: 15 },
  { id: 'brush-teeth', name: 'Brush teeth', cookies: 3 },
  { id: 'tidy-room', name: 'Tidy room', cookies: 10 },
  { id: 'read-20', name: 'Read 20 min', cookies: 10 },
];

const uid = () => Math.random().toString(36).slice(2, 9);

const generateWeeklyGrowth = (invested: number): number[] => {
  const weeks: number[] = [];
  let balance = Math.max(invested * 0.4, 5);
  for (let i = 0; i < 8; i++) {
    weeks.push(Math.round(balance));
    balance = balance * 1.05 + (Math.random() * invested * 0.05);
  }
  weeks[weeks.length - 1] = invested;
  return weeks;
};

export const useStore = create<StoreState>((set) => ({
  kids: [
    {
      id: 'emma',
      name: 'Emma',
      emoji: '👧',
      cookieBalance: 47,
      streak: 5,
      tasks: DEFAULT_TASKS.map((t) => ({ ...t, completedToday: false })),
      depositBalance: 23,
      depositHistory: [
        { id: uid(), cookies: 10, date: Date.now() - 7 * 86400000, type: 'deposit' },
        { id: uid(), cookies: 1, date: Date.now() - 3 * 86400000, type: 'bonus' },
        { id: uid(), cookies: 12, date: Date.now() - 1 * 86400000, type: 'deposit' },
      ],
      weeklyGrowth: generateWeeklyGrowth(23),
    },
    {
      id: 'lucas',
      name: 'Lucas',
      emoji: '👦',
      cookieBalance: 31,
      streak: 2,
      tasks: DEFAULT_TASKS.map((t) => ({ ...t, completedToday: false })),
      depositBalance: 45,
      depositHistory: [
        { id: uid(), cookies: 20, date: Date.now() - 14 * 86400000, type: 'deposit' },
        { id: uid(), cookies: 2, date: Date.now() - 7 * 86400000, type: 'bonus' },
        { id: uid(), cookies: 23, date: Date.now() - 2 * 86400000, type: 'deposit' },
      ],
      weeklyGrowth: generateWeeklyGrowth(45),
    },
  ],
  activeKidId: null,
  viewMode: 'locked',
  activity: [
    {
      id: uid(),
      kidId: 'emma',
      type: 'award',
      description: 'Made her bed',
      cookies: 5,
      timestamp: Date.now() - 3600000,
    },
    {
      id: uid(),
      kidId: 'lucas',
      type: 'award',
      description: 'Did homework',
      cookies: 15,
      timestamp: Date.now() - 7200000,
    },
    {
      id: uid(),
      kidId: 'emma',
      type: 'invest',
      description: 'Saved to deposit',
      cookies: 12,
      timestamp: Date.now() - 86400000,
    },
  ],

  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveKid: (id) => set({ activeKidId: id }),

  awardCookies: (kidId, taskName, amount) =>
    set((state) => ({
      kids: state.kids.map((k) =>
        k.id === kidId ? { ...k, cookieBalance: k.cookieBalance + amount } : k
      ),
      activity: [
        {
          id: uid(),
          kidId,
          type: 'award' as const,
          description: taskName,
          cookies: amount,
          timestamp: Date.now(),
        },
        ...state.activity,
      ],
    })),

  completeTask: (kidId, taskId) =>
    set((state) => ({
      kids: state.kids.map((k) =>
        k.id === kidId
          ? {
              ...k,
              cookieBalance:
                k.cookieBalance +
                (k.tasks.find((t) => t.id === taskId)?.cookies ?? 0),
              tasks: k.tasks.map((t) =>
                t.id === taskId ? { ...t, completedToday: true } : t
              ),
            }
          : k
      ),
      activity: [
        {
          id: uid(),
          kidId,
          type: 'award' as const,
          description:
            state.kids
              .find((k) => k.id === kidId)
              ?.tasks.find((t) => t.id === taskId)?.name ?? 'Task',
          cookies:
            state.kids
              .find((k) => k.id === kidId)
              ?.tasks.find((t) => t.id === taskId)?.cookies ?? 0,
          timestamp: Date.now(),
        },
        ...state.activity,
      ],
    })),

  redeemCashOut: (kidId, cookies) =>
    set((state) => ({
      kids: state.kids.map((k) =>
        k.id === kidId
          ? { ...k, cookieBalance: k.cookieBalance - cookies }
          : k
      ),
      activity: [
        {
          id: uid(),
          kidId,
          type: 'redeem' as const,
          description: `Cashed out €${(cookies / 10).toFixed(2)}`,
          cookies,
          timestamp: Date.now(),
        },
        ...state.activity,
      ],
    })),

  investCookies: (kidId, cookies) =>
    set((state) => ({
      kids: state.kids.map((k) =>
        k.id === kidId
          ? {
              ...k,
              cookieBalance: k.cookieBalance - cookies,
              depositBalance: k.depositBalance + cookies,
              depositHistory: [
                ...k.depositHistory,
                { id: uid(), cookies, date: Date.now(), type: 'deposit' as const },
              ],
              weeklyGrowth: [
                ...k.weeklyGrowth.slice(1),
                k.depositBalance + cookies,
              ],
            }
          : k
      ),
      activity: [
        {
          id: uid(),
          kidId,
          type: 'invest' as const,
          description: 'Saved to deposit',
          cookies,
          timestamp: Date.now(),
        },
        ...state.activity,
      ],
    })),
}));
