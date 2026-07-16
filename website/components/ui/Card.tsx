import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'bg-slate-800/50 border border-slate-700 rounded-xl p-6',
        hover && 'hover:border-brand-accent hover:shadow-lg hover:shadow-brand-accent/10 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
