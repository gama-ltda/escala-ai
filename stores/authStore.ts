import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types';
import { 
  createUser, 
  signInUser, 
  signOutUser, 
  onAuthStateChange,
  updateUserProfile 
} from '@/services/auth';
import { RegisterFormData, LoginFormData } from '@/lib/validations';

interface AuthStore extends AuthState {
  // Estado
  initialized: boolean;
  
  // Ações
  initialize: () => void;
  signIn: (data: LoginFormData) => Promise<void>;
  signUp: (data: RegisterFormData) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'phone'>>) => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      loading: false,
      initialized: false,

      // Inicializar observador de autenticação
      initialize: () => {
        if (get().initialized) return;
        
        set({ initialized: true, loading: true });
        
        // Observar mudanças no estado de autenticação
        onAuthStateChange((user) => {
          set({ user, loading: false });
        });
      },

      // Fazer login
      signIn: async (data: LoginFormData) => {
        try {
          set({ loading: true });
          const user = await signInUser(data);
          set({ user, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // Fazer cadastro
      signUp: async (data: RegisterFormData) => {
        try {
          set({ loading: true });
          const user = await createUser(data);
          set({ user, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // Fazer logout
      signOut: async () => {
        try {
          set({ loading: true });
          await signOutUser();
          set({ user: null, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // Atualizar dados do usuário no estado
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { 
              ...currentUser, 
              ...userData,
              updatedAt: new Date()
            } 
          });
        }
      },

      // Atualizar perfil do usuário
      updateProfile: async (updates: Partial<Pick<User, 'name' | 'phone'>>) => {
        const currentUser = get().user;
        if (!currentUser) throw new Error('Usuário não encontrado');

        try {
          set({ loading: true });
          await updateUserProfile(currentUser.id, updates);
          
          // Atualizar estado local
          get().updateUser(updates);
          set({ loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // Definir usuário diretamente (usado pelo observador)
      setUser: (user: User | null) => {
        set({ user });
      },

      // Definir estado de loading
      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: 'auth-storage',
      // Persistir apenas dados essenciais
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

// Hook para verificar se usuário está autenticado
export const useAuth = () => {
  const { user, loading, initialized } = useAuthStore();
  return {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'master_admin',
    isMasterAdmin: user?.role === 'master_admin',
    isPlayer: user?.role === 'player',
  };
};

// Hook para ações de autenticação
export const useAuthActions = () => {
  const { 
    initialize,
    signIn, 
    signUp, 
    signOut, 
    updateProfile 
  } = useAuthStore();
  
  return {
    initialize,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
};