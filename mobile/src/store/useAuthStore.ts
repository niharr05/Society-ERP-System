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
  switchSociety: (societyId: string, societyName: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    ...MOCK_USERS[1],
    societyName: 'Royal Heights Co-op Society',
  },
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
    );

    const userObj: User = matchedUser
      ? { ...matchedUser }
      : {
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

    if (!userObj.societyName) {
      userObj.societyName = userObj.societyId === 'platform'
        ? 'Royal Heights Co-op Society'
        : userObj.societyId === 'soc_2' || userObj.societyId === '2'
        ? 'Palm Grove Residency'
        : userObj.societyId === 'soc_3' || userObj.societyId === '3'
        ? 'Greenfield Towers'
        : 'Royal Heights Co-op Society';
    }

    set({ user: userObj, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  switchSociety: (societyId, societyName) => {
    set((state) => {
      if (state.user) {
        return {
          user: {
            ...state.user,
            societyId,
            societyName,
          },
        };
      }
      return {};
    });
  },
}));
