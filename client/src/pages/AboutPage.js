import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';

export function AboutPage() {
  return (
    <div className="py-8">
      <SectionTitle title="About" />
      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Page About en construction</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Cette section est en cours de développement. Elle sera bientôt disponible avec toutes les fonctionnalités prévues.
          </p>
        </div>
      </Card>
    </div>
  );
}
