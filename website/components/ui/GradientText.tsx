import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </span>
  );
}
