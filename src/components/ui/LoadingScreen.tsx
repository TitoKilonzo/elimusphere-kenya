import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function LoadingScreen({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
      <div className="w-14 h-14 bg-[var(--elimu-amber-500)] rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
        <GraduationCap className="w-7 h-7 text-white" />
      </div>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="w-2 h-2 bg-[var(--elimu-amber-500)] rounded-full animate-bounce" />
        <span className="w-2 h-2 bg-[var(--elimu-amber-500)] rounded-full animate-bounce [animation-delay:0.15s]" />
        <span className="w-2 h-2 bg-[var(--elimu-amber-500)] rounded-full animate-bounce [animation-delay:0.3s]" />
        <span className="ml-2">{label}</span>
      </div>
    </div>
  );
}
