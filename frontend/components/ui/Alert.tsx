import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const configs: Record<AlertVariant, { icon: React.ReactNode; styles: string }> = {
    success: {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      styles: 'bg-green-50 border-green-200 text-green-800',
    },
    error: {
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      styles: 'bg-red-50 border-red-200 text-red-800',
    },
    warning: {
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      styles: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    },
    info: {
      icon: <Info className="h-5 w-5 text-blue-500" />,
      styles: 'bg-blue-50 border-blue-200 text-blue-800',
    },
  };

  const { icon, styles } = configs[variant];

  return (
    <div className={cn('flex gap-3 rounded-lg border p-4', styles, className)}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
