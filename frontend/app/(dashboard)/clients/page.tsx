'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Plus, Search, UserX } from 'lucide-react';
import { clientsApi } from '@/lib/api';
import { formatDate, getFullName } from '@/lib/utils';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { ClientStatusBadge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { ConfirmModal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function ClientsPage() {
  const router = useRouter();
  const { hasRole } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['clients', page, search],
    queryFn: () => clientsApi.list({ page, limit: 20, search: search || undefined }),
  });

  const deactivateMutation = useMutation({
    mutationFn: (clientId: string) => clientsApi.deactivate(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDeactivatingId(null);
    },
    onError: () => {
      setError('No se pudo desactivar el cliente. Intenta nuevamente.');
      setDeactivatingId(null);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const clients = data?.data?.items ?? [];
  const pagination = data?.data;

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <Topbar title="Clientes" />
      <div className="p-6 space-y-4">
        {error && (
          <Alert variant="error" className="mb-2">
            {error}
          </Alert>
        )}

        {/* Header actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar por nombre, email..."
                className="w-72 rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">
              Buscar
            </Button>
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSearchInput('');
                  setPage(1);
                }}
              >
                Limpiar
              </Button>
            )}
          </form>

          {hasRole('admin', 'staff') && (
            <Button onClick={() => router.push('/clients/new')}>
              <Plus className="h-4 w-4" />
              Nuevo cliente
            </Button>
          )}
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Cliente</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Teléfono</TableHeader>
                <TableHeader>Registro</TableHeader>
                <TableHeader>Estado</TableHeader>
                <TableHeader>Acciones</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={UserX}
                      title="Sin clientes"
                      description={
                        search
                          ? `No se encontraron clientes para "${search}"`
                          : 'Aún no hay clientes registrados.'
                      }
                      action={
                        hasRole('admin', 'staff') ? (
                          <Button onClick={() => router.push('/clients/new')}>
                            <Plus className="h-4 w-4" />
                            Registrar primer cliente
                          </Button>
                        ) : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Link
                        href={`/clients/${client.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {getFullName(client.firstName, client.lastName)}
                      </Link>
                    </TableCell>
                    <TableCell className="text-gray-500">{client.email}</TableCell>
                    <TableCell className="text-gray-500">{client.phone}</TableCell>
                    <TableCell className="text-gray-500">
                      {formatDate(client.createdAt)}
                    </TableCell>
                    <TableCell>
                      <ClientStatusBadge active={client.active} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/clients/${client.id}`}>
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </Link>
                        {hasRole('admin', 'staff') && (
                          <Link href={`/clients/${client.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              Editar
                            </Button>
                          </Link>
                        )}
                        {hasRole('admin', 'staff') && client.active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeactivatingId(client.id)}
                          >
                            Desactivar
                          </Button>
                        )}
                      </div>
                    </TableCell>
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

      <ConfirmModal
        isOpen={!!deactivatingId}
        onClose={() => setDeactivatingId(null)}
        onConfirm={() => deactivatingId && deactivateMutation.mutate(deactivatingId)}
        title="Desactivar cliente"
        message="¿Estás seguro de que quieres desactivar este cliente? Podrás reactivarlo después."
        confirmLabel="Desactivar"
        danger
        isLoading={deactivateMutation.isPending}
      />
    </div>
  );
}
