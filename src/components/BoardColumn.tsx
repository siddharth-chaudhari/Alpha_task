import type { Contact, Stage } from '../types/contact';
import ContactCard from './ContactCard';
import EmptyState from './EmptyState';
import StageBadge from './StageBadge';

interface BoardColumnProps {
  stage: Stage;
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
}

export default function BoardColumn({
  stage,
  contacts,
  selectedContactId,
  onSelectContact,
}: BoardColumnProps) {
  return (
    <div className="flex min-w-[280px] flex-1 flex-col rounded-xl border border-surface-200 bg-surface-50/50">
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-surface-200 bg-white px-4 py-3 rounded-t-xl">
        <div className="flex items-center gap-2">
          <StageBadge stage={stage} size="md" />
        </div>
        <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-surface-100 px-2 text-xs font-semibold text-surface-500">
          {contacts.length}
        </span>
      </div>

      {/* Column Body */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
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
          <EmptyState title="No contacts" description={`No contacts in ${stage} stage`} />
        )}
      </div>
    </div>
  );
}
