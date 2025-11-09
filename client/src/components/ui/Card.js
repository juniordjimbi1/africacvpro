import React from 'react';

export function Card({ as: Comp = 'div', className = '', children }) {
  return (
    <Comp
      className={[
        'relative bg-white/80 backdrop-blur border border-slate-200',
        'rounded-2xl shadow-sm hover:shadow-md transition-all duration-200',
        'hover:-translate-y-0.5',
        className,
      ].join(' ')}
    >
      {/* décor subtil */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30" />
      {children}
    </Comp>
  );
}
