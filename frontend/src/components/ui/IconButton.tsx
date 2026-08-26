import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  title?: string;
  className?: string;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const IconButton = React.memo(function IconButton({
  icon,
  onClick,
  title,
  className = '',
  active = false,
  size = 'md',
  disabled = false,
}: IconButtonProps) {
  const sizeClass =
    size === 'sm' ? 'w-8 h-8 p-1.5' : size === 'lg' ? 'w-11 h-11 p-2.5' : 'w-10 h-10 p-2';
  const colorClass = active
    ? 'text-[var(--accent)] bg-[var(--bg-active)]'
    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]';

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={`
        ${sizeClass}
        ${colorClass}
        rounded-xl cursor-pointer flex items-center justify-center
        transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
        ${className}
      `}
    >
      {icon}
    </button>
  );
});
