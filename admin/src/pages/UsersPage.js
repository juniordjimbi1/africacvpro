import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '../components/ui/Section';
import { Sk } from '../components/ui/Sk';

function TableSkeleton({ rows = 6, cols = 6 }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-slate-500 bg-slate-50">
          <tr>
            {Array.from({ length: cols }).map((_, c) => (
              <th key={c} className="text-left py-3 px-4 border-b">
                <Sk w={100} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <motion.tr 
              key={r} 
              className="border-b hover:bg-slate-50 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: r * 0.05 }}
            >
              {Array.from({ length: cols }).map((__, c) => (
                <td key={c} className="py-3 px-4">
                  <Sk w={c % 2 === 0 ? 120 : 80} />
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UsersPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Section title="Utilisateurs" hint="Liste, recherche, statuts" />
      
      <div className="flex flex-wrap gap-3 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Sk w={240} h={40} />
        </motion.div>
        {["Tous", "Actifs", "Inactifs"].map((filter, index) => (
          <motion.div 
            key={filter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sk w={100} h={40} />
          </motion.div>
        ))}
      </div>
      
      <div className="admin-card p-4">
        <TableSkeleton rows={8} cols={7} />
      </div>
    </motion.div>
  );
}