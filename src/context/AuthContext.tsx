import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'approved_friend' | 'pending' | null;

interface User {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthContextProps {
  user: User | null;
  role: UserRole;
  loading: boolean;
  token: string | null;
  register: (email: string, password: string) => Promise<{ token: string; user: User }>;
  login: (email: string, password: string) => Promise<{ token: string; user: User }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Initialize from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          // Verify token by fetching current user
          const resp = await fetch(`${apiUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          if (resp.ok) {
            const { user: fetchedUser } = await resp.json();
            setUser(fetchedUser);
            setRole(fetchedUser.role);
          } else {
            // Token invalid, clear it
            localStorage.removeItem('token');
            setToken(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [apiUrl]);

  const register = async (email: string, password: string) => {
    try {
      const resp = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!resp.ok) {
        const { error } = await resp.json();
        throw new Error(error || 'Registration failed');
      }

      const { token: newToken, user: newUser } = await resp.json();
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      setRole(newUser.role);

      return { token: newToken, user: newUser };
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const resp = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!resp.ok) {
        const { error } = await resp.json();
        throw new Error(error || 'Login failed');
      }

      const { token: newToken, user: newUser } = await resp.json();
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      setRole(newUser.role);

      return { token: newToken, user: newUser };
    } catch (err: any) {
      throw new Error(err.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
