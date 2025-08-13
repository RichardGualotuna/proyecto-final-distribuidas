import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User, token: string) => {
        console.log('Login exitoso:', { user, token: token.substring(0, 20) + '...' });
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        console.log('Logout ejecutado');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        // Limpiar también el localStorage directamente
        localStorage.removeItem('auth-storage');
      },
      updateUser: (user: User) =>
        set((state) => ({
          ...state,
          user,
        })),
      getToken: () => {
        const state = get();
        return state.token;
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Verificar si el usuario está autenticado al recargar
        if (state?.token && state?.user) {
          console.log('Estado restaurado desde localStorage:', {
            user: state.user.email,
            hasToken: !!state.token
          });
        }
      },
    }
  )
);