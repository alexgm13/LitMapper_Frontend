import { create } from 'zustand';
import { LoginResponseData } from '../features/Auth/types';

interface AuthState {
  user: LoginResponseData | null;
  isAuthenticated: boolean;
  setUser: (user: LoginResponseData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
