'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { membershipsApi, clientsApi } from '@/lib/api';
import { CreateMembershipRequest } from '@/types';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { RouteGuard } from '@/components/layout/RouteGuard';

const schema = z.object({
  clientId: z.string().min(1, 'Selecciona un cliente'),
  planId: z.string().min(1, 'Selecciona un plan'),
  priceType: z.enum(['standard', 'student']),
  startDate: z.string().min(1, 'Fecha de inicio requerida'),
});

type FormData = z.infer<typeof schema>;

const PLAN_OPTIONS = [
  { value: 'plan_monthly', label: 'Mensual' },
];

const PRICE_TYPE_OPTIONS = [
  { value: 'standard', label: 'Estándar' },
  { value: 'student', label: 'Estudiante' },
];

export default function NewMembershipPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const prefilledClientId = searchParams.get('clientId') || '';
  const [error, setError] = useState<string | null>(null);

  const { data: clientsData } = useQuery({
    queryKey: ['clients-all'],
    queryFn: () => clientsApi.list({ limit: 100, status: 'active' }),
  });

  const clientOptions =
    clientsData?.data?.items?.map((c) => ({
      value: c.id,
      label: `${c.firstName} ${c.lastName}`,
    })) ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: prefilledClientId,
      planId: 'plan_monthly',
      priceType: 'standard',
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateMembershipRequest) => membershipsApi.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.push(`/clients/${res.data.clientId}`);
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
      setError(
        axiosErr?.response?.data?.error?.message ||
          'No se pudo asignar la membresía. Intenta nuevamente.'
      );
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <RouteGuard allowedRoles={['admin', 'staff']}>
      <div>
        <Topbar title="Asignar membresía" />
        <div className="p-6 max-w-lg">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>

          {error && <Alert variant="error" className="mb-4">{error}</Alert>}

          <Card>
            <CardHeader>
              <CardTitle>Nueva membresía</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Select
                  label="Cliente"
                  options={clientOptions}
                  placeholder="Selecciona un cliente"
                  required
                  error={errors.clientId?.message}
                  {...register('clientId')}
                />

                <Select
                  label="Plan"
                  options={PLAN_OPTIONS}
                  required
                  error={errors.planId?.message}
                  {...register('planId')}
                />

                <Select
                  label="Tipo de precio"
                  options={PRICE_TYPE_OPTIONS}
                  required
                  error={errors.priceType?.message}
                  {...register('priceType')}
                />

                <Input
                  label="Fecha de inicio"
                  type="date"
                  required
                  error={errors.startDate?.message}
                  {...register('startDate')}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={mutation.isPending}>
                    Asignar membresía
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
