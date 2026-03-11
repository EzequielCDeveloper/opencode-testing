'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Bell, Database, FileText, Shield, RefreshCw } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { RouteGuard } from '@/components/layout/RouteGuard';

export default function AdminPage() {
  const [auditPage, setAuditPage] = useState(1);
  const [opMessage, setOpMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: auditData, isLoading: loadingAudit } = useQuery({
    queryKey: ['audit-logs', auditPage],
    queryFn: () => adminApi.auditLogs({ page: auditPage, limit: 20 }),
  });

  const reminderMutation = useMutation({
    mutationFn: () => adminApi.triggerReminders(),
    onSuccess: () => setOpMessage({ type: 'success', text: 'Recordatorios enviados exitosamente.' }),
    onError: () => setOpMessage({ type: 'error', text: 'Error al enviar recordatorios.' }),
  });

  const backupMutation = useMutation({
    mutationFn: () => adminApi.triggerBackup(),
    onSuccess: () => setOpMessage({ type: 'success', text: 'Respaldo iniciado exitosamente.' }),
    onError: () => setOpMessage({ type: 'error', text: 'Error al iniciar respaldo.' }),
  });

  const auditLogs = auditData?.data?.items ?? [];
  const auditPagination = auditData?.data;

  return (
    <RouteGuard allowedRoles={['admin']}>
      <div>
        <Topbar title="Administración" />
        <div className="p-6 space-y-6">
          {opMessage && (
            <Alert variant={opMessage.type} className="mb-2">
              {opMessage.text}
            </Alert>
          )}

          {/* Operations */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Reminders */}
            <Card>
              <CardContent className="py-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <Bell className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Recordatorios de expiración</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Envía emails a clientes con membresía próxima a vencer (3 días).
                    </p>
                    <Button
                      className="mt-3"
                      size="sm"
                      onClick={() => reminderMutation.mutate()}
                      isLoading={reminderMutation.isPending}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Ejecutar ahora
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backup */}
            <Card>
              <CardContent className="py-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-green-50 p-3">
                    <Database className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Respaldo de base de datos</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Genera un respaldo inmediato de todos los datos del sistema.
                    </p>
                    <Button
                      className="mt-3"
                      size="sm"
                      variant="secondary"
                      onClick={() => backupMutation.mutate()}
                      isLoading={backupMutation.isPending}
                    >
                      <Database className="h-4 w-4 mr-1" />
                      Respaldar ahora
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audit logs */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-500" />
                <CardTitle>Registro de auditoría</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loadingAudit ? (
                <div className="py-8 text-center text-sm text-gray-500">Cargando...</div>
              ) : auditLogs.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Sin registros"
                  description="No hay registros de auditoría aún."
                />
              ) : (
                <>
                  <Table>
                    <TableHead>
                      <tr>
                        <TableHeader>Fecha</TableHeader>
                        <TableHeader>Usuario</TableHeader>
                        <TableHeader>Acción</TableHeader>
                        <TableHeader>Entidad</TableHeader>
                        <TableHeader>ID</TableHeader>
                      </tr>
                    </TableHead>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-gray-500 whitespace-nowrap">
                            {formatDateTime(log.createdAt)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {log.userName || log.userId}
                          </TableCell>
                          <TableCell>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                              {log.action}
                            </span>
                          </TableCell>
                          <TableCell className="capitalize">{log.entity}</TableCell>
                          <TableCell className="text-gray-500 text-xs font-mono">
                            {log.entityId}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {auditPagination && auditPagination.totalPages > 1 && (
                    <div className="px-4">
                      <Pagination
                        page={auditPage}
                        totalPages={auditPagination.totalPages}
                        total={auditPagination.total}
                        limit={auditPagination.limit}
                        onPageChange={setAuditPage}
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  );
}
