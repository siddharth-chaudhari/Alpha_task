import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-100 dark:bg-surface-800">
        <Inbox className="h-6 w-6 text-surface-400 dark:text-surface-500" />
      </div>
      <h3 className="text-sm font-medium text-surface-700 dark:text-surface-200">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-surface-400 dark:text-surface-500">{description}</p>
      )}
    </div>
  );
}
