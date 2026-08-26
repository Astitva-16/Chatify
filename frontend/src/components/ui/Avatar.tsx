import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  showOnlineIndicator?: boolean;
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 text-2xl',
} as const;

const indicatorSizeMap = {
  xs: 'w-2 h-2 border',
  sm: 'w-2.5 h-2.5 border-[1.5px]',
  md: 'w-3 h-3 border-[1.5px]',
  lg: 'w-3.5 h-3.5 border-2',
  xl: 'w-5 h-5 border-2',
} as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = React.memo(function Avatar({
  src,
  name,
  size = 'md',
  isOnline = false,
  showOnlineIndicator = false,
  className = '',
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  const showImage = src && !imgError;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className={`${sizeMap[size]} rounded-full object-cover`}
          draggable={false}
        />
      ) : (
        <div
          className={`${sizeMap[size]} rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-semibold select-none`}
        >
          {getInitials(name)}
        </div>
      )}

      {showOnlineIndicator && isOnline && (
        <span
          className={`absolute bottom-0 right-0 ${indicatorSizeMap[size]} rounded-full bg-[var(--online)] border-[var(--bg-primary)] animate-online-pulse`}
        />
      )}
    </div>
  );
});
