// Auth store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, clearTokens, getAccessToken } from './api';

// Demo mode — when true, login bypasses the real backend
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const DEMO_USER = {
    id: 'demo-001',
    email: 'hr@acmecorp.com',
    first_name: 'Sarah',
    last_name: '',
    role: 'hr' as const,
    tenant_id: 'demo-tenant',
};

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'hr' | 'employee';
    tenant_id: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: true,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true });

                // Demo mode: accept any credentials and use the mock user
                if (DEMO_MODE) {
                    set({ user: DEMO_USER, isAuthenticated: true, isLoading: false });
                    return;
                }

                try {
                    await authApi.login(email, password);
                    const user = await authApi.me();
                    set({ user: user as User, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: async () => {
                if (DEMO_MODE) {
                    set({ user: null, isAuthenticated: false });
                    return;
                }

                try {
                    await authApi.logout();
                } finally {
                    clearTokens();
                    set({ user: null, isAuthenticated: false });
                }
            },

            checkAuth: async () => {
                // Demo mode: always use latest DEMO_USER
                if (DEMO_MODE) {
                    set({ user: DEMO_USER, isAuthenticated: true, isLoading: false });
                    return;
                }

                if (!getAccessToken()) {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                    return;
                }

                try {
                    const user = await authApi.me();
                    set({ user: user as User, isAuthenticated: true, isLoading: false });
                } catch {
                    clearTokens();
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
