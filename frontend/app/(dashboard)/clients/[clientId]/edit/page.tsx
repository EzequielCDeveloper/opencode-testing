'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { clientsApi } from '@/lib/api';
import { UpdateClientRequest } from '@/types';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { ClientForm } from '@/components/clients/ClientForm';
import { RouteGuard } from '@/components/layout/RouteGuard';
import { getFullName } from '@/lib/utils';

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const clientId = params.clientId as string;
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientsApi.get(clientId),
  });

  const mutation = useMutation({
    mutationFn: (formData: UpdateClientRequest) => clientsApi.update(clientId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.push(`/clients/${clientId}`);
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
      setError(
        axiosErr?.response?.data?.error?.message ||
          'No se pudo actualizar el cliente. Intenta nuevamente.'
      );
    },
  });

  if (isLoading) return <PageLoader />;

  const client = data?.data;
  if (!client) return <div className="p-6 text-gray-500">Cliente no encontrado.</div>;

  return (
    <RouteGuard allowedRoles={['admin', 'staff']}>
      <div>
        <Topbar title="Editar cliente" />
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
              <CardTitle>
                Editar: {getFullName(client.firstName, client.lastName)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ClientForm
                defaultValues={client}
                onSubmit={async (formData) => mutation.mutate(formData)}
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
