import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`p-8 flex flex-col items-center gap-3 text-center select-none ${className}`}
    >
      {/* Icon */}
      <div className="text-[var(--text-secondary)] opacity-40">{icon}</div>

      {/* Title */}
      <h3 className="text-lg font-medium text-[var(--text-primary)]">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-[var(--text-secondary)] max-w-xs">
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-2 px-5 py-2 text-sm font-medium rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
