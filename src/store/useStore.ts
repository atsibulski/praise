import { create } from 'zustand';

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'anytime';
export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  name: string;
  emoji: string;
  cookies: number;
  xp: number;
  duration: number;
  timeSlot: TimeSlot;
  priority: Priority;
  completedToday: boolean;
  subtasks?: { id: string; name: string; done: boolean }[];
}

export interface Reward {
  id: string;
  name: string;
  emoji: string;
  cost: number; // cookie cost
  description: string;
  redeemed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface CashOutRequest {
  id: string;
  cookies: number;
  realAmount: number;
  status: 'pending' | 'approved' | 'denied';
  createdAt: number;
  resolvedAt?: number;
}

export interface VaultEntry {
  id: string;
  cookies: number;
  date: number;
  type: 'deposit' | 'interest' | 'withdrawal';
}

export interface ActivityItem {
  id: string;
  kidId: string;
  type: 'award' | 'redeem' | 'invest' | 'achievement' | 'cashout' | 'interest';
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

export type Level = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface FinancialSettings {
  conversionRate: number;     // cookies per $1 (e.g. 100)
  interestRate: number;       // weekly rate as decimal (e.g. 0.02 = 2%)
  lockInWeeks: number;        // min weeks before withdrawal
  cashOutEnabled: boolean;
  investEnabled: boolean;
}

export interface Kid {
  id: string;
  name: string;
  emoji: string;
  cookieBalance: number;
  xp: number;
  totalXp: number;
  level: Level;
  streak: number;
  longestStreak: number;
  tasks: Task[];
  rewards: Reward[];
  achievements: Achievement[];
  // Vault / financial
  vaultBalance: number;
  totalInterestEarned: number;
  lastInterestDate: number;
  vaultHistory: VaultEntry[];
  cashOutRequests: CashOutRequest[];
  financialSettings: FinancialSettings;
  // Legacy compat
  depositBalance: number;
  depositHistory: DepositEntry[];
  weeklyGrowth: number[];
  // Profile
  moodLog: { day: string; emoji: string }[];
  totalDaysPlanned: number;
}

export type ViewMode = 'choose' | 'parent' | 'kid';

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
  redeemReward: (kidId: string, rewardId: string) => void;
  addTask: (kidId: string, task: Omit<Task, 'completedToday'>) => void;
  addReward: (kidId: string, reward: Omit<Reward, 'redeemed'>) => void;
  logMood: (kidId: string, day: string, emoji: string) => void;
  // Vault actions
  depositToVault: (kidId: string, cookies: number) => void;
  withdrawFromVault: (kidId: string, cookies: number) => void;
  requestCashOut: (kidId: string, cookies: number) => void;
  approveCashOut: (kidId: string, requestId: string) => void;
  denyCashOut: (kidId: string, requestId: string) => void;
  creditInterest: (kidId: string) => void;
  updateFinancialSettings: (kidId: string, settings: Partial<FinancialSettings>) => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);

function getLevel(totalXp: number): Level {
  if (totalXp >= 1000) return 'diamond';
  if (totalXp >= 500) return 'gold';
  if (totalXp >= 200) return 'silver';
  return 'bronze';
}

const LEVEL_EMOJI: Record<Level, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  diamond: '💎',
};

export { LEVEL_EMOJI };

