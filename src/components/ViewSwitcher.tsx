import { LayoutGrid, Table2 } from 'lucide-react';
import type { ViewMode } from '../types/contact';

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onViewChange(currentView === 'table' ? 'board' : 'table');
    }
  };

  return (
    <div
      className="inline-flex items-center rounded-lg border border-surface-200 bg-white p-0.5"
      role="tablist"
      aria-label="View mode"
      onKeyDown={handleKeyDown}
    >
      <button
        role="tab"
        aria-selected={currentView === 'table'}
        tabIndex={currentView === 'table' ? 0 : -1}
        onClick={() => onViewChange('table')}
        className={`focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
          currentView === 'table'
            ? 'bg-primary-50 text-primary-700 shadow-sm'
            : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
        }`}
      >
        <Table2 className="h-4 w-4" />
        Table
      </button>
      <button
        role="tab"
        aria-selected={currentView === 'board'}
        tabIndex={currentView === 'board' ? 0 : -1}
        onClick={() => onViewChange('board')}
        className={`focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
          currentView === 'board'
            ? 'bg-primary-50 text-primary-700 shadow-sm'
            : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        Board
      </button>
    </div>
  );
}
