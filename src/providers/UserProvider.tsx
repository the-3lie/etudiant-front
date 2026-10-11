"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { studentService } from "@/services/student.service";
import { setBackendAuthToken } from "@/services/api";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/auth-storage";
import type { ExistingPlatformUser } from "@/types";

interface UserContextValue {
  user: ExistingPlatformUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExistingPlatformUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Au chargement : si un jeton est déjà stocké, on tente de récupérer le
  // profil pour restaurer la session sans repasser par le formulaire.
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setBackendAuthToken(token);
    studentService
      .getMe()
      .then((u) => setUser(u))
      .catch(() => {
        clearStoredToken();
        setBackendAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const { accessToken } = await authService.login(email, password);
    setStoredToken(accessToken);
    setBackendAuthToken(accessToken);
    const profil = await studentService.getMe();
    setUser(profil);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setBackendAuthToken(null);
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useExistingUser() {
  return useContext(UserContext);
}

/**
 * Redirige vers /connexion tant que l'utilisateur n'est pas authentifié.
 * À utiliser dans le layout du groupe de pages protégées.
 */
export function useRequireAuth() {
  const { user, loading } = useExistingUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/connexion");
    }
  }, [loading, user, router]);
}
