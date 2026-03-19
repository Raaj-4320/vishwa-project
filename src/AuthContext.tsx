import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from './types';

// Mock User type to replace firebase/auth User
interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
  login: (email: string, profile: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthReady: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(true);

  const login = (email: string, userProfile: UserProfile) => {
    setUser({
      uid: userProfile.uid,
      email: email,
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL || null,
    });
    setProfile(userProfile);
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
