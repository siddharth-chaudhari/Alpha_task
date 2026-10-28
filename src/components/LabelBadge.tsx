const labelColors: Record<string, { bg: string; text: string }> = {
  Enterprise: { bg: 'bg-indigo-50 dark:bg-indigo-950/60', text: 'text-indigo-600 dark:text-indigo-300' },
  'High Priority': { bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-600 dark:text-rose-300' },
  Finance: { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-600 dark:text-emerald-300' },
  Media: { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/60', text: 'text-fuchsia-600 dark:text-fuchsia-300' },
  SaaS: { bg: 'bg-cyan-50 dark:bg-cyan-950/60', text: 'text-cyan-600 dark:text-cyan-300' },
  'Mid-Market': { bg: 'bg-orange-50 dark:bg-orange-950/60', text: 'text-orange-600 dark:text-orange-300' },
  Healthcare: { bg: 'bg-teal-50 dark:bg-teal-950/60', text: 'text-teal-600 dark:text-teal-300' },
  EU: { bg: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-blue-600 dark:text-blue-300' },
  Consulting: { bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-600 dark:text-purple-300' },
  VC: { bg: 'bg-lime-50 dark:bg-lime-950/60', text: 'text-lime-700 dark:text-lime-300' },
  Startup: { bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-600 dark:text-amber-300' },
  Retail: { bg: 'bg-pink-50 dark:bg-pink-950/60', text: 'text-pink-600 dark:text-pink-300' },
  'E-Commerce': { bg: 'bg-sky-50 dark:bg-sky-950/60', text: 'text-sky-600 dark:text-sky-300' },
  Education: { bg: 'bg-violet-50 dark:bg-violet-950/60', text: 'text-violet-600 dark:text-violet-300' },
};

const defaultLabelColor = { bg: 'bg-surface-100 dark:bg-surface-800', text: 'text-surface-600 dark:text-surface-300' };

interface LabelBadgeProps {
  label: string;
}

export default function LabelBadge({ label }: LabelBadgeProps) {
  const color = labelColors[label] ?? defaultLabelColor;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${color.bg} ${color.text}`}
    >
      {label}
    </span>
  );
}
