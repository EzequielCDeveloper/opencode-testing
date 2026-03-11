'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  BarChart3,
  Settings,
  Dumbbell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'staff'],
  },
  {
    href: '/clients',
    label: 'Clientes',
    icon: Users,
    roles: ['admin', 'staff', 'billing'],
  },
  {
    href: '/memberships',
    label: 'Membresías',
    icon: CreditCard,
    roles: ['admin', 'staff', 'billing'],
  },
  {
    href: '/payments',
    label: 'Pagos',
    icon: DollarSign,
    roles: ['admin', 'staff', 'billing'],
  },
  {
    href: '/reports',
    label: 'Reportes',
    icon: BarChart3,
    roles: ['admin', 'staff', 'billing'],
  },
  {
    href: '/admin',
    label: 'Administración',
    icon: Settings,
    roles: ['admin'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-gray-700 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <Dumbbell className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Chapitos</p>
          <p className="text-xs text-gray-400">Gym Management</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      {user && (
        <div className="border-t border-gray-700 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
