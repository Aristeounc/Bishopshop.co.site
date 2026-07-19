'use client';

import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function Input({
  label,
  placeholder,
  type = 'text',
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-2.5 bg-slate-900 border rounded-lg text-slate-100 placeholder-slate-500',
          'focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent',
          'transition-colors',
          error ? 'border-red-500' : 'border-slate-700'
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  placeholder,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">{label}</label>
      )}
      <textarea
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-2.5 bg-slate-900 border rounded-lg text-slate-100 placeholder-slate-500',
          'focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent',
          'transition-colors resize-none',
          error ? 'border-red-500' : 'border-slate-700'
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  options,
  error,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">{label}</label>
      )}
      <select
        className={cn(
          'w-full px-4 py-2.5 bg-slate-900 border rounded-lg text-slate-100',
          'focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent',
          'transition-colors appearance-none',
          error ? 'border-red-500' : 'border-slate-700'
        )}
        {...props}
      >
        <option value="">Select an option...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
