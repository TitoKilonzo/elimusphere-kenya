import React from 'react';

interface StrandPathProps {
  /** Ordered labels, e.g. ['Grade 6', 'Science', 'Living Things', 'Plant Nutrition'] */
  steps: string[];
  /** How many leading steps are "complete" (amber). Remaining are muted. */
  activeCount?: number;
  className?: string;
}

/**
 * Signature visual motif: renders the CBC content hierarchy
 * (Grade -> Subject -> Strand -> Sub-strand) as a connected dot-path.
 * Used in the hero, curriculum explorer, and progress views.
 */
export default function StrandPath({ steps, activeCount, className = '' }: StrandPathProps) {
  const active = activeCount ?? steps.length;
  return (
    <div className={`w-full ${className}`}>
      <div className="strand-path">
        {steps.map((_, i) => (
          <React.Fragment key={i}>
            <span className={`strand-node ${i < active ? '' : 'is-muted'}`} />
            {i < steps.length - 1 && <span className={`strand-link ${i + 1 < active ? '' : 'is-muted'}`} />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between mt-1.5 gap-1">
        {steps.map((s, i) => (
          <span
            key={i}
            className={`text-[10px] font-bold uppercase tracking-wide truncate ${
              i < active ? 'text-[var(--elimu-amber-600)]' : 'text-stone-400'
            }`}
            style={{ maxWidth: `${100 / steps.length}%` }}
            title={s}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
