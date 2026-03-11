'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BarChart3, Download, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { reportsApi } from '@/lib/api';
import { ReportType } from '@/types';
import { formatDate, formatCurrency, PAYMENT_METHOD_LABELS } from '@/lib/utils';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { MembershipStatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';

type TabType = 'expirations' | 'revenue';

function getDefaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  };
}

export default function ReportsPage() {
  const defaults = getDefaultDateRange();
  const [tab, setTab] = useState<TabType>('expirations');
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);
  const [error, setError] = useState<string | null>(null);

  const { data: expirationData, isLoading: loadingExp } = useQuery({
    queryKey: ['report-expirations', from, to],
    queryFn: () => reportsApi.expirations({ from, to }),
    enabled: tab === 'expirations',
  });

  const { data: revenueData, isLoading: loadingRev } = useQuery({
    queryKey: ['report-revenue', from, to],
    queryFn: () => reportsApi.revenue({ from, to }),
    enabled: tab === 'revenue',
  });

  const exportMutation = useMutation({
    mutationFn: (type: ReportType) => reportsApi.exportPdf(type, { from, to }),
    onSuccess: (blob, type) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${type}-${from}-${to}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
    onError: () => setError('No se pudo exportar el reporte.'),
  });

  const expirations = expirationData?.data ?? [];
  const revenues = revenueData?.data ?? [];

  const totalRevenue = revenues.reduce((sum, r) => sum + r.total, 0);

  return (
    <div>
      <Topbar title="Reportes" />
      <div className="p-6 space-y-6">
        {error && <Alert variant="error">{error}</Alert>}

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Input
                label="Desde"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <Input
                label="Hasta"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => exportMutation.mutate(tab)}
                isLoading={exportMutation.isPending}
              >
                <Download className="h-4 w-4 mr-1" />
                Exportar PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <TabButton
            active={tab === 'expirations'}
            onClick={() => setTab('expirations')}
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Expiraciones"
          />
          <TabButton
            active={tab === 'revenue'}
            onClick={() => setTab('revenue')}
            icon={<DollarSign className="h-4 w-4" />}
            label="Ingresos"
          />
        </div>

        {/* Expirations */}
        {tab === 'expirations' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Membresías que vencen en el período</CardTitle>
                <span className="text-sm text-gray-500">{expirations.length} registro(s)</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loadingExp ? (
                <div className="py-8 text-center text-sm text-gray-500">Cargando...</div>
              ) : expirations.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="Sin expiraciones"
                  description="No hay membresías que venzan en el período seleccionado."
                />
              ) : (
                <Table>
                  <TableHead>
                    <tr>
                      <TableHeader>Cliente</TableHeader>
                      <TableHeader>Membresía</TableHeader>
                      <TableHeader>Vencimiento</TableHeader>
                      <TableHeader>Días restantes</TableHeader>
                      <TableHeader>Estado</TableHeader>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {expirations.map((exp) => (
                      <TableRow key={exp.membershipId}>
                        <TableCell className="font-medium">{exp.clientName}</TableCell>
                        <TableCell>{exp.membershipId}</TableCell>
                        <TableCell>{formatDate(exp.endDate)}</TableCell>
                        <TableCell>
                          <span
                            className={
                              exp.daysLeft <= 3
                                ? 'text-red-600 font-medium'
                                : exp.daysLeft <= 7
                                ? 'text-yellow-600 font-medium'
                                : 'text-gray-700'
                            }
                          >
                            {exp.daysLeft === 0 ? 'Hoy' : `${exp.daysLeft} días`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <MembershipStatusBadge status={exp.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Revenue */}
        {tab === 'revenue' && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="py-4">
                  <p className="text-sm text-gray-500">Total ingresos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalRevenue)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <p className="text-sm text-gray-500">Total transacciones</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {revenues.reduce((s, r) => s + r.count, 0)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <p className="text-sm text-gray-500">Días con ingresos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{revenues.length}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ingresos por día</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loadingRev ? (
                  <div className="py-8 text-center text-sm text-gray-500">Cargando...</div>
                ) : revenues.length === 0 ? (
                  <EmptyState
                    icon={BarChart3}
                    title="Sin ingresos"
                    description="No hay ingresos registrados en el período seleccionado."
                  />
                ) : (
                  <Table>
                    <TableHead>
                      <tr>
                        <TableHeader>Fecha</TableHeader>
                        <TableHeader>Total</TableHeader>
                        <TableHeader>Transacciones</TableHeader>
                        <TableHeader>Efectivo</TableHeader>
                        <TableHeader>Tarjeta</TableHeader>
                        <TableHeader>Transferencia</TableHeader>
                      </tr>
                    </TableHead>
                    <TableBody>
                      {revenues.map((r) => (
                        <TableRow key={r.date}>
                          <TableCell>{formatDate(r.date)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(r.total)}</TableCell>
                          <TableCell>{r.count}</TableCell>
                          <TableCell>{formatCurrency(r.byMethod.cash)}</TableCell>
                          <TableCell>{formatCurrency(r.byMethod.card)}</TableCell>
                          <TableCell>{formatCurrency(r.byMethod.bank_transfer)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
