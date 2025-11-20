import React, { useMemo, useState, useEffect, useRef } from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';
import { buildLetterWhatsappUrl } from '../utils/whatsapp';

const LETTER_TEMPLATES = [
  {
    id: 'classic',
    name: 'Classique',
    description: 'Structure traditionnelle, idéale pour les candidatures formelles.',
  },
  {
    id: 'modern',
    name: 'Moderne',
    description: 'Mise en page aérée, parfaite pour les entreprises dynamiques.',
  },
  {
    id: 'compact',
    name: 'Compacte',
    description: 'Lettre courte et directe, adaptée aux candidatures rapides.',
  },
];

const LETTER_OFFERS = [
  {
    id: 'auto',
    title: 'Automatique',
    price: '1000 F',
    highlight: 'Génération rapide',
    description:
      'Génération rapide à partir d’un ancien CV / lettre ou d’un formulaire simple. Texte modifiable après coup.',
  },
  {
    id: 'ai',
    title: 'Automatique optimisée IA',
    price: '1500 F',
    highlight: 'Adaptée au poste',
    description:
      'Questions ciblées pour adapter la lettre au poste, au secteur et améliorer les formulations.',
  },
  {
    id: 'human',
    title: 'Professionnelle (humaine)',
    price: '2000 F',
    highlight: 'Rédaction par un pro',
    description:
      'Lettre rédigée par un professionnel, personnalisée selon l’offre, livraison en moins de 24h avec 1 à 2 corrections possibles.',
  },
];

const STEP_MODEL = 'model';
const STEP_OFFER = 'offer';
const STEP_EDITOR = 'editor';

