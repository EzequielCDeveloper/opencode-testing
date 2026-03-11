'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { paymentsApi, clientsApi, membershipsApi } from '@/lib/api';
import { CreatePaymentRequest } from '@/types';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { RouteGuard } from '@/components/layout/RouteGuard';

const schema = z.object({
  clientId: z.string().min(1, 'Selecciona un cliente'),
  membershipId: z.string().min(1, 'Selecciona una membresía'),
  amount: z.string().min(1, 'El monto es requerido'),
  method: z.enum(['cash', 'card', 'bank_transfer']),
  reference: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface SubmitData {
  clientId: string;
  membershipId: string;
  amount: number;
  method: 'cash' | 'card' | 'bank_transfer';
  reference?: string;
}

const METHOD_OPTIONS = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'bank_transfer', label: 'Transferencia bancaria' },
];

export default function NewPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const prefilledClientId = searchParams.get('clientId') || '';
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState(prefilledClientId);

  const { data: clientsData } = useQuery({
    queryKey: ['clients-all'],
    queryFn: () => clientsApi.list({ limit: 100, status: 'active' }),
  });

  const { data: membershipsData } = useQuery({
    queryKey: ['memberships-client', selectedClient],
    queryFn: () => membershipsApi.list({ clientId: selectedClient, status: 'active', limit: 10 }),
    enabled: !!selectedClient,
  });

  const clientOptions =
    clientsData?.data?.items?.map((c) => ({
      value: c.id,
      label: `${c.firstName} ${c.lastName}`,
    })) ?? [];

  const membershipOptions =
    membershipsData?.data?.items?.map((m) => ({
      value: m.id,
      label: `${m.planName} — Vence: ${m.endDate}`,
    })) ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: prefilledClientId,
      method: 'cash',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SubmitData) => paymentsApi.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      router.push(`/clients/${res.data.clientId}`);
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
      setError(
        axiosErr?.response?.data?.error?.message ||
          'No se pudo registrar el pago. Intenta nuevamente.'
      );
    },
  });

  const onSubmit = (data: FormData) => {
    const submitData: SubmitData = {
      ...data,
      amount: parseFloat(data.amount),
    };
    mutation.mutate(submitData);
  };

  return (
    <RouteGuard allowedRoles={['admin', 'billing']}>
      <div>
        <Topbar title="Registrar pago" />
        <div className="p-6 max-w-lg">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>

          {error && <Alert variant="error" className="mb-4">{error}</Alert>}

          <Card>
            <CardHeader>
              <CardTitle>Nuevo pago</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Select
                  label="Cliente"
                  options={clientOptions}
                  placeholder="Selecciona un cliente"
                  required
                  error={errors.clientId?.message}
                  {...register('clientId', {
                    onChange: (e) => {
                      setSelectedClient(e.target.value);
                      setValue('membershipId', '');
                    },
                  })}
                />

                <Select
                  label="Membresía"
                  options={membershipOptions}
                  placeholder={
                    selectedClient
                      ? membershipOptions.length === 0
                        ? 'Sin membresías activas'
                        : 'Selecciona una membresía'
                      : 'Primero selecciona un cliente'
                  }
                  required
                  disabled={!selectedClient || membershipOptions.length === 0}
                  error={errors.membershipId?.message}
                  {...register('membershipId')}
                />

                <Input
                  label="Monto"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                  error={errors.amount?.message}
                  {...register('amount')}
                />

                <Select
                  label="Método de pago"
                  options={METHOD_OPTIONS}
                  required
                  error={errors.method?.message}
                  {...register('method')}
                />

                <Input
                  label="Referencia (opcional)"
                  placeholder="Núm. de transacción, folio, etc."
                  error={errors.reference?.message}
                  {...register('reference')}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={mutation.isPending}>
                    Registrar pago
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  );
}
