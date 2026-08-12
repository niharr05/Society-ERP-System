import { create } from 'zustand';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../config/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: MOCK_USERS[0],
  isAuthenticated: true,
  isLoading: false,

  login: async (emailOrPhone: string, targetRole?: UserRole) => {
    set({ isLoading: true });
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 800);
    });

    const matchedUser = MOCK_USERS.find(
      (u) =>
        (u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone) &&
        (!targetRole || u.role === targetRole)
    ) || {
      uid: `usr_${Date.now()}`,
      name: emailOrPhone.split('@')[0] || 'Demo User',
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@society.com`,
      phone: emailOrPhone.startsWith('+') ? emailOrPhone : '+91 9999999999',
      role: targetRole || 'RESIDENT',
      societyId: 'soc_1',
      unitNumber: 'A-101',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set({ user: matchedUser, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));
