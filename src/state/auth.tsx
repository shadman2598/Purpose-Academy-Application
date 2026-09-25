import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  profile?: { jurisdiction: string; crewRole: string; displayName: string } | null;
}

const AuthContext = createContext<{
  user: SessionUser | null;
  ready: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  ready: false,
  refresh: async () => undefined,
  logout: async () => undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const refresh = async () => {
    try {
      const me = await api<SessionUser>("/api/auth/me");
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  };
  useEffect(() => {
    void refresh();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        refresh,
        logout: async () => {
          await api("/api/auth/logout", { method: "POST" });
          setUser(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
