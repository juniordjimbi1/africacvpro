import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';

export function ContactPage() {
  return (
    <div className="space-y-8 py-8">
      <SectionTitle title="Contact" hint="Nous écrire" />
      <PageHero
        title="Parlez-nous de votre projet de CV"
        subtitle="Support commandes, questions, corrections : nous répondons rapidement."
      />
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3">
          <div className="text-slate-900 font-semibold">Support</div>
          <p className="text-slate-700">
            Pour toute demande liée aux CV, lettres ou livraisons.
          </p>
          <div className="text-sm text-slate-600">
            <div>Email : <span className="font-medium">support@africacvpro.dev</span></div>
            <div>WhatsApp : <span className="font-medium">à définir (MVP)</span></div>
          </div>
        </Card>

        <Card className="p-6">
          <form
            onSubmit={(e) => { e.preventDefault(); alert('Formulaire MVP — pas encore relié'); }}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm text-slate-600 mb-1">Nom</label>
              <input className="w-full border border-slate-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 rounded-xl px-3 py-2 outline-none transition" placeholder="Votre nom" required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Email</label>
              <input type="email" className="w-full border border-slate-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 rounded-xl px-3 py-2 outline-none transition" placeholder="vous@exemple.com" required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Message</label>
              <textarea className="w-full border border-slate-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 rounded-xl px-3 py-2 h-28 outline-none transition" placeholder="Votre message..." required />
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-4 py-2 transition-colors">
              Envoyer (MVP)
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
