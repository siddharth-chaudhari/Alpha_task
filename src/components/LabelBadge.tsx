const labelColors: Record<string, { bg: string; text: string }> = {
  Enterprise: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  'High Priority': { bg: 'bg-rose-50', text: 'text-rose-600' },
  Finance: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  Media: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600' },
  SaaS: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  'Mid-Market': { bg: 'bg-orange-50', text: 'text-orange-600' },
  Healthcare: { bg: 'bg-teal-50', text: 'text-teal-600' },
  EU: { bg: 'bg-blue-50', text: 'text-blue-600' },
  Consulting: { bg: 'bg-purple-50', text: 'text-purple-600' },
  VC: { bg: 'bg-lime-50', text: 'text-lime-700' },
  Startup: { bg: 'bg-amber-50', text: 'text-amber-600' },
  Retail: { bg: 'bg-pink-50', text: 'text-pink-600' },
  'E-Commerce': { bg: 'bg-sky-50', text: 'text-sky-600' },
  Education: { bg: 'bg-violet-50', text: 'text-violet-600' },
};

const defaultLabelColor = { bg: 'bg-surface-100', text: 'text-surface-600' };

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
