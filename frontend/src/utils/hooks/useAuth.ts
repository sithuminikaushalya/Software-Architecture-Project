import { useMemo } from 'react';

export interface AuthUser {
  token: string | null;
  role: 'VENDOR' | 'EMPLOYEE' | 'ADMIN' | null;
  isAuthenticated: boolean;
}

export function useAuth(): AuthUser {
  return useMemo(() => {
    const token = sessionStorage.getItem('authToken');
    const role = sessionStorage.getItem('userRole') as 'VENDOR' | 'EMPLOYEE' | 'ADMIN' | null;
    
    return {
      token,
      role,
      isAuthenticated: !!token,
    };
  }, []);
}

export function useRoleAccess() {
  const { role, isAuthenticated } = useAuth();

  const hasAccess = (requiredRole: 'VENDOR' | 'EMPLOYEE' | 'ADMIN') => {
    return isAuthenticated && role === requiredRole;
  };

  return {
    hasAccess,
    role,
    isAuthenticated,
  };
}