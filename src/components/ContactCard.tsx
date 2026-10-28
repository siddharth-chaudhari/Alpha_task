import { useRef, useState } from 'react';
import { Building2, User, GripVertical } from 'lucide-react';
import type { Contact } from '../types/contact';
import LabelBadge from './LabelBadge';

interface ContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
  onDragStart?: (contactId: string) => void;
  onDragEnd?: () => void;
}

export default function ContactCard({
  contact,
  isSelected,
  onClick,
  onDragStart,
  onDragEnd,
}: ContactCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragJustEnded = useRef(false);

  const initials =
    contact.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', contact.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    onDragStart?.(contact.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    dragJustEnded.current = true;
    onDragEnd?.();
    setTimeout(() => {
      dragJustEnded.current = false;
    }, 150);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (dragJustEnded.current) {
      e.preventDefault();
      return;
    }
    onClick();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open details for ${contact.name || 'Unnamed contact'}`}
      className={`focus-ring group relative w-full cursor-grab active:cursor-grabbing rounded-xl border p-4 text-left transition-all duration-150 hover:shadow-md ${
        isDragging
          ? 'opacity-40 scale-[0.98] border-dashed border-primary-400 dark:border-primary-500 shadow-none'
          : isSelected
          ? 'border-primary-300 shadow-md ring-1 ring-primary-200 dark:border-primary-500 dark:ring-primary-950/60 bg-white dark:bg-surface-900'
          : 'border-surface-200 bg-white hover:border-surface-300 dark:border-surface-800 dark:bg-surface-900 dark:hover:border-surface-700'
      }`}
    >
      {/* Contact Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-semibold text-white shadow-xs">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-surface-900 dark:text-surface-100">
            {contact.name || <span className="text-surface-400 dark:text-surface-500 italic">Unnamed Contact</span>}
          </p>
          {contact.role ? (
            <p className="truncate text-xs text-surface-400 dark:text-surface-500">{contact.role}</p>
          ) : (
            <p className="text-xs text-surface-300 dark:text-surface-600 italic">No role</p>
          )}
        </div>
        <div className="text-surface-300 group-hover:text-surface-500 dark:text-surface-600 dark:group-hover:text-surface-400 transition-colors">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-surface-400 dark:text-surface-500" />
          <span className="truncate">
            {contact.company || <span className="text-surface-300 dark:text-surface-600 italic">No company</span>}
          </span>
        </div>
        {contact.owner && (
          <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
            <User className="h-3.5 w-3.5 shrink-0 text-surface-400 dark:text-surface-500" />
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
    </div>
  );
}
