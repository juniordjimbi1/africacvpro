import { motion } from 'framer-motion';
import React from 'react';

export function HoverCard({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}