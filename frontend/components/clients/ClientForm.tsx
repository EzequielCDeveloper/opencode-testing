'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Client, CreateClientRequest } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  firstName: z.string().min(1, 'Nombre requerido').max(100),
  lastName: z.string().min(1, 'Apellido requerido').max(100),
  birthDate: z.string().min(1, 'Fecha de nacimiento requerida'),
  phone: z.string().min(1, 'Teléfono requerido').max(20),
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  address: z.string().min(1, 'Dirección requerida').max(300),
});

type FormData = z.infer<typeof schema>;

interface ClientFormProps {
  defaultValues?: Partial<Client>;
  onSubmit: (data: CreateClientRequest) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ClientForm({ defaultValues, onSubmit, isLoading, onCancel }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? {
          firstName: defaultValues.firstName,
          lastName: defaultValues.lastName,
          birthDate: defaultValues.birthDate,
          phone: defaultValues.phone,
          email: defaultValues.email,
          address: defaultValues.address,
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nombre"
          placeholder="Juan"
          required
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Apellido"
          placeholder="Pérez"
          required
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Fecha de nacimiento"
          type="date"
          required
          error={errors.birthDate?.message}
          {...register('birthDate')}
        />
        <Input
          label="Teléfono"
          placeholder="+5215512345678"
          required
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <Input
        label="Correo electrónico"
        type="email"
        placeholder="juan@ejemplo.com"
        required
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Dirección"
        placeholder="Calle 123, Colonia, Ciudad"
        required
        error={errors.address?.message}
        {...register('address')}
      />

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? 'Guardar cambios' : 'Registrar cliente'}
        </Button>
      </div>
    </form>
  );
}
