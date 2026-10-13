import { useCallback, useEffect, useState } from 'react';
import { clearToken, getMe, getToken, type AdminMe } from '../services/adminApi';

export function useAdminAuth() {
  const [me, setMe] = useState<AdminMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setMe(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const value = await getMe();
      setMe(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    clearToken();
    setMe(null);
  }, []);

  return { me, loading, error, refresh, logout, isAuthenticated: me !== null };
}
