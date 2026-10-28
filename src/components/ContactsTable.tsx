import type { Contact } from '../types/contact';
import ContactTableRow from './ContactTableRow';
import EmptyState from './EmptyState';

interface ContactsTableProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
}

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'company', label: 'Company' },
  { key: 'role', label: 'Role' },
  { key: 'owner', label: 'Owner' },
  { key: 'labels', label: 'Labels' },
  { key: 'stage', label: 'Stage' },
  { key: 'notes', label: 'Notes' },
];

export default function ContactsTable({
  contacts,
  selectedContactId,
  onSelectContact,
}: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <EmptyState
        title="No contacts found"
        description="Try adjusting your search or add a new contact."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white shadow-xs dark:border-surface-800 dark:bg-surface-900">
      <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-800">
        <thead className="bg-surface-50 dark:bg-surface-800/50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-400 first:pl-4 last:pr-4 sm:first:pl-6 sm:last:pr-6"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <ContactTableRow
              key={contact.id}
              contact={contact}
              isSelected={contact.id === selectedContactId}
              onClick={() => onSelectContact(contact.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
