
import { AppState } from '../types';

const STORAGE_KEY = 'cvc_app_data';

const DEFAULT_STATE: AppState = {
  logs: {},
  remindersEnabled: false,
  reminderTime: '20:00'
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_STATE;
  try {
    const parsed = JSON.parse(saved);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
};

export const getTodayKey = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
