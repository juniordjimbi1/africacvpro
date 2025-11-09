import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';

export function TemplatesPage({ onStart }) {
  return (
    <div className="space-y-6 py-8">
      <SectionTitle title="Modèles de CV compatibles ATS" />
      <div className="flex flex-wrap gap-3 mb-6">
        {['Layout','Langue','Cible','Style','Tags'].map((filter) => (
          <div key={filter} className="flex items-center gap-2 border border-slate-300 rounded-lg px-4 py-2 bg-white">
            <span className="text-sm text-slate-600">{filter}</span>
            <div className="w-4 h-4 bg-slate-300 rounded" />
          </div>
        ))}
        <button className="text-sm px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Réinitialiser</button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((item) => (
          <Card key={item} className="hover:shadow-lg transition-shadow duration-200 p-4">
            <div className="aspect-[210/297] border-2 border-dashed border-slate-300 rounded-lg bg-white mb-4" />
            <div className="space-y-3">
              <Skeleton w={180} h={20} />
              <div className="flex gap-2">
                <Skeleton w={80} h={32} />
                <Skeleton w={80} h={32} />
              </div>
              <button
                className="mt-2 w-full py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                onClick={() => onStart && onStart('classic')}
              >
                Utiliser ce modèle
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
