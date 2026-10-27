import type { Stage } from '../types/contact';

const stageConfig: Record<Stage, { bg: string; text: string; dot: string }> = {
  Lead: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  Prospect: {
    bg: 'bg-sky-50 border-sky-200',
    text: 'text-sky-700',
    dot: 'bg-sky-400',
  },
  Qualified: {
    bg: 'bg-violet-50 border-violet-200',
    text: 'text-violet-700',
    dot: 'bg-violet-400',
  },
  Customer: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-400',
  },
};

interface StageBadgeProps {
  stage: Stage;
  size?: 'sm' | 'md';
}

export default function StageBadge({ stage, size = 'sm' }: StageBadgeProps) {
  const config = stageConfig[stage];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 font-medium whitespace-nowrap ${
        config.bg
      } ${config.text} ${size === 'sm' ? 'py-0.5 text-xs' : 'py-1 text-sm'}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {stage}
    </span>
  );
}
