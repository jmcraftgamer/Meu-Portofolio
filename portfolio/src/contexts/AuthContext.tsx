import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }

    var cancelled = false;

    function tryLoad(retries: number) {
      if (cancelled) return;
      api.getMe()
        .then((data: any) => {
          if (cancelled) return;
          const u = data.user || data;
          if (u && u.id) {
            setUser({ id: u.id, name: u.name, email: u.email, isAdmin: !!u.isAdmin });
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
          setLoading(false);
        })
        .catch((err) => {
          if (cancelled) return;
          // Token inválido/expirado → limpa
          if (err.message === 'Token required' || err.message === 'jwt malformed' || err.message === 'jwt expired') {
            localStorage.removeItem('token');
            setToken(null);
            setLoading(false);
            return;
          }
          // Erro transitório (cold start, rede) → tenta de novo
          if (retries > 0) {
            setTimeout(function() { tryLoad(retries - 1); }, 1500);
          } else {
            setUser(null);
            setLoading(false);
          }
        });
    }

    tryLoad(3);

    return function() { cancelled = true; };
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
