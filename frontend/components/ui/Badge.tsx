import { cn } from '@/lib/utils';
import { MembershipStatus, UserRole } from '@/types';

type BadgeVariant = 'green' | 'red' | 'yellow' | 'gray' | 'blue' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function MembershipStatusBadge({ status }: { status: MembershipStatus }) {
  const map: Record<MembershipStatus, { label: string; variant: BadgeVariant }> = {
    active: { label: 'Activa', variant: 'green' },
    expired: { label: 'Vencida', variant: 'red' },
    cancelled: { label: 'Cancelada', variant: 'gray' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ClientStatusBadge({ active }: { active: boolean }) {
  return active ? (
    <Badge variant="green">Activo</Badge>
  ) : (
    <Badge variant="gray">Inactivo</Badge>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const map: Record<UserRole, { label: string; variant: BadgeVariant }> = {
    admin: { label: 'Admin', variant: 'purple' },
    staff: { label: 'Personal', variant: 'blue' },
    billing: { label: 'Facturación', variant: 'yellow' },
  };
  const { label, variant } = map[role];
  return <Badge variant={variant}>{label}</Badge>;
}
