import { Building2, User } from 'lucide-react';
import type { Contact } from '../types/contact';
import LabelBadge from './LabelBadge';

interface ContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
}

export default function ContactCard({ contact, isSelected, onClick }: ContactCardProps) {
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      aria-label={`Open details for ${contact.name}`}
      className={`focus-ring group w-full rounded-xl border bg-white p-4 text-left transition-all duration-150 hover:shadow-md ${
        isSelected
          ? 'border-primary-300 shadow-md ring-1 ring-primary-200'
          : 'border-surface-200 hover:border-surface-300'
      }`}
    >
      {/* Contact Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-semibold text-white shadow-sm">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-surface-900">{contact.name}</p>
          {contact.role ? (
            <p className="truncate text-xs text-surface-400">{contact.role}</p>
          ) : (
            <p className="text-xs text-surface-300 italic">No role</p>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-surface-500">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-surface-400" />
          <span className="truncate">
            {contact.company || <span className="text-surface-300 italic">No company</span>}
          </span>
        </div>
        {contact.owner && (
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <User className="h-3.5 w-3.5 shrink-0 text-surface-400" />
            <span className="truncate">{contact.owner}</span>
          </div>
        )}
      </div>

      {/* Labels */}
      {contact.labels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {contact.labels.map((label) => (
            <LabelBadge key={label} label={label} />
          ))}
        </div>
      )}
    </button>
  );
}
