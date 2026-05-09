import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../api/authApi";

const AuthContext = createContext(null);

function getStoredUser() {
  const storedUser = localStorage.getItem("evalflow_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("evalflow_user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("evalflow_token"));
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const isAuthenticated = Boolean(user && token);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        setUser(data.user);
        localStorage.setItem("evalflow_user", JSON.stringify(data.user));
      } catch {
        localStorage.removeItem("evalflow_token");
        localStorage.removeItem("evalflow_user");
        setToken(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    loadUser();
  }, [token]);

  async function login(payload) {
    const data = await loginUser(payload);

    localStorage.setItem("evalflow_token", data.token);
    localStorage.setItem("evalflow_user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data.user;
  }

  async function register(payload) {
    const data = await registerUser(payload);

    localStorage.setItem("evalflow_token", data.token);
    localStorage.setItem("evalflow_user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data.user;
  }

  function logout() {
    localStorage.removeItem("evalflow_token");
    localStorage.removeItem("evalflow_user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isAuthLoading,
      login,
      register,
      logout,
    }),
    [user, token, isAuthenticated, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
