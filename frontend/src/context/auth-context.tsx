"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '@/lib/api';
import { User, UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const creds = localStorage.getItem('communibid_creds');
      if (creds) {
        try {
          const response = await apiFetch('/users/me');
          if (response.ok) {
            const userData = await response.json();
            // Normalize role by stripping ROLE_ prefix if present
            if (userData.role && userData.role.startsWith('ROLE_')) {
              userData.role = userData.role.replace('ROLE_', '');
            }
            setUser(userData);
          } else {
            localStorage.removeItem('communibid_creds');
          }
        } catch (error) {
          console.error('Failed to load user', error);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    const creds = btoa(`${username}:${password}`);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/users/me`, {
      headers: {
        'Authorization': `Basic ${creds}`
      }
    });

    if (response.ok) {
      const userData = await response.json();
      // Normalize role by stripping ROLE_ prefix if present
      if (userData.role && userData.role.startsWith('ROLE_')) {
        userData.role = userData.role.replace('ROLE_', '');
      }
      localStorage.setItem('communibid_creds', creds);
      setUser(userData);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('communibid_creds');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
