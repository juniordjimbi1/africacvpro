import React from 'react';

export function SectionTitle({ title, hint }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
        {hint && <span className="text-sm text-slate-500">{hint}</span>}
      </div>
      <div className="h-1 mt-3 w-20 bg-primary-500 rounded" />
    </div>
  );
}