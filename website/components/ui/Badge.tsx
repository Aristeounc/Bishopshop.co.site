import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    primary: 'bg-brand-primary/20 text-brand-accent border border-brand-primary/40',
    success: 'bg-green-500/20 text-green-300 border border-green-500/40',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/40',
    neutral: 'bg-slate-700/50 text-slate-300 border border-slate-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
