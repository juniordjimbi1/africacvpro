import React, { useEffect, useState, useRef } from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { cvTemplates } from '../data/cvTemplates';
import { go } from '../utils/nav';
import { buildWhatsappUrl } from '../utils/whatsapp';

export function TemplatesPage() {
  const [offerPickerFor, setOfferPickerFor] = useState(null);
  const scrollAreaRef = useRef(null);
  const [offerPreselected, setOfferPreselected] = useState(false);

  // Au chargement, on vérifie si on doit ouvrir le panneau (flow "Créer mon CV"),
  // ou si une offre a été pré-sélectionnée (flow "Offres").
  useEffect(() => {
    const tpl = localStorage.getItem('africacv_template_id');
    const offer = localStorage.getItem('africacv_offer');
    const shouldOpen = sessionStorage.getItem('africacv_open_offer_on_templates') === '1';
    const preselected = sessionStorage.getItem('africacv_offer_preselected') === '1';

    setOfferPreselected(preselected);

    // Cas 1 : on vient de "Créer mon CV" → pas d’offre, on ouvre le panneau après choix d’un modèle
    if (tpl && !offer && shouldOpen) {
      setOfferPickerFor(tpl);
      sessionStorage.removeItem('africacv_open_offer_on_templates');
    }
  }, []);

  // Lock du scroll de la page quand la modale est ouverte
  useEffect(() => {
    if (!offerPickerFor) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [offerPickerFor]);

  // Gérer le scroll à l’intérieur du panneau (pour éviter que la page derrière scrolle)
  useEffect(() => {
    if (!offerPickerFor || !scrollAreaRef.current) return;
    const el = scrollAreaRef.current;

    const onWheel = (e) => {
      const canDown = el.scrollTop + el.clientHeight < el.scrollHeight;
      const canUp = el.scrollTop > 0;
      const d = e.deltaY;
      if ((d > 0 && canDown) || (d < 0 && canUp)) {
        e.stopPropagation();
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onTouchMove = (e) => {
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;
      if (atTop || atBottom) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        e.stopPropagation();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [offerPickerFor]);

  // Crée un brouillon et retourne les données (sans naviguer)
  const createDraft = async ({ templateId, offer }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ templateId, offer }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Erreur création CV depuis Modèles:', data);
        alert(data?.message || 'Impossible de créer le CV. Connectez-vous puis réessayez.');
        return null;
      }

      if (data?.id) {
        localStorage.setItem('africacv_resume_id', data.id);
      }
      return data;
    } catch (e) {
      console.error('Erreur création CV depuis Modèles:', e);
      alert('Impossible de créer le CV. Connectez-vous puis réessayez.');
      return null;
    }
  };

  const openWhatsappHuman = (payload = {}) => {
    // Forcer le numéro pro pour l’offre humaine
    const url = buildWhatsappUrl(
      { offer: 'human', ...payload },
      { phone: '221770914220' } // numéro WhatsApp cible
    );
    window.open(url, '_blank');
  };

  // Quand on a une offre pré-sélectionnée (depuis Offres),
  // au clic sur un modèle on skip le panneau et on agit directement.
  const handleTemplateWithPreselectedOffer = async (templateId) => {
    const offerUi = localStorage.getItem('africacv_offer'); // 'auto' | 'ai' | 'pro'
    if (!offerUi) {
      // Pas d’offre pré-sélectionnée finalement -> fallback panneau
      setOfferPickerFor(templateId);
      return;
    }

    localStorage.setItem('africacv_template_id', templateId);

    const offer = offerUi === 'pro' ? 'human' : offerUi;

    // Toujours créer un brouillon pour obtenir un resumeId fiable
    const draft = await createDraft({ templateId, offer });
    if (!draft) return;

    const resumeId = draft.id || localStorage.getItem('africacv_resume_id') || '';
    const email = localStorage.getItem('user_email') || '';
    const title = (draft?.title || 'Mon CV') + '.pdf';

    if (offer === 'human') {
      // Offre Professionnelle → WhatsApp direct
      openWhatsappHuman({
        templateId,
        resumeId,
        email,
        title,
      });
      setOfferPickerFor(null);
      return;
    }

    // auto / ai → Éditeur
    setOfferPickerFor(null);
    go('Éditeur CV');
  };

  const chooseOffer = async (offerUi) => {
    const templateId = offerPickerFor;
    if (!templateId) return;

    const offer = offerUi === 'pro' ? 'human' : offerUi;

    localStorage.setItem('africacv_offer', offerUi);

    // Toujours créer un brouillon
    const draft = await createDraft({ templateId, offer });
    if (!draft) return;

    const resumeId = draft.id || localStorage.getItem('africacv_resume_id') || '';
    const email = localStorage.getItem('user_email') || '';
    const title = (draft?.title || 'Mon CV') + '.pdf';

    if (offer === 'human') {
      // Professionnel → WhatsApp direct
      openWhatsappHuman({
        templateId,
        resumeId,
        email,
        title,
      });
      setOfferPickerFor(null);
      return;
    }

    // auto / ai → Éditeur
    setOfferPickerFor(null);
    go('Éditeur CV');
  };

  return (
    <div className="space-y-6 py-8">
      <SectionTitle title="Modèles de CV compatibles ATS" />

      {/* Filtres (placeholder) */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['Layout', 'Langue', 'Cible', 'Style', 'Tags'].map((filter) => (
          <div
            key={filter}
            className="flex items-center gap-2 border border-slate-300 rounded-lg px-4 py-2 bg-white"
          >
            <span className="text-sm text-slate-600">{filter}</span>
            <div className="w-4 h-4 bg-slate-300 rounded" />
          </div>
        ))}
        <button className="text-sm px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          Réinitialiser
        </button>
      </div>

      {/* Grille des modèles */}
      <div className="grid md:grid-cols-3 gap-6">
        {cvTemplates.map((tpl) => {
          const tplId = tpl.id;
          const handleClick = async () => {
            if (offerPreselected && localStorage.getItem('africacv_offer')) {
              await handleTemplateWithPreselectedOffer(tplId);
            } else {
              localStorage.setItem('africacv_template_id', tplId);
              setOfferPickerFor(tplId); // panneau si aucune offre pré-sélectionnée
            }
          };

          return (
            <Card
              key={tplId}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-slate-200"
              onClick={handleClick}
            >
              <div className="mb-4 aspect-[210/297] rounded-lg border border-slate-300 bg-white overflow-hidden shadow-sm">
                {tpl.preview ? (
                  <img
                    src={tpl.preview}
                    alt={tpl.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-slate-50">
                    <Skeleton w={120} h={20} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-900">{tpl.name}</h3>
                  {tpl.category && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {tpl.category}
                    </span>
                  )}
                </div>
                {tpl.description && (
                  <p className="text-sm text-slate-600">{tpl.description}</p>
                )}
              </div>

              {/* Bouton explicite “Choisir ce modèle” */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="w-full rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 transition-colors"
                >
                  Choisir ce modèle
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Panneau d’offre */}
      {offerPickerFor && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overscroll-none"
          aria-modal="true"
          role="dialog"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] bg-white rounded-2xl shadow-xl overflow-hidden"
            style={{ overscrollBehavior: 'contain' }}
          >
            {/* Header sticky */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Choisir une offre</h3>
                <p className="text-sm text-slate-600 -mt-1">
                  Prix visibles ci-dessous — paiement après validation finale sur WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setOfferPickerFor(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Contenu scrollable */}
            <div
              ref={scrollAreaRef}
              className="px-6 pb-6 pt-4 max-h-[calc(90vh-64px)] sm:max-h-[calc(85vh-64px)] overflow-y-auto"
            >
              <div className="grid md:grid-cols-3 gap-4">
                {/* Automatique */}
                <div className="border rounded-xl p-4 bg-slate-50/60">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-slate-900">💨 Automatique</h4>
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-slate-900">2 000 F</div>
                      <div className="text-[11px] text-slate-500">après validation</div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">
                    Vous remplissez un formulaire simple, nous générons un CV propre et modifiable.
                  </p>
                  <ul className="mt-2 text-xs text-slate-600 space-y-1">
                    <li>• Mise en page professionnelle</li>
                    <li>• CV lisible et prêt à imprimer</li>
                    <li>• Export PDF possible</li>
                  </ul>
                  <button
                    onClick={() => chooseOffer('auto')}
                    className="w-full mt-4 py-2.5 rounded-lg font-semibold bg-sky-600 hover:bg-sky-700 text-white"
                  >
                    Choisir Automatique — 2 000 F
                  </button>
                </div>

                {/* Optimisée IA */}
                <div className="border rounded-xl p-4 ring-2 ring-primary-500 shadow bg-sky-50/60">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-slate-900 whitespace-nowrap">
                      🤖 Optimisée IA
                    </h4>
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-primary-700">3 000 F</div>
                      <div className="text-[11px] text-slate-500">après validation</div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">
                    On part de votre CV ou de vos infos, puis l’IA améliore le contenu pour coller au
                    poste visé.
                  </p>
                  <ul className="mt-2 text-xs text-slate-600 space-y-1">
                    <li>• Profil et expériences réécrits</li>
                    <li>• Adaptation au pays et au secteur</li>
                    <li>• Suggestions de mots-clés pour ATS</li>
                  </ul>
                  <button
                    onClick={() => chooseOffer('ai')}
                    className="w-full mt-4 py-2.5 rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white whitespace-nowrap"
                  >
                    Choisir Optimisée IA — 3 000 F
                  </button>
                </div>

                {/* Professionnelle */}
                <div className="border rounded-xl p-4 bg-emerald-50/60 border-emerald-200">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-slate-900">👤 Professionnelle (humaine)</h4>
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-emerald-700">5 000 F</div>
                      <div className="text-[11px] text-slate-500">après validation</div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">
                    Un expert CV s’occupe de tout avec échanges WhatsApp et corrections si besoin.
                  </p>
                  <ul className="mt-2 text-xs text-slate-600 space-y-1">
                    <li>• Réécriture complète du CV</li>
                    <li>• Ajustement au poste et au pays</li>
                    <li>• 1 à 2 allers-retours de correction</li>
                  </ul>
                  <button
                    onClick={() => chooseOffer('pro')}
                    className="w-full mt-4 py-2.5 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Choisir Professionnel — 5 000 F
                  </button>
                </div>
              </div>

              {/* Bas de panneau : lien "En savoir plus" + Annuler */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => {
                    setOfferPickerFor(null);
                    go('Offres');
                  }}
                  className="text-sm text-primary-700 hover:underline"
                >
                  En savoir plus sur les offres
                </button>

                <button
                  onClick={() => setOfferPickerFor(null)}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
