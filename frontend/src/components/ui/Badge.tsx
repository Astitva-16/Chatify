import React from 'react';

interface BadgeProps {
  count: number;
  className?: string;
}

export const Badge = React.memo(function Badge({ count, className = '' }: BadgeProps) {
  if (count <= 0) return null;

  const display = count > 99 ? '99+' : String(count);

  return (
    <span
      className={`bg-[var(--badge-bg)] text-[var(--badge-text)] text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 leading-none ${className}`}
    >
      {display}
    </span>
  );
});
