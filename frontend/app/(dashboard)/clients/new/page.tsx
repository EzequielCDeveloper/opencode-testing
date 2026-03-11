'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { clientsApi } from '@/lib/api';
import { CreateClientRequest } from '@/types';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { ClientForm } from '@/components/clients/ClientForm';
import { RouteGuard } from '@/components/layout/RouteGuard';

export default function NewClientPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: CreateClientRequest) => clientsApi.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.push(`/clients/${res.data.id}`);
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
      setError(
        axiosErr?.response?.data?.error?.message ||
          'No se pudo registrar el cliente. Intenta nuevamente.'
      );
    },
  });

  return (
    <RouteGuard allowedRoles={['admin', 'staff']}>
      <div>
        <Topbar title="Nuevo cliente" />
        <div className="p-6 max-w-2xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Datos del cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientForm
                onSubmit={async (data) => mutation.mutate(data)}
                isLoading={mutation.isPending}
                onCancel={() => router.back()}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  );
}
