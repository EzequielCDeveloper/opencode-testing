'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Users,
  CreditCard,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Topbar } from '@/components/layout/Topbar';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { MembershipStatusBadge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => dashboardApi.metrics(),
    refetchInterval: 60000,
  });

  const metrics = data?.data;

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <Topbar title="Dashboard" />
      <div className="p-6 space-y-6">
        {error && (
          <Alert variant="error">
            No se pudieron cargar las métricas. Intenta recargar la página.
          </Alert>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Membresías Activas"
            value={metrics?.activeMemberships ?? '—'}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            color="blue"
          />
          <KpiCard
            title="Vencen en 7 días"
            value={metrics?.expiringIn7Days ?? '—'}
            icon={<AlertTriangle className="h-6 w-6 text-yellow-600" />}
            color="yellow"
            alert={Number(metrics?.expiringIn7Days) > 0}
          />
          <KpiCard
            title="Ingresos Hoy"
            value={metrics ? formatCurrency(metrics.revenueToday) : '—'}
            icon={<DollarSign className="h-6 w-6 text-green-600" />}
            color="green"
          />
          <KpiCard
            title="Ingresos del Mes"
            value={metrics ? formatCurrency(metrics.revenueThisMonth) : '—'}
            icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
            color="purple"
          />
        </div>

        {/* Upcoming expirations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Próximas Expiraciones</CardTitle>
              <Link
                href="/reports"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Ver reportes
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!metrics?.upcomingExpirations?.length ? (
              <div className="flex items-center gap-3 px-6 py-8 text-gray-500">
                <Calendar className="h-5 w-5" />
                <p className="text-sm">No hay membresías próximas a vencer.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {metrics.upcomingExpirations.map((exp) => (
                  <div
                    key={exp.membershipId}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <div>
                      <Link
                        href={`/clients/${exp.clientId}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {exp.clientName}
                      </Link>
                      <p className="text-xs text-gray-500">
                        Vence: {formatDate(exp.endDate)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        exp.daysLeft <= 3
                          ? 'bg-red-100 text-red-700'
                          : exp.daysLeft <= 7
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {exp.daysLeft === 0
                        ? 'Hoy'
                        : exp.daysLeft === 1
                        ? 'Mañana'
                        : `En ${exp.daysLeft} días`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickAction
            href="/clients/new"
            label="Registrar cliente"
            icon={<Users className="h-5 w-5" />}
          />
          <QuickAction
            href="/memberships"
            label="Asignar membresía"
            icon={<CreditCard className="h-5 w-5" />}
          />
          <QuickAction
            href="/payments"
            label="Registrar pago"
            icon={<DollarSign className="h-5 w-5" />}
          />
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon,
  color,
  alert,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  alert?: boolean;
}) {
  const bg: Record<string, string> = {
    blue: 'bg-blue-50',
    yellow: 'bg-yellow-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
  };

  return (
    <Card className={alert ? 'ring-2 ring-yellow-400' : ''}>
      <CardContent className="flex items-center gap-4 py-5">
        <div className={`rounded-xl p-3 ${bg[color] || 'bg-gray-50'}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-3 py-4">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">{icon}</div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
