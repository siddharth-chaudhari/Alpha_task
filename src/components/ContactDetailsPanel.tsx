import { useEffect, useRef, useState } from 'react';
import { X, Save, RotateCcw, Tag } from 'lucide-react';
import type { Contact, Stage } from '../types/contact';
import StageBadge from './StageBadge';

const STAGES: Stage[] = ['Lead', 'Prospect', 'Qualified', 'Customer'];

interface ContactDetailsPanelProps {
  contact: Contact;
  onSave: (updated: Contact) => void;
  onClose: () => void;
}

export default function ContactDetailsPanel({
  contact,
  onSave,
  onClose,
}: ContactDetailsPanelProps) {
  const [draft, setDraft] = useState<Contact>({ ...contact, labels: [...contact.labels] });
  const [labelInput, setLabelInput] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset draft when a different contact is selected
  useEffect(() => {
    setDraft({ ...contact, labels: [...contact.labels] });
    setLabelInput('');
  }, [contact]);

  // Focus trap: focus the panel when it opens
  useEffect(() => {
    panelRef.current?.focus();
  }, [contact.id]);

  const hasChanges =
    draft.name !== contact.name ||
    draft.email !== contact.email ||
    draft.company !== contact.company ||
    draft.role !== contact.role ||
    draft.owner !== contact.owner ||
    draft.stage !== contact.stage ||
    draft.notes !== contact.notes ||
    JSON.stringify(draft.labels) !== JSON.stringify(contact.labels);

  const handleSave = () => {
    if (!draft.name.trim()) return;
    onSave({ ...draft, name: draft.name.trim() });
  };

  const handleCancel = () => {
    setDraft({ ...contact, labels: [...contact.labels] });
    setLabelInput('');
  };

  const handleAddLabel = () => {
    const trimmed = labelInput.trim();
    if (trimmed && !draft.labels.includes(trimmed)) {
      setDraft((prev) => ({ ...prev, labels: [...prev.labels, trimmed] }));
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (label: string) => {
    setDraft((prev) => ({
      ...prev,
      labels: prev.labels.filter((l) => l !== label),
    }));
  };

  const handleKeyDownLabel = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLabel();
    }
  };

  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      className="flex h-full flex-col border-l border-surface-200 bg-white outline-none"
      role="dialog"
      aria-label={`Details for ${contact.name}`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-surface-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-semibold text-white shadow-sm">
            {initials}
          </div>
          <div>
            <h2 className="text-base font-semibold text-surface-900">{contact.name}</h2>
            <p className="text-xs text-surface-400">
              {contact.role || 'No role'} {contact.company ? `at ${contact.company}` : ''}
            </p>
          </div>
        </div>
        <button
          id="close-panel-btn"
          onClick={onClose}
          aria-label="Close details panel"
          className="focus-ring rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="detail-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400">
              Name
            </label>
            <input
              id="detail-name"
              type="text"
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              className="focus-ring w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 transition-colors focus:bg-white focus:border-primary-300"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="detail-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400">
              Email
            </label>
            <input
              id="detail-email"
              type="email"
              value={draft.email}
              onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              className="focus-ring w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 transition-colors focus:bg-white focus:border-primary-300"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="detail-company" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400">
              Company
            </label>
            <input
              id="detail-company"
              type="text"
              value={draft.company}
              onChange={(e) => setDraft((prev) => ({ ...prev, company: e.target.value }))}
              placeholder="Enter company name"
              className="focus-ring w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 transition-colors focus:bg-white focus:border-primary-300"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="detail-role" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400">
              Role
            </label>
            <input
              id="detail-role"
              type="text"
              value={draft.role}
              onChange={(e) => setDraft((prev) => ({ ...prev, role: e.target.value }))}
              placeholder="Enter role"
              className="focus-ring w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 transition-colors focus:bg-white focus:border-primary-300"
            />
          </div>

          {/* Owner */}
          <div>
            <label htmlFor="detail-owner" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400">
              Owner
            </label>
            <input
              id="detail-owner"
              type="text"
              value={draft.owner}
              onChange={(e) => setDraft((prev) => ({ ...prev, owner: e.target.value }))}
              placeholder="Assign an owner"
              className="focus-ring w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 transition-colors focus:bg-white focus:border-primary-300"
            />
          </div>

          {/* Stage */}
          <div>
            <label htmlFor="detail-stage" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400">
              Stage
            </label>
            <div className="flex items-center gap-3">
              <select
                id="detail-stage"
                value={draft.stage}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, stage: e.target.value as Stage }))
                }
                className="focus-ring flex-1 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 transition-colors focus:bg-white focus:border-primary-300"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <StageBadge stage={draft.stage} size="md" />
            </div>
          </div>

          {/* Labels */}
          <div>
            <label htmlFor="detail-labels" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400">
              Labels
            </label>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {draft.labels.length > 0 ? (
                draft.labels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700"
                  >
                    <Tag className="h-3 w-3" />
                    {label}
                    <button
                      onClick={() => handleRemoveLabel(label)}
                      aria-label={`Remove label ${label}`}
                      className="ml-0.5 rounded p-0.5 text-primary-400 transition-colors hover:bg-primary-100 hover:text-primary-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-surface-300 italic">No labels</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                id="detail-labels"
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={handleKeyDownLabel}
                placeholder="Type and press Enter"
                className="focus-ring flex-1 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 transition-colors focus:bg-white focus:border-primary-300"
              />
              <button
                onClick={handleAddLabel}
                disabled={!labelInput.trim()}
                className="focus-ring rounded-lg border border-surface-200 px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="detail-notes" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400">
              Notes
            </label>
            <textarea
              id="detail-notes"
              value={draft.notes}
              onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
              rows={5}
              placeholder="Add notes about this contact…"
              className="focus-ring w-full resize-y rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 transition-colors focus:bg-white focus:border-primary-300"
            />
          </div>
        </div>
      </div>

      {/* Panel Footer */}
      <div className="border-t border-surface-100 bg-surface-50/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            id="save-contact-btn"
            onClick={handleSave}
            disabled={!hasChanges || !draft.name.trim()}
            className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 active:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
          <button
            id="cancel-contact-btn"
            onClick={handleCancel}
            disabled={!hasChanges}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-600 shadow-sm transition-colors hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
