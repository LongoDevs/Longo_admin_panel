import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'Admin' | 'Support';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, otp: string, secretKey?: string, onSuccess?: () => void) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}
const API_URL = import.meta.env.VITE_API_URL;
//const API_URL = "https://africa-south1-longo-79a99.cloudfunctions.net/api/api/admin";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Restore user and token from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('longo_user');
    const storedToken = sessionStorage.getItem('longo_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const isAuthenticated = !!user && !!token;

  // Login with credentials and 2FA
  const login = async (email: string, password: string, otp: string, secretKey?: string, onSuccess?: () => void) => {
    setIsLoading(true);
    try {
      // Step 1: Login with credentials
      const loginRes = await axios.post(`${API_URL}/admin-login`, { email, password });
      const twoFAEnabled = loginRes.data.details?.two_fa_enabled;
      let finalToken = null;
      let userData = null;
      if (twoFAEnabled) {
        // Step 2: Verify 2FA
        const verifyRes = await axios.post(`${API_URL}/verify-otp`, { email , token: otp});
        if (!verifyRes.data.success) {
          throw new Error('Invalid 2FA code');
        }
        finalToken = verifyRes.data.token;
        userData = verifyRes.data.user;
      } else {
        // If 2FA not enabled, trigger setup (handled in UI, not here)
        throw new Error('2FA setup required.');
      }
      if (!finalToken || !userData) {
        throw new Error('Login failed: missing token or user data');
      }
      setUser(userData);
      setToken(finalToken);
      sessionStorage.setItem('longo_user', JSON.stringify(userData));
      sessionStorage.setItem('longo_token', finalToken);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('longo_user');
    sessionStorage.removeItem('longo_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
      setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}