import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [toast, setToast] = useState(null);

  const saveSession = useCallback((data) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);
  }, []);

  const login = useCallback(async (payload) => {
    const res = await api.post("/auth/login", payload);
    saveSession(res.data.data);
    setToast({ type: "success", text: "Вход выполнен" });
  }, [saveSession]);

  const register = useCallback(async (payload) => {
    const res = await api.post("/auth/register", payload);
    saveSession(res.data.data);
    setToast({ type: "success", text: "Пользователь создан" });
  }, [saveSession]);

  const logout = useCallback(async () => {
    await api.post("/auth/logout").catch(() => null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, register, logout, toast, setToast }),
    [user, token, login, register, logout, toast]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
