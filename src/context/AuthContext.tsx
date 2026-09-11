"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  phone?: string;
  role: "customer" | "provider" | "admin";
}

interface AuthContextType {
  user: CurrentUser | null;
  login: (userData: CurrentUser) => void;
  logout: () => void;
  updateUserRole: (role: "customer" | "provider" | "admin") => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUserRole: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("glamourly_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: CurrentUser) => {
    setUser(userData);
    localStorage.setItem("glamourly_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("glamourly_user");
  };

  const updateUserRole = (role: "customer" | "provider" | "admin") => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem("glamourly_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
