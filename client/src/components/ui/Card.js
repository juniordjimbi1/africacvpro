import React from 'react';

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 ${className}`}>
      {children}
    </div>
  );
}