import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';

export function PricingPage({ onStart }) {
  const plans = [
    { key: 'AUTO',  name: 'Automatique',   price: '5 000 FCFA',  badge: 'Éco',         highlight: false },
    { key: 'IA',    name: 'Optimisé IA',   price: '12 000 FCFA', badge: 'Best-Seller', highlight: true  },
    { key: 'HUMAN', name: 'Expert Humain', price: '25 000 FCFA', badge: 'Premium',     highlight: false },
  ]
  return (
    <div className="space-y-8 py-8">
      <SectionTitle title="Nos offres" hint="Automatique • Optimisé IA • Expert Humain" />
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card key={index} className={`p-6 ${plan.highlight ? 'ring-2 ring-primary-500' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <span className={`text-xs px-3 py-1 rounded-full ${plan.highlight ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {plan.badge}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-6">{plan.price}</div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-success-500 rounded-full" />
                <Skeleton w={200} h={16} />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-success-500 rounded-full" />
                <Skeleton w={180} h={16} />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-success-500 rounded-full" />
                <Skeleton w={220} h={16} />
              </div>
            </div>
            <button
              className={`${plan.highlight ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} w-full py-3 rounded-lg font-semibold transition-colors`}
              onClick={() => onStart && onStart(plan.key)}
            >
              Choisir l'offre
            </button>
          </Card>
        ))}
      </div>

      <SectionTitle title="Comparatif détaillé" />
      <Card>
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3].map((col) => (
            <div key={col} className="space-y-4">
              {[1,2,3,4,5,6].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-slate-300 rounded" />
                  <Skeleton w={180} h={16} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
