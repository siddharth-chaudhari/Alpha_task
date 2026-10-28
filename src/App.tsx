import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { Contact, Stage, ViewMode } from './types/contact';
import type { ToastMessage, ToastType } from './types/toast';
import { initialContacts } from './data/contacts';
import AppHeader from './components/AppHeader';
import ContactsTable from './components/ContactsTable';
import ContactsBoard from './components/ContactsBoard';
import ContactDetailsPanel from './components/ContactDetailsPanel';
import ToastContainer from './components/Toast';

function generateId(): string {
  return `c${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function App() {
  // ── Canonical state ──────────────────────────────────────────────
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [currentView, setCurrentView] = useState<ViewMode>('table');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ── Theme State ──────────────────────────────────────────────────
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('alpha_crm_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('alpha_crm_theme', next);
      } catch {}
      return next;
    });
  }, []);

  // Track newly added contact IDs for proper notification messaging
  const newlyCreatedIds = useRef<Set<string>>(new Set());

  // ── Toast Notification Utilities ─────────────────────────────────
  const addToast = useCallback((type: ToastType, message: string) => {
    setToasts((prev) => {
      // Prevent duplicate stacks for rapid identical notifications
      if (prev.some((t) => t.message === message && t.type === type)) {
        return prev;
      }
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const updated = [...prev, { id, type, message }];
      return updated.slice(-3); // Keep maximum 3 toasts visible
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Derived values ───────────────────────────────────────────────
  const selectedContact = useMemo(
    () => contacts.find((c) => c.id === selectedContactId) ?? null,
    [contacts, selectedContactId],
  );

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const query = searchQuery.toLowerCase().trim();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.company.toLowerCase().includes(query),
    );
  }, [contacts, searchQuery]);

  // ── Handlers ─────────────────────────────────────────────────────
  const handleSelectContact = useCallback((id: string) => {
    setSelectedContactId(id);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedContactId(null);
  }, []);

  const handleSaveContact = useCallback(
    (updated: Contact) => {
      const isNew = newlyCreatedIds.current.has(updated.id);
      newlyCreatedIds.current.delete(updated.id);

      setContacts((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...updated } : c)),
      );

      addToast(
        'success',
        isNew ? 'Contact created successfully.' : 'Contact updated successfully.',
      );
    },
    [addToast],
  );

  const handleAddContact = useCallback(() => {
    const newContact: Contact = {
      id: generateId(),
      name: 'New Contact',
      email: '',
      company: '',
      role: '',
      owner: '',
      labels: [],
      stage: 'Lead',
      notes: '',
    };
    newlyCreatedIds.current.add(newContact.id);
    setContacts((prev) => [newContact, ...prev]);
    setSelectedContactId(newContact.id);
  }, []);

  // Stage update handler for Board Drag-and-Drop
  const handleStageChange = useCallback((contactId: string, newStage: Stage) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, stage: newStage } : c)),
    );
  }, []);

  const handleViewChange = useCallback((view: ViewMode) => {
    setCurrentView(view);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-surface-50 text-surface-900 transition-colors duration-150 dark:bg-surface-950 dark:text-surface-100">
      <AppHeader
        totalContacts={contacts.length}
        currentView={currentView}
        onViewChange={handleViewChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddContact={handleAddContact}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
            {currentView === 'table' ? (
              <ContactsTable
                contacts={filteredContacts}
                selectedContactId={selectedContactId}
                onSelectContact={handleSelectContact}
              />
            ) : (
              <ContactsBoard
                contacts={filteredContacts}
                selectedContactId={selectedContactId}
                onSelectContact={handleSelectContact}
                onStageChange={handleStageChange}
              />
            )}
          </div>
        </main>

        {/* Details Panel Drawer with Backdrop, Resizing, and Confirmation */}
        {selectedContact && (
          <ContactDetailsPanel
            key={selectedContact.id}
            contact={selectedContact}
            onSave={handleSaveContact}
            onClose={handleClosePanel}
            onError={(msg) => addToast('error', msg)}
          />
        )}
      </div>
    </div>
  );
}
