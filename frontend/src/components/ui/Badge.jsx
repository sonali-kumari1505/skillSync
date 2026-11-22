import React from 'react';
import { cn } from '../../utils/cn';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className
}) {
  const variants = {
    default:
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    primary:
      'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20',
    success:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    warning:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    danger:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    info:
      'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-medium rounded-full',
    md: 'text-xs px-2.5 py-1 font-medium rounded-full',
    lg: 'text-sm px-3 py-1.5 font-medium rounded-md'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 tracking-tight select-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
