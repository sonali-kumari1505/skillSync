import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function CompatibilityBadge({ score, size = 'md', className }) {
  const num = Math.round(score || 0);

  let colorClasses = 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  let dotColor = 'bg-slate-400';

  if (num >= 85) {
    colorClasses = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-500 animate-pulse';
  } else if (num >= 70) {
    colorClasses = 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30';
    dotColor = 'bg-violet-500';
  } else if (num >= 50) {
    colorClasses = 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30';
    dotColor = 'bg-sky-500';
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border shadow-sm',
        colorClasses,
        sizes[size],
        className
      )}
    >
      <Sparkles className="h-3 w-3" />
      <span>{num}% Match</span>
    </span>
  );
}
