import { useMemo } from 'react';
import type { Contact, Stage } from '../types/contact';
import BoardColumn from './BoardColumn';

const STAGES: Stage[] = ['Lead', 'Prospect', 'Qualified', 'Customer'];

interface ContactsBoardProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
}

export default function ContactsBoard({
  contacts,
  selectedContactId,
  onSelectContact,
}: ContactsBoardProps) {
  const groupedContacts = useMemo(() => {
    const groups: Record<Stage, Contact[]> = {
      Lead: [],
      Prospect: [],
      Qualified: [],
      Customer: [],
    };

    for (const contact of contacts) {
      groups[contact.stage].push(contact);
    }

    return groups;
  }, [contacts]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => (
        <BoardColumn
          key={stage}
          stage={stage}
          contacts={groupedContacts[stage]}
          selectedContactId={selectedContactId}
          onSelectContact={onSelectContact}
        />
      ))}
    </div>
  );
}
