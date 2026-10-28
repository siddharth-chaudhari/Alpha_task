import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDiscardDialogProps {
  isOpen: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
}

export default function ConfirmDiscardDialog({
  isOpen,
  onKeepEditing,
  onDiscard,
}: ConfirmDiscardDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const discardBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      discardBtnRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onKeepEditing();
        }
      };

      window.addEventListener('keydown', handleKeyDown, true);
      return () => window.removeEventListener('keydown', handleKeyDown, true);
    }
  }, [isOpen, onKeepEditing]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity dark:bg-black/60"
        onClick={onKeepEditing}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="discard-dialog-title"
        aria-describedby="discard-dialog-description"
        className="relative z-10 w-full max-w-md rounded-2xl border border-surface-200 bg-white p-6 shadow-2xl transition-all dark:border-surface-800 dark:bg-surface-900"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3
              id="discard-dialog-title"
              className="text-base font-semibold text-surface-900 dark:text-surface-100"
            >
              Discard unsaved changes?
            </h3>
            <p
              id="discard-dialog-description"
              className="mt-1.5 text-sm text-surface-500 dark:text-surface-400"
            >
              You have unsaved changes in this contact. If you leave now, your changes will be lost.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onKeepEditing}
            className="focus-ring inline-flex items-center justify-center rounded-lg border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 shadow-xs hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            Keep Editing
          </button>
          <button
            ref={discardBtnRef}
            type="button"
            onClick={onDiscard}
            className="focus-ring inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-rose-700 active:bg-rose-800 transition-colors"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
}