export function LetterPage() {
  const [step, setStep] = useState(STEP_MODEL);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  const [form, setForm] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderCity: '',
    date: '',
    recipientCompany: '',
    recipientContact: '',
    recipientAddress: '',
    subject: '',
    body: '',
    signatureName: '',
  });

  const [closingMode, setClosingMode] = useState('default');
  const [closingCustom, setClosingCustom] = useState('');
  const [attachedFile, setAttachedFile] = useState(null); // ancien fichier (CV / lettre)

  const contentRef = useRef(null);

  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // À l’arrivée sur la page, on scrolle directement vers la zone d’action
  useEffect(() => {
    scrollToContent();
  }, []);

  // Remplir automatiquement la signature si vide quand on tape le nom expéditeur
  useEffect(() => {
    setForm((prev) => {
      if (!prev.senderName) return prev;
      if (prev.signatureName) return prev;
      return { ...prev, signatureName: prev.senderName };
    });
  }, [form.senderName]);

  const go = (page) =>
    window.dispatchEvent(new CustomEvent('app:navigate', { detail: { page } }));

  const selectedTemplate = useMemo(
    () => LETTER_TEMPLATES.find((t) => t.id === selectedTemplateId) || null,
    [selectedTemplateId]
  );

  const selectedOffer = useMemo(
    () => LETTER_OFFERS.find((o) => o.id === selectedOfferId) || null,
    [selectedOfferId]
  );

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setAttachedFile(file);
    // Pour l’instant MVP : on stocke juste le fichier côté UI, pas d’envoi backend.
  };

  const canSendWhatsapp =
    selectedTemplate &&
    selectedOffer &&
    form.body.trim().length > 0 &&
    (form.signatureName || '').trim().length > 0;

  const handleOpenWhatsapp = () => {
    if (!canSendWhatsapp) return;

    const url = buildLetterWhatsappUrl({
      offer: selectedOffer.id,
      templateId: selectedTemplate.id,
      fullName: form.signatureName || form.senderName,
      email: form.senderEmail,
      jobTitle: form.subject,
      company: form.recipientCompany,
      // Le fichier joint sera géré plus tard côté IA / backend
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectTemplate = (id) => {
    setSelectedTemplateId(id);
    setStep(STEP_OFFER);
    scrollToContent();
  };

  const handleSelectOffer = (id) => {
    setSelectedOfferId(id);
    setStep(STEP_EDITOR);
    scrollToContent();
  };

  const buildClosingSentence = () => {
    const civility = form.recipientContact || 'Madame, Monsieur';

    if (closingMode === 'custom' && closingCustom.trim()) {
      return closingCustom;
    }

    switch (closingMode) {
      case 'alt1':
        return `Je vous prie d’agréer, ${civility}, l’expression de ma considération distinguée.`;
      case 'alt2':
        return `Veuillez recevoir, ${civility}, l’assurance de ma parfaite considération.`;
      case 'default':
      default:
        return `Veuillez agréer, ${civility}, l’expression de mes salutations distinguées.`;
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: STEP_MODEL, label: 'Modèle' },
      { id: STEP_OFFER, label: 'Offre' },
      { id: STEP_EDITOR, label: 'Éditeur' },
    ];

    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-xs">
        {steps.map((s, index) => {
          const isActive = step === s.id;
          const isDone =
            (step === STEP_OFFER && s.id === STEP_MODEL) ||
            (step === STEP_EDITOR &&
              (s.id === STEP_MODEL || s.id === STEP_OFFER));
          return (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={[
                  'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors',
                  isActive
                    ? 'bg-sky-600 text-white'
                    : isDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-700',
                ].join(' ')}
              >
                {index + 1}
              </div>
              <span
                className={[
                  'font-medium transition-colors',
                  isActive
                    ? 'text-sky-700'
                    : isDone
                    ? 'text-emerald-600'
                    : 'text-slate-500',
                ].join(' ')}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderModelsStep = () => (
    <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
      <h2 className="text-base font-semibold uppercase tracking-wide text-sky-700">
        1. Choisissez un modèle de lettre
      </h2>
      <p className="text-sm text-slate-600">
        Le style visuel de la lettre restera discret (on met surtout l’accent sur le contenu), mais
        le ton et la structure peuvent être plus classiques ou plus modernes selon votre besoin.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {LETTER_TEMPLATES.map((tpl) => {
          const active = tpl.id === selectedTemplateId;
          return (
            <Card
              key={tpl.id}
              className={
                'flex flex-col justify-between p-4 ring-1 transition-all duration-200 ease-out transform hover:-translate-y-0.5 hover:shadow-md ' +
                (active ? 'ring-sky-500 shadow-md' : 'ring-slate-200')
              }
            >
              <div>
                <div className="text-base font-semibold text-slate-900">{tpl.name}</div>
                <p className="mt-1 text-sm text-slate-600">{tpl.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectTemplate(tpl.id)}
                className={
                  'mt-4 rounded-lg px-3 py-1.5 text-sm font-semibold transition ' +
                  (active
                    ? 'bg-sky-600 text-white hover:bg-sky-700'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200')
                }
              >
                {active ? 'Modèle sélectionné' : 'Utiliser ce modèle'}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderOffersStep = () => (
    <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold uppercase tracking-wide text-sky-700">
          2. Choisissez une offre pour la lettre
        </h2>
        <button
          type="button"
          onClick={() => {
            setStep(STEP_MODEL);
            scrollToContent();
          }}
          className="text-xs font-semibold text-sky-700 hover:text-sky-900"
        >
          ⟵ Revenir aux modèles
        </button>
      </div>
      <p className="text-sm text-slate-600">
        Vous ne payez qu’après validation de la lettre. Choisissez le niveau d’accompagnement qui
        vous convient.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {LETTER_OFFERS.map((offer) => {
          const active = offer.id === selectedOfferId;
          return (
            <Card
              key={offer.id}
              className={
                'flex flex-col justify-between p-4 ring-1 transition-all duration-200 ease-out transform hover:-translate-y-0.5 hover:shadow-md ' +
                (active ? 'ring-sky-500 shadow-md' : 'ring-slate-200')
              }
            >
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-base font-semibold text-slate-900">{offer.title}</div>
                  <div className="text-sm font-semibold text-sky-700">{offer.price}</div>
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-sky-600">
                  {offer.highlight}
                </div>
                <p className="mt-2 text-sm text-slate-600">{offer.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectOffer(offer.id)}
                className={
                  'mt-4 rounded-lg px-3 py-1.5 text-sm font-semibold transition ' +
                  (active
                    ? 'bg-sky-600 text-white hover:bg-sky-700'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200')
                }
              >
                {active ? 'Offre sélectionnée' : 'Choisir cette offre'}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderPreview = () => {
    const cityDate = [form.senderCity, form.date].filter(Boolean).join(', ');

    const headerLines = [
      form.senderName,
      form.senderCity,
      form.senderPhone,
      form.senderEmail,
    ].filter(Boolean);

    // On enlève la personne / service du bloc destinataire : uniquement entreprise + adresse
    const recipientLines = [form.recipientCompany, form.recipientAddress].filter(Boolean);

    const closingSentence = buildClosingSentence();

    const defaultBodyText =
      'Votre lettre apparaîtra ici. Présentez brièvement votre profil, vos expériences clés et pourquoi vous postulez à ce poste.';

    const bodyText = form.body || defaultBodyText;

    // Chaque appui sur Entrée = nouveau paragraphe (on enlève les lignes vides)
    const paragraphs = bodyText
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    return (
      <div className="flex justify-center">
        <div
          className="w-full max-w-[650px] bg-slate-100 flex items-center justify-center rounded-xl border border-slate-200 shadow-sm"
          style={{ aspectRatio: '210 / 297' }} // A4 portrait
        >
          <div className="w-[90%] h-[90%] rounded-[2px] border border-slate-300 bg-white p-6 text-sm text-slate-800 break-words flex flex-col">
            {/* Bloc expéditeur */}
            <div className="flex flex-col gap-1 text-xs text-slate-600">
              {headerLines.map((l, idx) => (
                <div key={idx}>{l}</div>
              ))}
            </div>

            {/* Ville + date */}
            {cityDate && (
              <div className="mt-4 text-right text-xs text-slate-600">{cityDate}</div>
            )}

            {/* Bloc destinataire (entreprise / adresse uniquement) */}
            {recipientLines.length > 0 && (
              <div className="mt-4 text-sm text-slate-700 leading-relaxed">
                {recipientLines.map((l, idx) => (
                  <div key={idx}>{l}</div>
                ))}
              </div>
            )}

            {/* Objet */}
            <div className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Objet&nbsp;: {form.subject || 'Objet de la lettre'}
            </div>

            {/* Corps de la lettre + phrase de fin + signature dans le flux normal */}
            <div className="mt-6 space-y-4 text-sm leading-relaxed">
              {/* Civilité / Personne / Service avec alinéa */}
              <p style={{ textIndent: '1.5em' }}>
                {form.recipientContact || 'Madame, Monsieur,'}
              </p>

              {/* Paragraphes du corps */}
              <div className="space-y-3">
                {paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="whitespace-pre-line break-words"
                    style={{ textIndent: '1.5em' }} // alinéa sur chaque paragraphe
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Phrase de fin : propre paragraphe avec alinéa */}
              <p className="mt-4" style={{ textIndent: '1.5em' }}>
                {closingSentence}
              </p>

              {/* Signature : un peu d’espace, mais dépend de la longueur de la lettre */}
              <p className="mt-6 text-right font-semibold">
                {form.signatureName || form.senderName || 'Nom et prénom'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditorStep = () => (
    <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold uppercase tracking-wide text-sky-700">
          3. Renseignez les informations pour la lettre
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setStep(STEP_OFFER);
              scrollToContent();
            }}
            className="text-xs font-semibold text-sky-700 hover:text-sky-900"
          >
            ⟵ Revenir aux offres
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-600">
        Remplissez les champs ci-dessous. Nous pourrons ensuite ajuster la lettre selon le poste et
        votre CV si nécessaire.
      </p>

      {/* On donne un peu plus de largeur à l’aperçu A4 */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.25fr)]">
        <Card className="space-y-4 p-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Ancien fichier (CV ou lettre) – optionnel
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-700 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-sky-400"
            />
            <p className="text-[11px] text-slate-500">
              Vous pouvez joindre un ancien CV ou une ancienne lettre pour nous aider à adapter la
              rédaction (utilisé plus tard avec l’IA).
            </p>
            {attachedFile && (
              <p className="text-[11px] text-sky-700">
                Fichier sélectionné : <span className="font-semibold">{attachedFile.name}</span>
              </p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Nom et prénom (expéditeur)
              </label>
              <input
                type="text"
                value={form.senderName}
                onChange={handleChange('senderName')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Ex : Koffi Jean Michel"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <input
                type="email"
                value={form.senderEmail}
                onChange={handleChange('senderEmail')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Ex : exemple@gmail.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Téléphone</label>
              <input
                type="text"
                value={form.senderPhone}
                onChange={handleChange('senderPhone')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Ex : +225 01 23 45 67"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Ville</label>
              <input
                type="text"
                value={form.senderCity}
                onChange={handleChange('senderCity')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Ex : Abidjan"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Date</label>
              <input
                type="text"
                value={form.date}
                onChange={handleChange('date')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Ex : 25 octobre 2025"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Entreprise (destinataire)
              </label>
              <input
                type="text"
                value={form.recipientCompany}
                onChange={handleChange('recipientCompany')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Ex : Société MINIERA"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Personne / Service
              </label>
              <input
                type="text"
                value={form.recipientContact}
                onChange={handleChange('recipientContact')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Ex : Madame la Directrice des Ressources Humaines"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Adresse</label>
              <input
                type="text"
                value={form.recipientAddress}
                onChange={handleChange('recipientAddress')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Ex : BP 123, Abidjan, Côte d’Ivoire"
              />
            </div>
          </div>

          {/* Objet */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Objet</label>
            <input
              type="text"
              value={form.subject}
              onChange={handleChange('subject')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Ex : Candidature au poste d’Assistant Comptable"
            />
          </div>

          {/* Import ancien fichier (CV / lettre) */}
          

          {/* Corps */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Corps de la lettre</label>
            <textarea
              rows={7}
              value={form.body}
              onChange={handleChange('body')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm leading-relaxed focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Présentez brièvement votre profil, vos expériences clés et pourquoi vous postulez à ce poste.

Appuyez sur Entrée pour passer à un nouveau paragraphe."
            />
          </div>

          {/* Phrase de fin */}
          <div className="space-y-1.5 md:w-2/3">
            <label className="text-xs font-semibold text-slate-700">
              Phrase de fin de lettre
            </label>
            <select
              value={closingMode}
              onChange={(e) => setClosingMode(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="default">
                Veuillez agréer, [civilité], l’expression de mes salutations distinguées.
              </option>
              <option value="alt1">
                Je vous prie d’agréer, [civilité], l’expression de ma considération distinguée.
              </option>
              <option value="alt2">
                Veuillez recevoir, [civilité], l’assurance de ma parfaite considération.
              </option>
              <option value="custom">Phrase personnalisée</option>
            </select>

            {closingMode === 'custom' && (
              <textarea
                rows={2}
                value={closingCustom}
                onChange={(e) => setClosingCustom(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm leading-relaxed focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Ex : Je vous prie d’agréer, Madame la Directrice, l’expression de mon profond respect."
              />
            )}
          </div>

          {/* Signature */}
          <div className="space-y-1.5 md:w-1/2">
            <label className="text-xs font-semibold text-slate-700">
              Nom affiché en signature
            </label>
            <input
              type="text"
              value={form.signatureName}
              onChange={handleChange('signatureName')}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Nom qui apparaîtra à la fin de la lettre"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-500">
              Une fois la lettre validée, nous pourrons vous fournir la version Word / PDF prête à
              envoyer, comme pour le CV.
            </p>
            <button
              type="button"
              onClick={handleOpenWhatsapp}
              disabled={!canSendWhatsapp}
              className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Recevoir ma lettre sur WhatsApp
            </button>
          </div>
        </Card>

        {/* Aperçu à droite (A4) */}
        {renderPreview()}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 py-8">
      <SectionTitle title="Lettre de motivation" hint="Produit dédié" />
      <PageHero
        title="Lettre de motivation pro, livrée en Word / PDF et WhatsApp"
        subtitle="Choisissez un modèle, une offre, puis remplissez l’éditeur. Nous vous guidons sur le contenu, comme pour le CV."
      >
        <div className="flex flex-col gap-2 text-xs text-slate-600">
          {renderStepIndicator()}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => go('Modèles')}
              className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-700"
            >
              Créer ou mettre à jour mon CV
            </button>
            <button
              type="button"
              onClick={handleOpenWhatsapp}
              disabled={!canSendWhatsapp}
              className="rounded-xl border border-sky-600 px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
            >
              Recevoir ma lettre sur WhatsApp
            </button>
          </div>
        </div>
      </PageHero>

      {/* Zone qui doit être visible sans scroller à chaque étape */}
      <div ref={contentRef}>
        {step === STEP_MODEL && renderModelsStep()}
        {step === STEP_OFFER && renderOffersStep()}
        {step === STEP_EDITOR && renderEditorStep()}
      </div>
    </div>
  );
}
