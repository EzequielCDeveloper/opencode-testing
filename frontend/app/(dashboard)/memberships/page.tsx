'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Plus, CreditCard } from 'lucide-react';
import { membershipsApi } from '@/lib/api';
import { MembershipStatus } from '@/types';
import { formatDate, formatCurrency, PRICE_TYPE_LABELS } from '@/lib/utils';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { MembershipStatusBadge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'active', label: 'Activas' },
  { value: 'expired', label: 'Vencidas' },
  { value: 'cancelled', label: 'Canceladas' },
];

export default function MembershipsPage() {
  const router = useRouter();
  const { hasRole } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<MembershipStatus | ''>('');
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['memberships', page, statusFilter],
    queryFn: () =>
      membershipsApi.list({
        page,
        limit: 20,
        status: statusFilter || undefined,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MembershipStatus }) =>
      membershipsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
    },
    onError: () => setError('No se pudo actualizar el estado.'),
  });

  const memberships = data?.data?.items ?? [];
  const pagination = data?.data;

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <Topbar title="Membresías" />
      <div className="p-6 space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-48">
            <Select
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as MembershipStatus | '');
                setPage(1);
              }}
            />
          </div>

          {hasRole('admin', 'staff') && (
            <Button onClick={() => router.push('/memberships/new')}>
              <Plus className="h-4 w-4" />
              Asignar membresía
            </Button>
          )}
        </div>

        <Card>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Cliente</TableHeader>
                <TableHeader>Plan</TableHeader>
                <TableHeader>Tipo precio</TableHeader>
                <TableHeader>Inicio</TableHeader>
                <TableHeader>Vencimiento</TableHeader>
                <TableHeader>Precio</TableHeader>
                <TableHeader>Estado</TableHeader>
                {hasRole('admin', 'staff') && <TableHeader>Acciones</TableHeader>}
              </tr>
            </TableHead>
            <TableBody>
              {memberships.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon={CreditCard}
                      title="Sin membresías"
                      description="No hay membresías con los filtros seleccionados."
                      action={
                        hasRole('admin', 'staff') ? (
                          <Button onClick={() => router.push('/memberships/new')}>
                            <Plus className="h-4 w-4" />
                            Asignar membresía
                          </Button>
                        ) : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                memberships.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <Link
                        href={`/clients/${m.clientId}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {m.clientId}
                      </Link>
                    </TableCell>
                    <TableCell>{m.planName}</TableCell>
                    <TableCell>{PRICE_TYPE_LABELS[m.priceType]}</TableCell>
                    <TableCell>{formatDate(m.startDate)}</TableCell>
                    <TableCell>{formatDate(m.endDate)}</TableCell>
                    <TableCell>{formatCurrency(m.price)}</TableCell>
                    <TableCell>
                      <MembershipStatusBadge status={m.status} />
                    </TableCell>
                    {hasRole('admin', 'staff') && (
                      <TableCell>
                        {m.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() =>
                              updateStatusMutation.mutate({ id: m.id, status: 'cancelled' })
                            }
                            isLoading={updateStatusMutation.isPending}
                          >
                            Cancelar
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {pagination && pagination.totalPages > 1 && (
            <div className="px-4">
              <Pagination
                page={page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
