import { BookUser, Plus, Search } from 'lucide-react';
import type { ViewMode } from '../types/contact';
import ViewSwitcher from './ViewSwitcher';

interface AppHeaderProps {
  totalContacts: number;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddContact: () => void;
}

export default function AppHeader({
  totalContacts,
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  onAddContact,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm">
            <BookUser className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold leading-tight text-surface-900">Contacts</h1>
            <p className="text-xs text-surface-400">
              {totalContacts} contact{totalContacts !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative ml-auto min-w-0 max-w-xs flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input
            id="search-contacts"
            type="search"
            placeholder="Search by name, email, or company…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="focus-ring w-full rounded-lg border border-surface-200 bg-surface-50 py-2 pl-9 pr-3 text-sm text-surface-700 placeholder:text-surface-400 transition-colors focus:bg-white focus:border-primary-300"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <ViewSwitcher currentView={currentView} onViewChange={onViewChange} />
          <button
            id="add-contact-btn"
            onClick={onAddContact}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 active:bg-primary-800"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Contact</span>
          </button>
        </div>
      </div>
    </header>
  );
}