const DEFAULT_TASKS: Omit<Task, 'completedToday'>[] = [
  { id: 'plan-day', name: 'Plan your day', emoji: '📋', cookies: 3, xp: 10, duration: 10, timeSlot: 'morning', priority: 'medium' },
  { id: 'morning-routine', name: 'Morning routine', emoji: '📅', cookies: 5, xp: 15, duration: 30, timeSlot: 'morning', priority: 'high', subtasks: [
    { id: 'brush-am', name: 'Brush teeth', done: false },
    { id: 'get-dressed', name: 'Get dressed', done: false },
    { id: 'make-bed', name: 'Make bed', done: false },
    { id: 'breakfast', name: 'Eat breakfast', done: false },
  ]},
  { id: 'quick-tidy', name: 'Quick tidy', emoji: '🧹', cookies: 3, xp: 10, duration: 5, timeSlot: 'morning', priority: 'low' },
  { id: 'drink-water', name: 'Drink water', emoji: '💧', cookies: 2, xp: 5, duration: 5, timeSlot: 'afternoon', priority: 'low' },
  { id: 'homework', name: 'Do homework', emoji: '📚', cookies: 15, xp: 30, duration: 45, timeSlot: 'afternoon', priority: 'high' },
  { id: 'read-20', name: 'Read 20 min', emoji: '📖', cookies: 10, xp: 20, duration: 20, timeSlot: 'afternoon', priority: 'medium' },
  { id: 'evening-routine', name: 'Evening routine', emoji: '🌙', cookies: 5, xp: 15, duration: 20, timeSlot: 'evening', priority: 'high' },
  { id: 'tidy-room', name: 'Tidy room', emoji: '🏠', cookies: 10, xp: 20, duration: 15, timeSlot: 'evening', priority: 'medium' },
];

const DEFAULT_REWARDS: Omit<Reward, 'redeemed'>[] = [
  { id: 'screen-time', name: '30 min Screen Time', emoji: '📱', cost: 50, description: 'Extra screen time!' },
  { id: 'ice-cream', name: 'Ice Cream Trip', emoji: '🍦', cost: 100, description: 'A trip to the ice cream shop' },
  { id: 'movie-night', name: 'Movie Night Pick', emoji: '🎬', cost: 75, description: 'You pick the family movie!' },
  { id: 'stay-up', name: 'Stay Up Late', emoji: '🌟', cost: 60, description: '30 min past bedtime' },
  { id: 'toy-shop', name: 'Toy Shop Visit', emoji: '🧸', cost: 200, description: 'Pick something at the toy shop!' },
];

const DEFAULT_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first-task', name: 'First Task!', emoji: '⭐', description: 'Complete your very first task' },
  { id: 'streak-3', name: 'On Fire!', emoji: '🔥', description: '3-day streak' },
  { id: 'streak-7', name: 'Week Warrior', emoji: '⚡', description: '7-day streak' },
  { id: 'streak-30', name: 'Monthly Master', emoji: '👑', description: '30-day streak' },
  { id: 'xp-100', name: 'XP Hunter', emoji: '🎯', description: 'Earn 100 total XP' },
  { id: 'xp-500', name: 'XP Legend', emoji: '🏆', description: 'Earn 500 total XP' },
  { id: 'all-done', name: 'Perfect Day', emoji: '🌟', description: 'Complete all tasks in a day' },
  { id: 'first-reward', name: 'Reward Time!', emoji: '🎁', description: 'Redeem your first reward' },
  { id: 'first-invest', name: 'Smart Saver', emoji: '🌱', description: 'Make your first vault deposit' },
  { id: 'vault-100', name: 'Vault Pro', emoji: '🏦', description: 'Save 100 coins in your vault' },
];

const DEFAULT_FINANCIAL: FinancialSettings = {
  conversionRate: 100,  // 100 cookies = $1
  interestRate: 0.02,   // 2% per week
  lockInWeeks: 2,
  cashOutEnabled: true,
  investEnabled: true,
};

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

function checkAchievements(kid: Kid): Kid {
  const updated = { ...kid, achievements: [...kid.achievements] };
  const unlock = (id: string) => {
    const idx = updated.achievements.findIndex(a => a.id === id && !a.unlocked);
    if (idx >= 0) {
      updated.achievements[idx] = { ...updated.achievements[idx], unlocked: true, unlockedAt: Date.now() };
    }
  };

  const completedCount = kid.tasks.filter(t => t.completedToday).length;
  if (completedCount >= 1) unlock('first-task');
  if (completedCount === kid.tasks.length) unlock('all-done');
  if (kid.streak >= 3) unlock('streak-3');
  if (kid.streak >= 7) unlock('streak-7');
  if (kid.streak >= 30) unlock('streak-30');
  if (kid.totalXp >= 100) unlock('xp-100');
  if (kid.totalXp >= 500) unlock('xp-500');
  if (kid.vaultBalance > 0) unlock('first-invest');
  if (kid.vaultBalance >= 100) unlock('vault-100');

  return updated;
}

