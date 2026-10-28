import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Save, RotateCcw, Tag } from 'lucide-react';
import type { Contact, Stage } from '../types/contact';
import StageBadge from './StageBadge';
import ConfirmDiscardDialog from './ConfirmDiscardDialog';

const STAGES: Stage[] = ['Lead', 'Prospect', 'Qualified', 'Customer'];
const DEFAULT_WIDTH = 420;
const MIN_WIDTH = 320;

interface ContactDetailsPanelProps {
  contact: Contact;
  onSave: (updated: Contact) => void;
  onClose: () => void;
  onError?: (message: string) => void;
}

export default function ContactDetailsPanel({
  contact,
  onSave,
  onClose,
  onError,
}: ContactDetailsPanelProps) {
  const [draft, setDraft] = useState<Contact>({ ...contact, labels: [...contact.labels] });
  const [labelInput, setLabelInput] = useState('');
  const [prevContact, setPrevContact] = useState<Contact>(contact);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);

  // Drawer width state with localStorage persistence
  const [drawerWidth, setDrawerWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('alpha_crm_drawer_width');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= MIN_WIDTH) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_WIDTH;
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);

  // Synchronize draft if contact prop updates externally
  if (contact !== prevContact) {
    setPrevContact(contact);
    setDraft({ ...contact, labels: [...contact.labels] });
    setLabelInput('');
  }

  // Calculate maximum allowed width based on current window size
  const getMaxWidth = useCallback(() => {
    return Math.max(MIN_WIDTH, Math.min(720, window.innerWidth - 80));
  }, []);

  // Animate drawer entrance on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    panelRef.current?.focus();
    return () => cancelAnimationFrame(frame);
  }, []);

  const hasChanges =
    draft.name !== contact.name ||
    draft.email !== contact.email ||
    draft.company !== contact.company ||
    draft.role !== contact.role ||
    draft.owner !== contact.owner ||
    draft.stage !== contact.stage ||
    draft.notes !== contact.notes ||
    JSON.stringify(draft.labels) !== JSON.stringify(contact.labels);

  // Initiate animated close
  const startClosing = useCallback(() => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  // Safe close request (triggers confirmation if draft is dirty)
  const handleRequestClose = useCallback(() => {
    if (hasChanges) {
      setShowConfirmDiscard(true);
    } else {
      startClosing();
    }
  }, [hasChanges, startClosing]);

  // Handle Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleRequestClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRequestClose]);

  const handleSave = () => {
    const trimmedName = draft.name.trim();
    if (!trimmedName) {
      onError?.('Contact name cannot be empty.');
      return;
    }
    const updated = { ...draft, name: trimmedName };
    setDraft(updated);
    onSave(updated);
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

  // ── Resizing handlers ──────────────────────────────────────────────
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const maxWidth = getMaxWidth();
      const calculatedWidth = window.innerWidth - moveEvent.clientX;
      const clampedWidth = Math.min(maxWidth, Math.max(MIN_WIDTH, calculatedWidth));
      setDrawerWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      try {
        setDrawerWidth((w) => {
          localStorage.setItem('alpha_crm_drawer_width', String(w));
          return w;
        });
      } catch {}
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleKeyDownResize = (e: React.KeyboardEvent) => {
    const maxWidth = getMaxWidth();
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setDrawerWidth((prev) => {
        const next = Math.min(maxWidth, prev + 24);
        try {
          localStorage.setItem('alpha_crm_drawer_width', String(next));
        } catch {}
        return next;
      });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setDrawerWidth((prev) => {
        const next = Math.max(MIN_WIDTH, prev - 24);
        try {
          localStorage.setItem('alpha_crm_drawer_width', String(next));
        } catch {}
        return next;
      });
    }
  };

  const initials =
    contact.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';

  const clampedWidth = Math.min(getMaxWidth(), Math.max(MIN_WIDTH, drawerWidth));

  return (
    <>
      {/* Dimmed Backdrop for Outside-Click Closing & Interaction Protection */}
      <div
        onClick={handleRequestClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/25 dark:bg-black/55 backdrop-blur-xs transition-opacity duration-200 motion-reduce:transition-none ${
          isVisible && !isClosing ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Resizable Animated Drawer */}
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Details for ${contact.name || 'contact'}`}
        style={{
          width: undefined, // width handled via style on desktop
        }}
        className={`fixed top-0 right-0 z-40 flex h-full flex-col border-l border-surface-200 bg-white shadow-2xl outline-none transition-transform duration-200 ease-out motion-reduce:transition-none dark:border-surface-800 dark:bg-surface-900 w-full sm:w-[var(--drawer-width)] ${
          isVisible && !isClosing ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Inline CSS variable for smooth responsive width */}
        <div
          style={
            {
              '--drawer-width': `${clampedWidth}px`,
            } as React.CSSProperties
          }
          className="contents"
        >
          {/* Subtle Desktop Resize Handle along Left Edge */}
          <div
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label="Resize details panel"
            aria-valuenow={clampedWidth}
            aria-valuemin={MIN_WIDTH}
            aria-valuemax={getMaxWidth()}
            onMouseDown={handleMouseDownResize}
            onKeyDown={handleKeyDownResize}
            className="group absolute left-0 top-0 bottom-0 z-20 hidden w-3 -translate-x-1.5 cursor-col-resize items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:flex"
            title="Drag horizontally to resize (or use Left/Right arrow keys)"
          >
            <div className="h-10 w-1 rounded-full bg-surface-300 transition-colors group-hover:bg-primary-500 group-focus-visible:bg-primary-500 dark:bg-surface-700 dark:group-hover:bg-primary-400" />
          </div>

          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-surface-100 px-6 py-4 dark:border-surface-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-sm font-semibold text-white shadow-xs">
                {initials}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-surface-900 dark:text-surface-100">
                  {contact.name || 'Unnamed Contact'}
                </h2>
                <p className="truncate text-xs text-surface-400 dark:text-surface-500">
                  {contact.role || 'No role'} {contact.company ? `at ${contact.company}` : ''}
                </p>
              </div>
            </div>
            <button
              id="close-panel-btn"
              type="button"
              onClick={handleRequestClose}
              aria-label="Close details panel"
              className="focus-ring rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="detail-name"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-400"
                >
                  Name
                </label>
                <input
                  id="detail-name"
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  className="focus-ring w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 transition-colors focus:border-primary-300 focus:bg-white dark:border-surface-700 dark:bg-surface-800/80 dark:text-surface-100 dark:placeholder:text-surface-500 dark:focus:border-primary-500 dark:focus:bg-surface-800"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="detail-email"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-400"
                >
                  Email
                </label>
                <input
                  id="detail-email"
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className="focus-ring w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 transition-colors focus:border-primary-300 focus:bg-white dark:border-surface-700 dark:bg-surface-800/80 dark:text-surface-100 dark:placeholder:text-surface-500 dark:focus:border-primary-500 dark:focus:bg-surface-800"
                />
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="detail-company"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-400"
                >
                  Company
                </label>
                <input
                  id="detail-company"
                  type="text"
                  value={draft.company}
                  onChange={(e) => setDraft((prev) => ({ ...prev, company: e.target.value }))}
                  placeholder="Enter company name"
                  className="focus-ring w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 transition-colors focus:border-primary-300 focus:bg-white dark:border-surface-700 dark:bg-surface-800/80 dark:text-surface-100 dark:placeholder:text-surface-500 dark:focus:border-primary-500 dark:focus:bg-surface-800"
                />
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="detail-role"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-400"
                >
                  Role
                </label>
                <input
                  id="detail-role"
                  type="text"
                  value={draft.role}
                  onChange={(e) => setDraft((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder="Enter role"
                  className="focus-ring w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 transition-colors focus:border-primary-300 focus:bg-white dark:border-surface-700 dark:bg-surface-800/80 dark:text-surface-100 dark:placeholder:text-surface-500 dark:focus:border-primary-500 dark:focus:bg-surface-800"
                />
              </div>

              {/* Owner */}
              <div>
                <label
                  htmlFor="detail-owner"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-400"
                >
                  Owner
                </label>
                <input
                  id="detail-owner"
                  type="text"
                  value={draft.owner}
                  onChange={(e) => setDraft((prev) => ({ ...prev, owner: e.target.value }))}
                  placeholder="Assign an owner"
                  className="focus-ring w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 transition-colors focus:border-primary-300 focus:bg-white dark:border-surface-700 dark:bg-surface-800/80 dark:text-surface-100 dark:placeholder:text-surface-500 dark:focus:border-primary-500 dark:focus:bg-surface-800"
                />
              </div>

              {/* Stage */}
              <div>
                <label
                  htmlFor="detail-stage"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-400"
                >
                  Stage
                </label>
                <div className="flex items-center gap-3">
                  <select
                    id="detail-stage"
                    value={draft.stage}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, stage: e.target.value as Stage }))
                    }
                    className="focus-ring flex-1 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 transition-colors focus:border-primary-300 focus:bg-white dark:border-surface-700 dark:bg-surface-800/80 dark:text-surface-100 dark:focus:border-primary-500 dark:focus:bg-surface-800"
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
                <label
                  htmlFor="detail-labels"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-400"
                >
                  Labels
                </label>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {draft.labels.length > 0 ? (
                    draft.labels.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-950/60 dark:text-primary-300"
                      >
                        <Tag className="h-3 w-3" />
                        {label}
                        <button
                          type="button"
                          onClick={() => handleRemoveLabel(label)}
                          aria-label={`Remove label ${label}`}
                          className="ml-0.5 rounded p-0.5 text-primary-400 transition-colors hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/60 dark:hover:text-primary-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-surface-300 dark:text-surface-600 italic">
                      No labels
                    </span>
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
                    className="focus-ring flex-1 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 transition-colors focus:border-primary-300 focus:bg-white dark:border-surface-700 dark:bg-surface-800/80 dark:text-surface-100 dark:placeholder:text-surface-500 dark:focus:border-primary-500 dark:focus:bg-surface-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddLabel}
                    disabled={!labelInput.trim()}
                    className="focus-ring rounded-lg border border-surface-200 px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="detail-notes"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-400"
                >
                  Notes
                </label>
                <textarea
                  id="detail-notes"
                  value={draft.notes}
                  onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={5}
                  placeholder="Add notes about this contact…"
                  className="focus-ring w-full resize-y rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-800 placeholder:text-surface-300 transition-colors focus:border-primary-300 focus:bg-white dark:border-surface-700 dark:bg-surface-800/80 dark:text-surface-100 dark:placeholder:text-surface-500 dark:focus:border-primary-500 dark:focus:bg-surface-800"
                />
              </div>
            </div>
          </div>

          {/* Panel Footer */}
          <div className="border-t border-surface-100 bg-surface-50/50 px-6 py-4 dark:border-surface-800 dark:bg-surface-900/60">
            <div className="flex items-center gap-3">
              <button
                id="save-contact-btn"
                type="button"
                onClick={handleSave}
                disabled={!hasChanges}
                className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-primary-700 active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
              <button
                id="cancel-contact-btn"
                type="button"
                onClick={handleCancel}
                disabled={!hasChanges}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-600 shadow-xs transition-colors hover:bg-surface-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700"
              >
                <RotateCcw className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Confirmation Dialog on Unsaved Changes */}
      <ConfirmDiscardDialog
        isOpen={showConfirmDiscard}
        onKeepEditing={() => setShowConfirmDiscard(false)}
        onDiscard={() => {
          setShowConfirmDiscard(false);
          startClosing();
        }}
      />
    </>
  );
}
