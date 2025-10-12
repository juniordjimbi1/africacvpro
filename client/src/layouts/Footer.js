import React from 'react';
import { Skeleton } from '../components/ui/Skeleton';

export function Footer() {
  return (
    <footer className="border-t bg-white mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((section) => (
            <div key={section} className="space-y-4">
              <Skeleton w={160} h={20} />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Skeleton key={item} w={140} h={16} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t mt-8 pt-8 text-center text-slate-500 text-sm">
          © 2024 Africacvpro - Tous droits réservés
        </div>
      </div>
    </footer>
  );
}