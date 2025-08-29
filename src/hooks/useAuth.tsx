
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { safePost } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error: any; }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('medconsult_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await safePost('/login', { email, password });
      if (error) {
        return { success: false, error };
      }
      // يفترض أن الـ API يرجع توكن وبيانات المستخدم
      // عدل حسب استجابة الـ API الفعلية
      const userData = {
        id: (data as any)?.user?.id || '',
        email: (data as any)?.user?.email || email,
        name: (data as any)?.user?.name || '',
        token: (data as any)?.token?.token || '',
      };
      setUser(userData);
      localStorage.setItem('medconsult_user', JSON.stringify(userData));
      localStorage.setItem('medconsult_token', userData.token);
      navigate('/');
      return { success: true, error: null };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medconsult_user');
    navigate('/login');
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
