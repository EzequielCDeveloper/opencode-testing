'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Plus, DollarSign, Download } from 'lucide-react';
import { paymentsApi } from '@/lib/api';
import { formatDateTime, formatCurrency, PAYMENT_METHOD_LABELS } from '@/lib/utils';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function PaymentsPage() {
  const router = useRouter();
  const { hasRole } = useAuth();

  const [page, setPage] = useState(1);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['payments', page, from, to],
    queryFn: () =>
      paymentsApi.list({
        page,
        limit: 20,
        from: from || undefined,
        to: to || undefined,
      }),
  });

  const downloadMutation = useMutation({
    mutationFn: (paymentId: string) => paymentsApi.downloadReceipt(paymentId),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
    onError: () => setError('No se pudo descargar el recibo.'),
  });

  const payments = data?.data?.items ?? [];
  const pagination = data?.data;

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <Topbar title="Pagos" />
      <div className="p-6 space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-3">
            <Input
              label="Desde"
              type="date"
              value={from}
              onChange={(e) => { setFrom(e.target.value); setPage(1); }}
            />
            <Input
              label="Hasta"
              type="date"
              value={to}
              onChange={(e) => { setTo(e.target.value); setPage(1); }}
            />
            {(from || to) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setFrom(''); setTo(''); setPage(1); }}
              >
                Limpiar
              </Button>
            )}
          </div>

          {hasRole('admin', 'billing') && (
            <Button onClick={() => router.push('/payments/new')}>
              <Plus className="h-4 w-4" />
              Registrar pago
            </Button>
          )}
        </div>

        <Card>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Fecha</TableHeader>
                <TableHeader>Cliente</TableHeader>
                <TableHeader>Monto</TableHeader>
                <TableHeader>Método</TableHeader>
                <TableHeader>Referencia</TableHeader>
                <TableHeader>Recibo</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={DollarSign}
                      title="Sin pagos"
                      description="No hay pagos en el período seleccionado."
                      action={
                        hasRole('admin', 'billing') ? (
                          <Button onClick={() => router.push('/payments/new')}>
                            <Plus className="h-4 w-4" />
                            Registrar pago
                          </Button>
                        ) : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{formatDateTime(p.paidAt)}</TableCell>
                    <TableCell>
                      <Link
                        href={`/clients/${p.clientId}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {p.clientId}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(p.amount)}</TableCell>
                    <TableCell>{PAYMENT_METHOD_LABELS[p.method] ?? p.method}</TableCell>
                    <TableCell className="text-gray-500">{p.reference || '—'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadMutation.mutate(p.id)}
                        isLoading={downloadMutation.isPending}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
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
    </div>
  );
}
