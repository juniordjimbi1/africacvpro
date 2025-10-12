import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '../components/ui/Section';
import { Sk } from '../components/ui/Sk';
import { StaggerChildren } from '../components/animations/StaggerChildren';

function KPIs() {
  const items = [
    { label: "Inscrits total", value: "1,247", change: "+12%" },
    { label: "Connectés maintenant", value: "43", change: "+5%" },
    { label: "Aperçus aujourd'hui", value: "287", change: "+23%" },
    { label: "Clics WhatsApp", value: "89", change: "+18%" },
    { label: "Paiements confirmés", value: "34", change: "+8%" },
  ];

  return (
    <StaggerChildren className="grid md:grid-cols-5 gap-4 mb-8">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="admin-card p-4"
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-xs text-slate-500 mb-2">{item.label}</div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-slate-900">{item.value}</div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              item.change.startsWith('+') 
                ? 'bg-success-100 text-success-700' 
                : 'bg-warning-100 text-warning-700'
            }`}>
              {item.change}
            </div>
          </div>
        </motion.div>
      ))}
    </StaggerChildren>
  );
}

function SimpleChart({ title }) {
  return (
    <motion.div 
      className="h-48 border border-dashed border-slate-300 rounded-lg grid place-items-center text-slate-400 bg-slate-50/50"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {title}
    </motion.div>
  );
}

export function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Section title="Tableau de bord" hint="Vue d'ensemble en temps réel" />
      
      <KPIs />
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="admin-card p-4">
          <Section title="Trafic 7j" />
          <SimpleChart title="Graphique trafic (visites/jour)" />
        </div>
        
        <div className="admin-card p-4">
          <Section title="Funnel de conversion" hint="Visite → Aperçu → WhatsApp → Payé" />
          <SimpleChart title="Funnel de conversion (%)" />
        </div>
        
        <div className="admin-card p-4">
          <Section title="Top modèles" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <motion.div 
                key={item}
                className="flex items-center justify-between py-2 border-b last:border-0"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Sk w={120} />
                <Sk w={60} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}