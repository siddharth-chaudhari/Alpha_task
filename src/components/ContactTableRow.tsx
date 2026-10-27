import type { Contact } from '../types/contact';
import StageBadge from './StageBadge';
import LabelBadge from './LabelBadge';

interface ContactTableRowProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
}

export default function ContactTableRow({ contact, isSelected, onClick }: ContactTableRowProps) {
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <tr
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open details for ${contact.name}`}
      className={`group cursor-pointer border-b border-surface-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 ${
        isSelected
          ? 'bg-primary-50/60'
          : 'hover:bg-surface-50'
      }`}
    >
      {/* Name */}
      <td className="whitespace-nowrap py-3 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-semibold text-white">
            {initials}
          </div>
          <span className="text-sm font-medium text-surface-900">{contact.name}</span>
        </div>
      </td>

      {/* Email */}
      <td className="whitespace-nowrap px-3 py-3 text-sm text-surface-500">
        {contact.email || <span className="text-surface-300">—</span>}
      </td>

      {/* Company */}
      <td className="whitespace-nowrap px-3 py-3 text-sm text-surface-500">
        {contact.company || <span className="text-surface-300">—</span>}
      </td>

      {/* Role */}
      <td className="whitespace-nowrap px-3 py-3 text-sm text-surface-500">
        {contact.role || <span className="text-surface-300">—</span>}
      </td>

      {/* Owner */}
      <td className="whitespace-nowrap px-3 py-3 text-sm text-surface-500">
        {contact.owner || <span className="text-surface-300">—</span>}
      </td>

      {/* Labels */}
      <td className="px-3 py-3">
        <div className="flex flex-wrap gap-1">
          {contact.labels.length > 0 ? (
            contact.labels.map((label) => (
              <LabelBadge key={label} label={label} />
            ))
          ) : (
            <span className="text-sm text-surface-300">—</span>
          )}
        </div>
      </td>

      {/* Stage */}
      <td className="whitespace-nowrap px-3 py-3">
        <StageBadge stage={contact.stage} />
      </td>

      {/* Notes */}
      <td className="max-w-[200px] truncate px-3 py-3 pr-4 text-sm text-surface-400 sm:pr-6">
        {contact.notes || <span className="text-surface-300">—</span>}
      </td>
    </tr>
  );
}
