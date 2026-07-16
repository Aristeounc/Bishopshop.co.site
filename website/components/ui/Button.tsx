import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-medium rounded-lg transition-all duration-200 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-brand-primary hover:bg-blue-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    secondary:
      'bg-slate-700 hover:bg-slate-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5',
    ghost: 'bg-transparent border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400',
    accent:
      'bg-brand-accent hover:bg-purple-400 text-slate-900 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
