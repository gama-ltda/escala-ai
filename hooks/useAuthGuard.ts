import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useAuthActions } from '@/stores/authStore';
import { UserRole } from '@/types';

interface UseAuthGuardOptions {
  // Roles permitidas para acessar a rota
  allowedRoles?: UserRole[];
  // Redirecionar para esta rota se não autorizado
  redirectTo?: string;
  // Se deve aguardar a inicialização do auth
  requireAuth?: boolean;
}

/**
 * Hook para proteger rotas baseado em autenticação e roles
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const {
    allowedRoles,
    redirectTo = '/auth',
    requireAuth = true,
  } = options;

  const router = useRouter();
  const { user, isAuthenticated, initialized, loading } = useAuth();
  const { initialize } = useAuthActions();

  useEffect(() => {
    // Inicializar observador de auth se ainda não foi inicializado
    if (!initialized) {
      initialize();
      return;
    }

    // Aguardar inicialização completa
    if (loading) {
      return;
    }

    // Se requer autenticação mas usuário não está logado
    if (requireAuth && !isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    // Se tem roles específicas, verificar se usuário tem permissão
    if (allowedRoles && allowedRoles.length > 0 && user) {
      const hasPermission = allowedRoles.includes(user.role) || user.role === 'master_admin';
      
      if (!hasPermission) {
        // Redirecionar baseado na role do usuário
        const userRedirect = getUserRedirect(user.role);
        router.replace(userRedirect);
        return;
      }
    }
  }, [
    initialized,
    loading,
    isAuthenticated,
    user,
    allowedRoles,
    redirectTo,
    requireAuth,
    router,
    initialize,
  ]);

  return {
    user,
    isAuthenticated,
    initialized,
    loading: loading || !initialized,
    hasAccess: initialized && (!requireAuth || isAuthenticated) && 
              (!allowedRoles || !user || allowedRoles.includes(user.role) || user.role === 'master_admin'),
  };
}

/**
 * Determina para onde redirecionar baseado na role do usuário
 */
function getUserRedirect(role: UserRole): string {
  switch (role) {
    case 'master_admin':
    case 'admin':
      return '/dashboard/admin';
    case 'player':
      return '/dashboard/player';
    default:
      return '/auth';
  }
}

/**
 * Hook para rotas que requerem admin
 */
export function useAdminGuard() {
  return useAuthGuard({
    allowedRoles: ['admin', 'master_admin'],
    redirectTo: '/dashboard',
  });
}

/**
 * Hook para rotas que requerem master admin
 */
export function useMasterAdminGuard() {
  return useAuthGuard({
    allowedRoles: ['master_admin'],
    redirectTo: '/dashboard',
  });
}

/**
 * Hook para rotas que requerem player
 */
export function usePlayerGuard() {
  return useAuthGuard({
    allowedRoles: ['player'],
    redirectTo: '/dashboard',
  });
}

/**
 * Hook para rotas públicas (não requer autenticação)
 */
export function usePublicRoute() {
  return useAuthGuard({
    requireAuth: false,
  });
}

/**
 * Hook para redirecionar usuários autenticados
 * Útil para páginas como login/registro
 */
export function useGuestGuard() {
  const router = useRouter();
  const { isAuthenticated, initialized, user } = useAuth();
  const { initialize } = useAuthActions();

  useEffect(() => {
    if (!initialized) {
      initialize();
      return;
    }

    if (isAuthenticated && user) {
      const redirect = getUserRedirect(user.role);
      router.replace(redirect);
    }
  }, [isAuthenticated, initialized, user, router, initialize]);

  return {
    initialized,
    isAuthenticated,
    shouldRender: initialized && !isAuthenticated,
  };
}