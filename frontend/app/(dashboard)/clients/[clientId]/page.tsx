'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit, UserX, CreditCard, DollarSign } from 'lucide-react';
import { clientsApi, membershipsApi, paymentsApi } from '@/lib/api';
import { formatDate, formatDateTime, formatCurrency, getFullName, PAYMENT_METHOD_LABELS } from '@/lib/utils';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { ClientStatusBadge, MembershipStatusBadge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { ConfirmModal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { hasRole } = useAuth();
  const queryClient = useQueryClient();
  const clientId = params.clientId as string;

  const [showDeactivate, setShowDeactivate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: clientData, isLoading: loadingClient } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientsApi.get(clientId),
  });

  const { data: membershipsData } = useQuery({
    queryKey: ['memberships', { clientId }],
    queryFn: () => membershipsApi.list({ clientId, limit: 10 }),
  });

  const { data: paymentsData } = useQuery({
    queryKey: ['payments', { clientId }],
    queryFn: () => paymentsApi.list({ clientId, limit: 10 }),
  });

  const deactivateMutation = useMutation({
    mutationFn: () => clientsApi.deactivate(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowDeactivate(false);
    },
    onError: () => {
      setError('No se pudo desactivar el cliente.');
      setShowDeactivate(false);
    },
  });

  const downloadReceiptMutation = useMutation({
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

  if (loadingClient) return <PageLoader />;

  const client = clientData?.data;
  if (!client) return <div className="p-6 text-gray-500">Cliente no encontrado.</div>;

  const memberships = membershipsData?.data?.items ?? [];
  const payments = paymentsData?.data?.items ?? [];

  return (
    <div>
      <Topbar title="Detalle del cliente" />
      <div className="p-6 space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Client info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                  {client.firstName[0]}
                  {client.lastName[0]}
                </div>
                <div>
                  <CardTitle>{getFullName(client.firstName, client.lastName)}</CardTitle>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ClientStatusBadge active={client.active} />
                {hasRole('admin', 'staff') && (
                  <>
                    <Link href={`/clients/${clientId}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    {client.active && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setShowDeactivate(true)}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Desactivar
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
              <InfoField label="Teléfono" value={client.phone} />
              <InfoField label="Fecha de nacimiento" value={formatDate(client.birthDate)} />
              <InfoField label="Registro" value={formatDate(client.createdAt)} />
              <InfoField label="Actualización" value={formatDate(client.updatedAt)} />
            </div>
            <div className="mt-4">
              <InfoField label="Dirección" value={client.address} />
            </div>
          </CardContent>
        </Card>

        {/* Memberships */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Membresías</CardTitle>
              {hasRole('admin', 'staff') && (
                <Link href={`/memberships/new?clientId=${clientId}`}>
                  <Button size="sm">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Asignar membresía
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {memberships.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="Sin membresías"
                description="Este cliente no tiene membresías asignadas."
              />
            ) : (
              <Table>
                <TableHead>
                  <tr>
                    <TableHeader>Plan</TableHeader>
                    <TableHeader>Tipo</TableHeader>
                    <TableHeader>Inicio</TableHeader>
                    <TableHeader>Fin</TableHeader>
                    <TableHeader>Precio</TableHeader>
                    <TableHeader>Estado</TableHeader>
                  </tr>
                </TableHead>
                <TableBody>
                  {memberships.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.planName}</TableCell>
                      <TableCell className="capitalize">{m.priceType === 'student' ? 'Estudiante' : 'Estándar'}</TableCell>
                      <TableCell>{formatDate(m.startDate)}</TableCell>
                      <TableCell>{formatDate(m.endDate)}</TableCell>
                      <TableCell>{formatCurrency(m.price)}</TableCell>
                      <TableCell>
                        <MembershipStatusBadge status={m.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historial de pagos</CardTitle>
              {hasRole('admin', 'billing') && (
                <Link href={`/payments/new?clientId=${clientId}`}>
                  <Button size="sm">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Registrar pago
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {payments.length === 0 ? (
              <EmptyState
                icon={DollarSign}
                title="Sin pagos"
                description="No hay pagos registrados para este cliente."
              />
            ) : (
              <Table>
                <TableHead>
                  <tr>
                    <TableHeader>Fecha</TableHeader>
                    <TableHeader>Monto</TableHeader>
                    <TableHeader>Método</TableHeader>
                    <TableHeader>Referencia</TableHeader>
                    <TableHeader>Recibo</TableHeader>
                  </tr>
                </TableHead>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{formatDateTime(p.paidAt)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(p.amount)}</TableCell>
                      <TableCell>{PAYMENT_METHOD_LABELS[p.method] ?? p.method}</TableCell>
                      <TableCell className="text-gray-500">{p.reference || '—'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadReceiptMutation.mutate(p.id)}
                          isLoading={downloadReceiptMutation.isPending}
                        >
                          Descargar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmModal
        isOpen={showDeactivate}
        onClose={() => setShowDeactivate(false)}
        onConfirm={() => deactivateMutation.mutate()}
        title="Desactivar cliente"
        message={`¿Desactivar a ${getFullName(client.firstName, client.lastName)}? Sus datos se conservan y puede reactivarse.`}
        confirmLabel="Desactivar"
        danger
        isLoading={deactivateMutation.isPending}
      />
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm text-gray-900">{value}</p>
    </div>
  );
}
