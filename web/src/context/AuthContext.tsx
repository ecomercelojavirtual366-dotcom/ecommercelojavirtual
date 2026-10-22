"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { isAdminEmail } from "@/lib/admin";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { readJson, writeJson } from "@/lib/localStore";
import type { AppUser } from "@/lib/types";

type LocalAccount = {
  uid: string;
  email: string;
  name: string;
  password: string;
};

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  usingFirebase: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = "em_session";
const USERS_KEY = "em_users";

function toAppUser(uid: string, email: string, name: string): AppUser {
  return {
    uid,
    email,
    name,
    isAdmin: isAdminEmail(email),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const usingFirebase = isFirebaseConfigured();

  useEffect(() => {
    if (usingFirebase) {
      const auth = getFirebaseAuth();
      if (!auth) {
        setLoading(false);
        return;
      }
      return onAuthStateChanged(auth, (firebaseUser) => {
        if (!firebaseUser?.email) {
          setUser(null);
        } else {
          setUser(
            toAppUser(
              firebaseUser.uid,
              firebaseUser.email,
              firebaseUser.displayName || firebaseUser.email.split("@")[0]
            )
          );
        }
        setLoading(false);
      });
    }

    const users = readJson<LocalAccount[]>(USERS_KEY, []);
    if (!users.some((item) => item.email === "ecomercelojavirtual366@gmail.com")) {
      users.push({
        uid: "local_admin",
        email: "ecomercelojavirtual366@gmail.com",
        name: "Administradora",
        password: "admin123",
      });
      writeJson(USERS_KEY, users);
    }

    const session = readJson<AppUser | null>(SESSION_KEY, null);
    setUser(session);
    setLoading(false);
  }, [usingFirebase]);

  const login = useCallback(
    async (email: string, password: string) => {
      const normalized = email.trim().toLowerCase();
      if (usingFirebase) {
        const auth = getFirebaseAuth();
        if (!auth) throw new Error("Firebase Auth indisponível.");
        await signInWithEmailAndPassword(auth, normalized, password);
        return;
      }

      const users = readJson<LocalAccount[]>(USERS_KEY, []);
      const found = users.find(
        (item) => item.email === normalized && item.password === password
      );
      if (!found) throw new Error("E-mail ou senha inválidos.");
      const next = toAppUser(found.uid, found.email, found.name);
      writeJson(SESSION_KEY, next);
      setUser(next);
    },
    [usingFirebase]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const normalized = email.trim().toLowerCase();
      if (password.length < 6) {
        throw new Error("A senha precisa ter pelo menos 6 caracteres.");
      }

      if (usingFirebase) {
        const auth = getFirebaseAuth();
        if (!auth) throw new Error("Firebase Auth indisponível.");
        const credential = await createUserWithEmailAndPassword(
          auth,
          normalized,
          password
        );
        await updateProfile(credential.user, { displayName: name.trim() });
        return;
      }

      const users = readJson<LocalAccount[]>(USERS_KEY, []);
      if (users.some((item) => item.email === normalized)) {
        throw new Error("Já existe uma conta com este e-mail.");
      }

      const account: LocalAccount = {
        uid: `local_${Date.now()}`,
        email: normalized,
        name: name.trim(),
        password,
      };
      users.push(account);
      writeJson(USERS_KEY, users);
      const next = toAppUser(account.uid, account.email, account.name);
      writeJson(SESSION_KEY, next);
      setUser(next);
    },
    [usingFirebase]
  );

  const logout = useCallback(async () => {
    if (usingFirebase) {
      const auth = getFirebaseAuth();
      if (auth) await signOut(auth);
      return;
    }
    writeJson(SESSION_KEY, null);
    setUser(null);
  }, [usingFirebase]);

  const value = useMemo(
    () => ({ user, loading, usingFirebase, login, register, logout }),
    [user, loading, usingFirebase, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
