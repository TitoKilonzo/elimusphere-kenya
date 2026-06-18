import React from 'react';
import { CBAFMapping, getCbafBand } from '../../types';

const BAND_STYLES: Record<CBAFMapping['band'], string> = {
  'Exceeding Expectations': 'bg-[var(--elimu-green-50)] text-[var(--elimu-green-600)] border-emerald-200',
  'Meeting Expectations': 'bg-sky-50 text-sky-700 border-sky-200',
  'Approaching Expectations': 'bg-[var(--elimu-amber-50)] text-[var(--elimu-amber-700)] border-[var(--elimu-amber-200)]',
  'Below Expectations': 'bg-red-50 text-red-700 border-red-200',
};

export function CBAFBadge({ score, size = 'sm' }: { score: number; size?: 'sm' | 'md' }) {
  const mapping = getCbafBand(score);
  const sizeClasses = size === 'md' ? 'text-xs px-2.5 py-1' : 'text-[10px] px-2 py-0.5';
  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-full border ${BAND_STYLES[mapping.band]} ${sizeClasses}`}>
      {mapping.subLevel}
      <span className="opacity-60">·</span>
      {mapping.band.split(' ')[0]}
    </span>
  );
}

export function cbafBandColor(score: number): string {
  const band = getCbafBand(score).band;
  switch (band) {
    case 'Exceeding Expectations':
      return 'var(--elimu-green-500)';
    case 'Meeting Expectations':
      return 'var(--elimu-sky-500)';
    case 'Approaching Expectations':
      return 'var(--elimu-amber-500)';
    default:
      return '#DC2626';
  }
}
