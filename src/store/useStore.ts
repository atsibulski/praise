import { create } from 'zustand';

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'anytime';
export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  name: string;
  emoji: string;
  cookies: number;
  xp: number;
  duration: number; // minutes
  timeSlot: TimeSlot;
  priority: Priority;
  completedToday: boolean;
  subtasks?: { id: string; name: string; done: boolean }[];
}

export interface Reward {
  id: string;
  name: string;
  emoji: string;
  cost: number; // XP cost
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

export interface ActivityItem {
  id: string;
  kidId: string;
  type: 'award' | 'redeem' | 'invest' | 'achievement';
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
  depositBalance: number;
  depositHistory: DepositEntry[];
  weeklyGrowth: number[];
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
];

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

  return updated;
}

export const useStore = create<StoreState>((set) => ({
  kids: [
    {
      id: 'emma',
      name: 'Emma',
      emoji: '👧',
      cookieBalance: 47,
      xp: 340,
      totalXp: 340,
      level: 'silver',
      streak: 5,
      longestStreak: 12,
      tasks: DEFAULT_TASKS.map((t) => ({ ...t, completedToday: false })),
      rewards: DEFAULT_REWARDS.map(r => ({ ...r, redeemed: false })),
      achievements: DEFAULT_ACHIEVEMENTS.map((a, i) => ({ ...a, unlocked: i < 4, unlockedAt: i < 4 ? Date.now() - (4 - i) * 86400000 : undefined })),
      depositBalance: 23,
      depositHistory: [
        { id: uid(), cookies: 10, date: Date.now() - 7 * 86400000, type: 'deposit' },
        { id: uid(), cookies: 1, date: Date.now() - 3 * 86400000, type: 'bonus' },
        { id: uid(), cookies: 12, date: Date.now() - 1 * 86400000, type: 'deposit' },
      ],
      weeklyGrowth: generateWeeklyGrowth(23),
      moodLog: [
        { day: 'Sun', emoji: '🌸' },
        { day: 'Mon', emoji: '🌸' },
      ],
      totalDaysPlanned: 5,
    },
    {
      id: 'lucas',
      name: 'Lucas',
      emoji: '👦',
      cookieBalance: 31,
      xp: 150,
      totalXp: 150,
      level: 'bronze',
      streak: 2,
      longestStreak: 8,
      tasks: DEFAULT_TASKS.map((t) => ({ ...t, completedToday: false })),
      rewards: DEFAULT_REWARDS.map(r => ({ ...r, redeemed: false })),
      achievements: DEFAULT_ACHIEVEMENTS.map((a, i) => ({ ...a, unlocked: i < 2, unlockedAt: i < 2 ? Date.now() - (2 - i) * 86400000 : undefined })),
      depositBalance: 45,
      depositHistory: [
        { id: uid(), cookies: 20, date: Date.now() - 14 * 86400000, type: 'deposit' },
        { id: uid(), cookies: 2, date: Date.now() - 7 * 86400000, type: 'bonus' },
        { id: uid(), cookies: 23, date: Date.now() - 2 * 86400000, type: 'deposit' },
      ],
      weeklyGrowth: generateWeeklyGrowth(45),
      moodLog: [
        { day: 'Sun', emoji: '🌸' },
      ],
      totalDaysPlanned: 3,
    },
  ],
  activeKidId: null,
  viewMode: 'choose',
  activity: [
    {
      id: uid(),
      kidId: 'emma',
      type: 'award',
      description: 'Morning routine',
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

  redeemReward: (kidId, rewardId) =>
    set((state) => ({
      kids: state.kids.map((k) => {
        if (k.id !== kidId) return k;
        const reward = k.rewards.find(r => r.id === rewardId);
        if (!reward || reward.redeemed || k.xp < reward.cost) return k;
        const updated = {
          ...k,
          xp: k.xp - reward.cost,
          rewards: k.rewards.map(r =>
            r.id === rewardId ? { ...r, redeemed: true } : r
          ),
        };
        return checkAchievements(updated);
      }),
      activity: [
        {
          id: uid(),
          kidId,
          type: 'redeem' as const,
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
        k.id === kidId
          ? { ...k, tasks: [...k.tasks, { ...task, completedToday: false }] }
          : k
      ),
    })),

  addReward: (kidId, reward) =>
    set((state) => ({
      kids: state.kids.map((k) =>
        k.id === kidId
          ? { ...k, rewards: [...k.rewards, { ...reward, redeemed: false }] }
          : k
      ),
    })),

  logMood: (kidId, day, emoji) =>
    set((state) => ({
      kids: state.kids.map((k) => {
        if (k.id !== kidId) return k;
        const existing = k.moodLog.findIndex(m => m.day === day);
        const moodLog = [...k.moodLog];
        if (existing >= 0) {
          moodLog[existing] = { day, emoji };
        } else {
          moodLog.push({ day, emoji });
        }
        return { ...k, moodLog };
      }),
    })),
}));
