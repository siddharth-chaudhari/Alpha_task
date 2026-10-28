import { BookUser, Plus, Search, Sun, Moon } from 'lucide-react';
import type { ViewMode } from '../types/contact';
import ViewSwitcher from './ViewSwitcher';

interface AppHeaderProps {
  totalContacts: number;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddContact: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function AppHeader({
  totalContacts,
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  onAddContact,
  theme,
  onToggleTheme,
}: AppHeaderProps) {
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/80 backdrop-blur-md dark:border-surface-800 dark:bg-surface-900/80">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 shadow-xs">
            <BookUser className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold leading-tight text-surface-900 dark:text-surface-100">Contacts</h1>
            <p className="text-xs text-surface-400 dark:text-surface-500">
              {totalContacts} contact{totalContacts !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative ml-auto min-w-0 max-w-xs flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400 dark:text-surface-500" />
          <input
            id="search-contacts"
            type="search"
            placeholder="Search by name, email, or company…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="focus-ring w-full rounded-lg border border-surface-200 bg-surface-50 py-2 pl-9 pr-3 text-sm text-surface-700 placeholder:text-surface-400 transition-colors focus:bg-white focus:border-primary-300 dark:border-surface-700 dark:bg-surface-800/80 dark:text-surface-200 dark:placeholder:text-surface-500 dark:focus:bg-surface-800 dark:focus:border-primary-500"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={onToggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 bg-white text-surface-600 shadow-xs transition-colors hover:bg-surface-50 hover:text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700 dark:hover:text-surface-100"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-surface-600 transition-transform duration-200 hover:-rotate-12" />
            )}
          </button>

          <ViewSwitcher currentView={currentView} onViewChange={onViewChange} />

          <button
            id="add-contact-btn"
            onClick={onAddContact}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-primary-700 active:bg-primary-800 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Contact</span>
          </button>
        </div>
      </div>
    </header>
  );
}
