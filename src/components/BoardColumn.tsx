import { useState } from 'react';
import type { Contact, Stage } from '../types/contact';
import ContactCard from './ContactCard';
import EmptyState from './EmptyState';
import StageBadge from './StageBadge';

interface BoardColumnProps {
  stage: Stage;
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
  onDropContact: (contactId: string, stage: Stage) => void;
}

export default function BoardColumn({
  stage,
  contacts,
  selectedContactId,
  onSelectContact,
  onDropContact,
}: BoardColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const contactId = e.dataTransfer.getData('text/plain');
    if (contactId) {
      onDropContact(contactId, stage);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex min-w-[280px] flex-1 flex-col rounded-xl border transition-all duration-150 ${
        isDragOver
          ? 'border-primary-400 ring-2 ring-primary-300/60 bg-primary-50/40 dark:border-primary-500 dark:ring-primary-900/60 dark:bg-primary-950/30'
          : 'border-surface-200 bg-surface-50/50 dark:border-surface-800 dark:bg-surface-900/40'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-surface-200 bg-white px-4 py-3 rounded-t-xl dark:border-surface-800 dark:bg-surface-900">
        <div className="flex items-center gap-2">
          <StageBadge stage={stage} size="md" />
        </div>
        <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-surface-100 px-2 text-xs font-semibold text-surface-500 dark:bg-surface-800 dark:text-surface-400">
          {contacts.length}
        </span>
      </div>

      {/* Column Body */}
      <div
        className="flex-1 space-y-3 overflow-y-auto p-3"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isSelected={contact.id === selectedContactId}
              onClick={() => onSelectContact(contact.id)}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-surface-200 py-6 dark:border-surface-800">
            <EmptyState
              title={`No contacts`}
              description={isDragOver ? `Drop to move to ${stage}` : `No contacts in ${stage} stage`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
