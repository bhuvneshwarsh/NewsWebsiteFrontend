import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AuthUser {
  token:              string;
  fullName:           string;
  email:              string;
  role:               string;
  expiry:             string;
  // Employee-specific (only set when role === 'Employee')
  employeeId?:        string;
  designation?:       string;
  imageUrl?:          string;
  mustChangePassword?: boolean;
}

interface AuthContextValue {
  user:       AuthUser | null;
  login:      (user: AuthUser) => void;
  logout:     () => void;
  isAdmin:    boolean;
  isEmployee: boolean;
  isSuperAdmin: boolean;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'cloudnews_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  // Auto-logout when token expires
  useEffect(() => {
    if (!user) return;
    const ms = new Date(user.expiry).getTime() - Date.now();
    if (ms <= 0) { logout(); return; }
    const t = setTimeout(logout, ms);
    return () => clearTimeout(t);
  }, [user]);

  const login = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (partial: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...partial };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const isSuperAdmin = user?.role === 'SuperAdmin';
  const isAdmin      = isSuperAdmin || user?.role === 'Admin';
  const isEmployee   = user?.role === 'Employee';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isEmployee, isSuperAdmin, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