function createKid(id: string, name: string, emoji: string, cookies: number, xp: number, streak: number, longestStreak: number, vaultBalance: number, unlockedCount: number, totalDays: number): Kid {
  return {
    id,
    name,
    emoji,
    cookieBalance: cookies,
    xp,
    totalXp: xp,
    level: getLevel(xp),
    streak,
    longestStreak,
    tasks: DEFAULT_TASKS.map(t => ({ ...t, completedToday: false })),
    rewards: DEFAULT_REWARDS.map(r => ({ ...r, redeemed: false })),
    achievements: DEFAULT_ACHIEVEMENTS.map((a, i) => ({
      ...a,
      unlocked: i < unlockedCount,
      unlockedAt: i < unlockedCount ? Date.now() - (unlockedCount - i) * 86400000 : undefined,
    })),
    vaultBalance,
    totalInterestEarned: Math.round(vaultBalance * 0.06),
    lastInterestDate: Date.now() - 3 * 86400000,
    vaultHistory: vaultBalance > 0 ? [
      { id: uid(), cookies: Math.round(vaultBalance * 0.7), date: Date.now() - 14 * 86400000, type: 'deposit' as const },
      { id: uid(), cookies: Math.round(vaultBalance * 0.04), date: Date.now() - 7 * 86400000, type: 'interest' as const },
      { id: uid(), cookies: Math.round(vaultBalance * 0.3), date: Date.now() - 2 * 86400000, type: 'deposit' as const },
      { id: uid(), cookies: Math.round(vaultBalance * 0.02), date: Date.now() - 1 * 86400000, type: 'interest' as const },
    ] : [],
    cashOutRequests: id === 'emma' ? [
      { id: uid(), cookies: 50, realAmount: 0.50, status: 'approved' as const, createdAt: Date.now() - 5 * 86400000, resolvedAt: Date.now() - 4 * 86400000 },
    ] : [],
    financialSettings: { ...DEFAULT_FINANCIAL },
    depositBalance: vaultBalance,
    depositHistory: vaultBalance > 0 ? [
      { id: uid(), cookies: Math.round(vaultBalance * 0.7), date: Date.now() - 14 * 86400000, type: 'deposit' as const },
      { id: uid(), cookies: Math.round(vaultBalance * 0.04), date: Date.now() - 7 * 86400000, type: 'bonus' as const },
    ] : [],
    weeklyGrowth: generateWeeklyGrowth(vaultBalance),
    moodLog: id === 'emma' ? [{ day: 'Sun', emoji: '🌸' }, { day: 'Mon', emoji: '🌸' }] : [{ day: 'Sun', emoji: '🌸' }],
    totalDaysPlanned: totalDays,
  };
}

