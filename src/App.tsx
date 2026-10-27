import { useState, useMemo, useCallback } from 'react';
import type { Contact, ViewMode } from './types/contact';
import { initialContacts } from './data/contacts';
import AppHeader from './components/AppHeader';
import ContactsTable from './components/ContactsTable';
import ContactsBoard from './components/ContactsBoard';
import ContactDetailsPanel from './components/ContactDetailsPanel';

function generateId(): string {
  return `c${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function App() {
  // ── Canonical state ──────────────────────────────────────────────
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [currentView, setCurrentView] = useState<ViewMode>('table');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSaveContact = useCallback((updated: Contact) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === updated.id ? { ...updated } : c)),
    );
  }, []);

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
    setContacts((prev) => [newContact, ...prev]);
    setSelectedContactId(newContact.id);
  }, []);

  const handleViewChange = useCallback((view: ViewMode) => {
    setCurrentView(view);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <AppHeader
        totalContacts={contacts.length}
        currentView={currentView}
        onViewChange={handleViewChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddContact={handleAddContact}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content area */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-200 ${
            selectedContact ? 'mr-0' : ''
          }`}
        >
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
              />
            )}
          </div>
        </main>

        {/* Details panel */}
        {selectedContact && (
          <aside
            className="w-full shrink-0 overflow-hidden border-surface-200 bg-white shadow-xl sm:w-[420px] lg:w-[460px]"
            style={{ maxHeight: 'calc(100vh - 57px)' }}
          >
            <ContactDetailsPanel
              contact={selectedContact}
              onSave={handleSaveContact}
              onClose={handleClosePanel}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
