import React from 'react';

export function Sk({ w = 200, h = 16, className = "" }) {
  return (
    <div
      className={`bg-slate-200 rounded animate-pulse ${className}`}
      style={{ width: w, height: h }}
    />
  );
}