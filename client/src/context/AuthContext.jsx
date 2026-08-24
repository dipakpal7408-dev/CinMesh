import { createContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../services/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("cinmesh_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("cinmesh_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authApi.me();
        setUser(data);
        localStorage.setItem("cinmesh_user", JSON.stringify(data));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem("cinmesh_token", res.token);
    localStorage.setItem("cinmesh_user", JSON.stringify(res.data));
    setToken(res.token);
    setUser(res.data);
    return res.data;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await authApi.register(payload);
    localStorage.setItem("cinmesh_token", res.token);
    localStorage.setItem("cinmesh_user", JSON.stringify(res.data));
    setToken(res.token);
    setUser(res.data);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    localStorage.removeItem("cinmesh_token");
    localStorage.removeItem("cinmesh_user");
    setToken(null);
    setUser(null);
  }, []);

  const updateCachedUser = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("cinmesh_user", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, updateCachedUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
