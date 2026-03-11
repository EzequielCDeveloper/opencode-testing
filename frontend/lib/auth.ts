import { User, AuthData } from '@/types';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
const EXPIRES_KEY = 'tokenExpires';

export function saveAuthData(data: AuthData): void {
  const expiresAt = Date.now() + data.expiresIn * 1000;
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  localStorage.setItem(EXPIRES_KEY, String(expiresAt));
}

export function clearAuthData(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const expires = localStorage.getItem(EXPIRES_KEY);
  if (!token || !expires) return null;
  if (Date.now() > Number(expires)) {
    clearAuthData();
    return null;
  }
  return token;
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
