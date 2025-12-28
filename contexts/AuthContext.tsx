import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User, UserRole } from '@/types/auth';
import { dummyUsers, DEMO_PASSWORD } from '@/utils/dummyData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@battery_supply_chain:auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user with matching username and role
    const foundUser = dummyUsers.find(
      u => u.username === username && u.role === role
    );

    // For demo purposes, accept any password that matches DEMO_PASSWORD
    if (foundUser && password === DEMO_PASSWORD) {
      await saveUser(foundUser);
      return true;
    }

    return false;
  };

  const loginWithGoogle = async (role: UserRole): Promise<boolean> => {
    // Simulate Google OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo, just log in the default user for that role
    const foundUser = dummyUsers.find(u => u.role === role);

    if (foundUser) {
      const googleUser = {
        ...foundUser,
        email: `${role}@gmail.com`,
      };
      await saveUser(googleUser);
      return true;
    }

    return false;
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        logout,
        isLoading,
      }}
    >
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
