import React from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { Toast } from '@/types';
import { useChatContext } from '@/contexts/ChatContext';

/* ------------------------------------------------------------------ */
/*  Toast Item                                                        */
/* ------------------------------------------------------------------ */

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const iconMap: Record<Toast['type'], React.ReactNode> = {
  success: <CheckCircle size={18} className="text-[var(--success)] shrink-0" />,
  error: <XCircle size={18} className="text-[var(--danger)] shrink-0" />,
  info: <Info size={18} className="text-[var(--accent)] shrink-0" />,
  warning: <AlertTriangle size={18} className="text-[var(--warning)] shrink-0" />,
};

const ToastItem = React.memo(function ToastItem({
  toast,
  onDismiss,
}: ToastItemProps) {
  return (
    <div
      role="alert"
      className="animate-toast-in bg-[var(--modal-bg)] border border-[var(--border)] rounded-lg shadow-lg flex items-start gap-3 px-4 py-3 min-w-[300px] max-w-[420px]"
    >
      <div className="mt-0.5">{iconMap[toast.type]}</div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-0.5 rounded cursor-pointer shrink-0"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Toast Container                                                   */
/* ------------------------------------------------------------------ */

export function ToastContainer() {
  const { toasts, removeToast } = useChatContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-2 pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />  
      ))}
    </div>
  );
}
