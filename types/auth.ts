export type UserRole = 'seller' | 'manufacturer' | 'logistics';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  profilePicture: string;
  company?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  loginWithGoogle: (role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
