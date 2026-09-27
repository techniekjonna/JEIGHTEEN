export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface AuthError {
  message: string;
  code?: string;
}