export const useStore = create<StoreState>((set) => ({
  kids: [
    createKid('emma', 'Emma', '👧', 47, 340, 5, 12, 85, 4, 5),
    createKid('lucas', 'Lucas', '👦', 31, 150, 2, 8, 45, 2, 3),
  ],
  activeKidId: null,
  viewMode: 'choose',
  activity: [
    { id: uid(), kidId: 'emma', type: 'award', description: 'Morning routine', cookies: 5, timestamp: Date.now() - 3600000 },
    { id: uid(), kidId: 'emma', type: 'interest', description: 'Vault earned interest!', cookies: 2, timestamp: Date.now() - 86400000 },
    { id: uid(), kidId: 'lucas', type: 'award', description: 'Did homework', cookies: 15, timestamp: Date.now() - 7200000 },
    { id: uid(), kidId: 'emma', type: 'invest', description: 'Deposited to vault', cookies: 12, timestamp: Date.now() - 2 * 86400000 },
  ],

  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveKid: (id) => set({ activeKidId: id }),

  awardCookies: (kidId, taskName, amount) =>
    set((state) => ({
      kids: state.kids.map((k) =>
        k.id === kidId ? { ...k, cookieBalance: k.cookieBalance + amount } : k
      ),
      activity: [
        { id: uid(), kidId, type: 'award' as const, description: taskName, cookies: amount, timestamp: Date.now() },
        ...state.activity,
      ],
    })),

  completeTask: (kidId, taskId) =>
    set((state) => ({
      kids: state.kids.map((k) => {
        if (k.id !== kidId) return k;
        const task = k.tasks.find((t) => t.id === taskId);
        if (!task || task.completedToday) return k;
        const updated = {
          ...k,
          cookieBalance: k.cookieBalance + task.cookies,
          xp: k.xp + task.xp,
          totalXp: k.totalXp + task.xp,
          tasks: k.tasks.map((t) =>
            t.id === taskId ? { ...t, completedToday: true } : t
          ),
        };
        updated.level = getLevel(updated.totalXp);
        return checkAchievements(updated);
      }),
      activity: [
        {
          id: uid(), kidId, type: 'award' as const,
          description: state.kids.find((k) => k.id === kidId)?.tasks.find((t) => t.id === taskId)?.name ?? 'Task',
          cookies: state.kids.find((k) => k.id === kidId)?.tasks.find((t) => t.id === taskId)?.cookies ?? 0,
          timestamp: Date.now(),
        },
        ...state.activity,
      ],
    })),

  redeemCashOut: (kidId, cookies) =>
    set((state) => ({
      kids: state.kids.map((k) =>
        k.id === kidId ? { ...k, cookieBalance: k.cookieBalance - cookies } : k
      ),
      activity: [
        { id: uid(), kidId, type: 'redeem' as const, description: `Cashed out $${(cookies / (state.kids.find(k => k.id === kidId)?.financialSettings.conversionRate ?? 100)).toFixed(2)}`, cookies, timestamp: Date.now() },
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
              depositHistory: [...k.depositHistory, { id: uid(), cookies, date: Date.now(), type: 'deposit' as const }],
              weeklyGrowth: [...k.weeklyGrowth.slice(1), k.depositBalance + cookies],
            }
          : k
      ),
      activity: [
        { id: uid(), kidId, type: 'invest' as const, description: 'Saved to deposit', cookies, timestamp: Date.now() },
        ...state.activity,
      ],
    })),

  redeemReward: (kidId, rewardId) =>
    set((state) => ({
      kids: state.kids.map((k) => {
        if (k.id !== kidId) return k;
        const reward = k.rewards.find(r => r.id === rewardId);
        if (!reward || reward.redeemed || k.cookieBalance < reward.cost) return k;
        const updated = {
          ...k,
          cookieBalance: k.cookieBalance - reward.cost,
          rewards: k.rewards.map(r => r.id === rewardId ? { ...r, redeemed: true } : r),
        };
        return checkAchievements(updated);
      }),
      activity: [
        {
          id: uid(), kidId, type: 'redeem' as const,
          description: state.kids.find(k => k.id === kidId)?.rewards.find(r => r.id === rewardId)?.name ?? 'Reward',
          cookies: state.kids.find(k => k.id === kidId)?.rewards.find(r => r.id === rewardId)?.cost ?? 0,
          timestamp: Date.now(),
        },
        ...state.activity,
      ],
    })),

  addTask: (kidId, task) =>
    set((state) => ({
      kids: state.kids.map((k) =>
        k.id === kidId ? { ...k, tasks: [...k.tasks, { ...task, completedToday: false }] } : k
      ),
    })),

  addReward: (kidId, reward) =>
    set((state) => ({
      kids: state.kids.map((k) =>
        k.id === kidId ? { ...k, rewards: [...k.rewards, { ...reward, redeemed: false }] } : k
      ),
    })),

  logMood: (kidId, day, emoji) =>
    set((state) => ({
      kids: state.kids.map((k) => {
        if (k.id !== kidId) return k;
        const moodLog = [...k.moodLog];
        const existing = moodLog.findIndex(m => m.day === day);
        if (existing >= 0) moodLog[existing] = { day, emoji };
        else moodLog.push({ day, emoji });
        return { ...k, moodLog };
      }),
    })),

  // === Vault / Financial actions ===

  depositToVault: (kidId, cookies) =>
    set((state) => ({
      kids: state.kids.map((k) => {
        if (k.id !== kidId || k.cookieBalance < cookies) return k;
        const updated = {
          ...k,
          cookieBalance: k.cookieBalance - cookies,
          vaultBalance: k.vaultBalance + cookies,
          vaultHistory: [...k.vaultHistory, { id: uid(), cookies, date: Date.now(), type: 'deposit' as const }],
        };
        return checkAchievements(updated);
      }),
      activity: [
        { id: uid(), kidId, type: 'invest' as const, description: 'Deposited to vault', cookies, timestamp: Date.now() },
        ...state.activity,
      ],
    })),

  withdrawFromVault: (kidId, cookies) =>
    set((state) => ({
      kids: state.kids.map((k) => {
        if (k.id !== kidId || k.vaultBalance < cookies) return k;
        return {
          ...k,
          cookieBalance: k.cookieBalance + cookies,
          vaultBalance: k.vaultBalance - cookies,
          vaultHistory: [...k.vaultHistory, { id: uid(), cookies, date: Date.now(), type: 'withdrawal' as const }],
        };
      }),
      activity: [
        { id: uid(), kidId, type: 'redeem' as const, description: 'Withdrew from vault', cookies, timestamp: Date.now() },
        ...state.activity,
      ],
    })),

  requestCashOut: (kidId, cookies) =>
    set((state) => ({
      kids: state.kids.map((k) => {
        if (k.id !== kidId || k.cookieBalance < cookies) return k;
        const rate = k.financialSettings.conversionRate;
        return {
          ...k,
          cookieBalance: k.cookieBalance - cookies,
          cashOutRequests: [
            ...k.cashOutRequests,
            { id: uid(), cookies, realAmount: cookies / rate, status: 'pending' as const, createdAt: Date.now() },
          ],
        };
      }),
      activity: [
        { id: uid(), kidId, type: 'cashout' as const, description: 'Cash out requested', cookies, timestamp: Date.now() },
        ...state.activity,
      ],
    })),

  approveCashOut: (kidId, requestId) =>
    set((state) => ({
      kids: state.kids.map((k) => {
        if (k.id !== kidId) return k;
        return {
          ...k,
          cashOutRequests: k.cashOutRequests.map(r =>
            r.id === requestId ? { ...r, status: 'approved' as const, resolvedAt: Date.now() } : r
          ),
        };
      }),
    })),

  denyCashOut: (kidId, requestId) =>
    set((state) => ({
      kids: state.kids.map((k) => {
        if (k.id !== kidId) return k;
        const req = k.cashOutRequests.find(r => r.id === requestId);
        return {
          ...k,
          cookieBalance: k.cookieBalance + (req?.cookies ?? 0), // refund
          cashOutRequests: k.cashOutRequests.map(r =>
            r.id === requestId ? { ...r, status: 'denied' as const, resolvedAt: Date.now() } : r
          ),
        };
      }),
    })),

  creditInterest: (kidId) =>
    set((state) => ({
      kids: state.kids.map((k) => {
        if (k.id !== kidId || k.vaultBalance === 0) return k;
        const interest = Math.max(1, Math.round(k.vaultBalance * k.financialSettings.interestRate));
        return {
          ...k,
          vaultBalance: k.vaultBalance + interest,
          totalInterestEarned: k.totalInterestEarned + interest,
          lastInterestDate: Date.now(),
          vaultHistory: [...k.vaultHistory, { id: uid(), cookies: interest, date: Date.now(), type: 'interest' as const }],
        };
      }),
      activity: [
        {
          id: uid(), kidId, type: 'interest' as const,
          description: 'Vault earned interest!',
          cookies: Math.max(1, Math.round((state.kids.find(k => k.id === kidId)?.vaultBalance ?? 0) * (state.kids.find(k => k.id === kidId)?.financialSettings.interestRate ?? 0.02))),
          timestamp: Date.now(),
        },
        ...state.activity,
      ],
    })),

  updateFinancialSettings: (kidId, settings) =>
    set((state) => ({
      kids: state.kids.map((k) =>
        k.id === kidId
          ? { ...k, financialSettings: { ...k.financialSettings, ...settings } }
          : k
      ),
    })),
}));
