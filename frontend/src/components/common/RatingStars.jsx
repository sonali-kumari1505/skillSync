import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function RatingStars({
  value = 0,
  onChange,
  size = 'md',
  count,
  className
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const isInteractive = Boolean(onChange);

  const starSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = isInteractive
            ? (hoverRating || value) >= star
            : value >= star;

          return (
            <button
              type="button"
              key={star}
              disabled={!isInteractive}
              onClick={() => isInteractive && onChange(star)}
              onMouseEnter={() => isInteractive && setHoverRating(star)}
              onMouseLeave={() => isInteractive && setHoverRating(0)}
              className={cn(
                'transition-colors duration-100',
                isInteractive && 'cursor-pointer hover:scale-110 active:scale-95'
              )}
            >
              <Star
                className={cn(
                  starSizes[size],
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 dark:text-slate-700'
                )}
              />
            </button>
          );
        })}
      </div>
      {!isInteractive && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
          {Number(value).toFixed(1)}
          {count !== undefined && (
            <span className="text-slate-400 dark:text-slate-500 font-normal ml-0.5">
              ({count})
            </span>
          )}
        </span>
      )}
    </div>
  );
}
