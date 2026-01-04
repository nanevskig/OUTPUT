
export type ActivityType = 'creator' | 'consumer';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  type: ActivityType;
}

export interface AppState {
  logs: Record<string, ActivityType>;
  remindersEnabled: boolean;
  reminderTime: string;
}

export enum View {
  DAILY = 'daily',
  HISTORY = 'history',
  SYSTEM = 'system'
}