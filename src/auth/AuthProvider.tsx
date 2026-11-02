import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ApiError, request } from '../api/client';
import type { User } from '../types';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setUser(await request<User>('GET', '/auth/me'));
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          try { await request('POST', '/auth/refresh'); setUser(await request<User>('GET', '/auth/me')); } catch { /* signed out */ }
        }
      } finally { if (alive) setLoading(false); }
    })();
    const onExpired = () => setUser(null);
    window.addEventListener('auth:expired', onExpired);
    return () => { alive = false; window.removeEventListener('auth:expired', onExpired); };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setUser(await request<User>('POST', '/auth/login', { email, password }));
  }, []);
  const logout = useCallback(async () => {
    await request('POST', '/auth/logout').catch(() => undefined);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
}
