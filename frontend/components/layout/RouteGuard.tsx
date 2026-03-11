'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { PageLoader } from '@/components/ui/LoadingSpinner';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
        return;
      }
      if (allowedRoles && !hasRole(...allowedRoles)) {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, allowedRoles, hasRole, router]);

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return null;
  if (allowedRoles && !hasRole(...allowedRoles)) return null;

  return <>{children}</>;
}
