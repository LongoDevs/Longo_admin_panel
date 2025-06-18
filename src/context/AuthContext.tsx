import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'Admin' | 'Support';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, otp: string) => Promise<void>;
  logout: () => void;
  requestOtp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const isAuthenticated = !!user;

  const requestOtp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock credential verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, verify credentials first
      if (password !== 'admin123') {
        throw new Error('Invalid credentials');
      }
      
      console.log(`OTP requested for ${email}`);
    } catch (error) {
      console.error('Failed to request OTP:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, otp: string) => {
    setIsLoading(true);
    try {
      // Mock API call to verify credentials and OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock OTP verification (in real app, verify with backend)
      if (otp !== '123456') {
        throw new Error('Invalid OTP');
      }
      
      // Mock user data based on email
      let role: 'SuperAdmin' | 'Admin' | 'Support' = 'Admin';
      
      if (email.includes('super')) {
        role = 'SuperAdmin';
      } else if (email.includes('support')) {
        role = 'Support';
      }
      
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout,
      requestOtp
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