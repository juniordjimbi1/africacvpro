import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { go } from '../utils/nav';
import { buildWhatsappUrl } from '../utils/whatsapp';

export function PricingPage() {
  const handleChoose = async (planName) => {
    const offer = planName === 'Optimisé IA' ? 'ai' : (planName === 'Expert Humain' ? 'human' : 'auto');
    localStorage.setItem('africacv_offer', offer);
    const templateId = localStorage.getItem('africacv_template_id');
    if (!templateId) {
      go('Modèles');
      return;
    }
    if (offer === 'human') {
      const resumeId = localStorage.getItem('africacv_resume_id');
      const email = localStorage.getItem('user_email');
      const url = buildWhatsappUrl({ offer, templateId, resumeId, email });
      window.open(url, '_blank');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ templateId, offer })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erreur création CV');
      localStorage.setItem('africacv_resume_id', data.id);
     onGoEditorSmart ? onGoEditorSmart() : go('Éditeur CV');

    } catch (e) {
      console.error('Erreur création CV depuis Tarifs:', e);
      alert('Impossible de créer le CV. Connectez-vous puis réessayez.');
    }
  };

  return (
    <div className="space-y-8 py-8">
      <SectionTitle title="Nos offres" hint="Automatique • Optimisé IA • Expert Humain" />
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Automatique", price: "5 000 FCFA", badge: "Éco", highlight: false },
          { name: "Optimisé IA", price: "12 000 FCFA", badge: "Best-Seller", highlight: true },
          { name: "Expert Humain", price: "25 000 FCFA", badge: "Premium", highlight: false },
        ].map((plan, index) => (
          <Card key={index} className={`p-6 ${plan.highlight ? 'ring-2 ring-primary-500' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <span className={`text-xs px-3 py-1 rounded-full ${
                plan.highlight ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
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
              onClick={() => handleChoose(plan.name)}
              className={`w-full py-3 rounded-lg font-semibold ${
                plan.highlight ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              } transition-colors`}
            >
              Choisir l'offre
            </button>
          </Card>
        ))}
      </div>

      {/* … (comparatif etc. inchangés) */}
    </div>
  );
}
