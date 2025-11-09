import React from 'react';
import { motion } from 'framer-motion';

export function PageHero({ title, subtitle, icon = null, children }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* gradient décoratif */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-sky-50" />
      <div className="relative p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-start gap-4"
        >
          {icon ? (
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700 ring-1 ring-primary-200">
              {icon}
            </div>
          ) : null}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary-700 to-sky-600">
                {title}
              </span>
            </h1>
            {subtitle ? (
              <p className="mt-2 text-slate-600 max-w-3xl">{subtitle}</p>
            ) : null}
          </div>
        </motion.div>

        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
}
