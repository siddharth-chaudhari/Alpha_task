import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import type { ToastMessage } from '../types/toast';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 2800);

    const removeTimer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3100);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, onDismiss]);

  const handleManualDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 200);
  };

  const isSuccess = toast.type === 'success';

  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      aria-live={isSuccess ? 'polite' : 'assertive'}
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-lg backdrop-blur-md transition-all duration-200 ${
        isExiting
          ? 'opacity-0 translate-y-[-6px] scale-95'
          : 'opacity-100 translate-y-0 scale-100'
      } ${
        isSuccess
          ? 'border-emerald-200 bg-white/95 text-emerald-950 dark:border-emerald-800/60 dark:bg-surface-900/95 dark:text-emerald-100'
          : 'border-rose-200 bg-white/95 text-rose-950 dark:border-rose-800/60 dark:bg-surface-900/95 dark:text-rose-100'
      }`}
    >
      <div className="mt-0.5 shrink-0">
        {isSuccess ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
        )}
      </div>

      <div className="flex-1 pr-1 text-sm font-medium leading-snug">
        {toast.message}
      </div>

      <button
        onClick={handleManualDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-md p-1 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200 focus-ring"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed top-16 right-4 z-50 flex w-full max-w-sm pointer-events-none flex-col gap-2 px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
