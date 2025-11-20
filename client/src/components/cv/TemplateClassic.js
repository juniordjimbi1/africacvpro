// client/src/components/cv/TemplateClassic.js
import React from 'react';
import { buildCvViewModel } from '../../utils/cvViewModel';

const ACCENT = '#9b1c24';

// Petit helper pour joindre des morceaux de texte proprement
const safeJoin = (parts, sep = ' ') =>
  (parts || [])
    .map((p) => (p || '').toString().trim())
    .filter(Boolean)
    .join(sep);

// Format simple des dates de période
const formatDateRange = (start, end) => {
  if (!start && !end) return '';
  if (start && !end) return `Depuis ${start}`;
  if (!start && end) return end;
  return `${start} – ${end}`;
};

// Format date de naissance + lieu
const formatBirthInfo = (dateStr, place) => {
  if (!dateStr && !place) return '';
  let txt = '';

  if (dateStr) {
    const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/); // 2025-11-17
    if (m) {
      const [, y, mm, d] = m;
      txt = `${d}/${mm}/${y}`;
    } else {
      txt = dateStr;
    }
  }

  if (place) {
    if (txt) txt += ` à ${place}`;
    else txt = `Né(e) à ${place}`;
  }

  return txt;
};

// Icône vectorielle simple, même couleur pour tous
const InfoIcon = ({ type }) => {
  const className = 'w-3.5 h-3.5 text-[#9b1c24] flex-shrink-0';

  switch (type) {
    case 'email':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path
            d="M4 6h16v12H4V6zm0 0 8 5 8-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'phone':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path
            d="M7 4h3l2 5-2 1a10 10 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 5 6 2 2 0 0 1 7 4z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case 'address':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path
            d="M12 21s6-6.3 6-11a6 6 0 1 0-12 0c0 4.7 6 11 6 11z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle
            cx="12"
            cy="10"
            r="2.3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case 'birth':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <rect
            x="4"
            y="5"
            width="16"
            height="15"
            rx="1.5"
            ry="1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8 3v4M16 3v4M8 11h3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'nationality':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      );
    case 'driving':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <rect
            x="3"
            y="8"
            width="18"
            height="9"
            rx="2"
            ry="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case 'website':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M4 12h16M12 4a16 16 0 0 0 0 16M12 4a16 16 0 0 1 0 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            ry="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8 17v-6M8 9V7M11 17v-4.5A2.5 2.5 0 0 1 16 11v6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'custom':
    default:
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path
            d="m12 4 1.5 4.5H18l-3.7 2.7L15.8 16 12 13.6 8.2 16l1.5-4.8L6 8.5h4.5L12 4z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

// Ligne d’info avec icône + texte
function InfoRow({ type, label }) {
  if (!label) return null;
  return (
    <div className="flex items-start gap-2">
      <InfoIcon type={type} />
      <span className="text-xs text-slate-800 break-words">{label}</span>
    </div>
  );
}

export function TemplateClassic({ cvData }) {
  // 1) Vue normalisée
  const vm = buildCvViewModel(cvData || {});
  const { identity, sections } = vm;

  // 🔎 DEBUG : pour vérifier ce qui arrive ici
  if (typeof window !== 'undefined') {
    console.log('[TemplateClassic] raw cvData:', cvData);
    console.log('[TemplateClassic] identity from viewModel:', identity);
  }

  // 2) HEADER : on lit D’ABORD les champs racine, puis fallback sur personal / identity
  const data = cvData || {};
  const personal =
    (data.personal && typeof data.personal === 'object' && data.personal) ||
    (data.personalInfo && typeof data.personalInfo === 'object' && data.personalInfo) ||
    {};

  const rootName = safeJoin([data.firstName, data.lastName], ' ');
  const personalName = safeJoin([personal.firstName, personal.lastName], ' ');
  const identityName = (identity.fullName || '').toString().trim();

  const displayName =
    (rootName || personalName || identityName || '').trim() || 'Prénom NOM';

  const rootJobTitle = (data.jobTitle || '').toString().trim();
  const personalJobTitle = (personal.jobTitle || '').toString().trim();
  const identityTitle = (identity.title || '').toString().trim();

  const displayTitle = rootJobTitle || personalJobTitle || identityTitle;

  // 🔎 DEBUG header
  if (typeof window !== 'undefined') {
    console.log('[TemplateClassic] personal for header:', personal);
    console.log('[TemplateClassic] rootName =', rootName);
    console.log('[TemplateClassic] personalName =', personalName);
    console.log('[TemplateClassic] identityName =', identityName);
    console.log('[TemplateClassic] displayName =', displayName);
    console.log('[TemplateClassic] rootJobTitle =', rootJobTitle);
    console.log('[TemplateClassic] displayTitle =', displayTitle);
  }

  // 3) Flags de présence des sections + infos perso colonne gauche
  const hasProfile =
    sections.profile?.text && sections.profile.text.trim().length > 0;
  const hasExperience =
    sections.experience && sections.experience.length > 0;
  const hasEducation =
    sections.education && sections.education.length > 0;
  const hasSkills =
    sections.skills && sections.skills.length > 0;
  const hasLanguages =
    sections.languages && sections.languages.length > 0;
  const hasInterests =
    sections.interests && sections.interests.length > 0;
  const hasCustomFields =
    Array.isArray(identity.customFields) &&
    identity.customFields.length > 0;

  const birthInfo = formatBirthInfo(
    identity.birthDate,
    identity.birthPlace
  );

  return (
    <div className="w-full flex justify-center">
      {/* Page de CV : une seule page, pas de coins arrondis */}
      <div
        className="w-full max-w-[920px] bg-white flex overflow-hidden"
        style={{ minHeight: '1120px' }} // hauteur type A4
      >
        {/* Colonne gauche */}
        <aside className="w-[31%] bg-[#f8efef] relative">
          {/* Bande verticale gauche */}
          <div
            className="absolute inset-y-0 left-0"
            style={{ width: '26px', backgroundColor: ACCENT }}
          />

          <div className="relative h-full flex flex-col pl-10 pr-7 pt-6 pb-8 gap-6">
            {/* Photo (carrée, sans bordure ni ombre) */}
            {identity.photoUrl && (
              <div className="w-full flex justify-center mb-2">
                <div className="w-32 h-32 bg-slate-200 overflow-hidden">
                  <img
                    src={identity.photoUrl}
                    alt="Photo de profil"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Informations personnelles */}
            <section>
              <h2 className="text-[16px] font-semibold tracking-wide text-[#9b1c24] uppercase mb-3 border-b border-slate-200 pb-1">
                Informations personnelles
              </h2>

              <div className="space-y-2.5">
                {/* PAS de nom, PAS d’emploi recherché ici → seulement en haut à droite */}
                <InfoRow type="email" label={identity.email} />
                <InfoRow type="phone" label={identity.phone} />
                <InfoRow
                  type="address"
                  label={
                    identity.address || identity.city
                      ? [identity.address, identity.city]
                          .filter(Boolean)
                          .join(', ')
                      : ''
                  }
                />
                <InfoRow type="birth" label={birthInfo} />
                <InfoRow type="nationality" label={identity.nationality} />
                <InfoRow type="driving" label={identity.driving} />
                <InfoRow type="website" label={identity.website} />
                <InfoRow type="linkedin" label={identity.linkedin} />

                {/* Champs personnalisés */}
                {hasCustomFields &&
                  identity.customFields.map((field, idx) => {
                    const value =
                      field?.label && field?.value
                        ? `${field.label} : ${field.value}`
                        : field?.value || field?.label || '';
                    return (
                      <InfoRow
                        key={idx}
                        type="custom"
                        label={value}
                      />
                    );
                  })}
              </div>
            </section>

            {/* Compétences */}
            {hasSkills && (
              <section>
                <h2 className="text-[16px] font-semibold tracking-wide text-[#9b1c24] uppercase mb-2 border-b border-slate-200 pb-1">
                  Compétences
                </h2>
                <ul className="text-xs text-slate-800 space-y-1.5">
                  {sections.skills.map((sk, idx) => (
                    <li key={idx} className="break-words">
                      • {sk}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Langues */}
            {hasLanguages && (
              <section>
                <h2 className="text-[16px] font-semibold tracking-wide text-[#9b1c24] uppercase mb-2 border-b border-slate-200 pb-1">
                  Langues
                </h2>
                <ul className="text-xs text-slate-800 space-y-1.5">
                  {sections.languages.map((lg) => (
                    <li
                      key={lg.id || lg.name}
                      className="break-words"
                    >
                      {lg.name}
                      {lg.level ? ` — ${lg.level}` : ''}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Centres d’intérêt */}
            {hasInterests && (
              <section>
                <h2 className="text-[16px] font-semibold tracking-wide text-[#9b1c24] uppercase mb-2 border-b border-slate-200 pb-1">
                  Centres d’intérêt
                </h2>
                <ul className="text-xs text-slate-800 space-y-1.5">
                  {sections.interests.map((it, idx) => (
                    <li key={idx} className="break-words">
                      • {it}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </aside>

        {/* Colonne droite : nom + sections */}
        <main className="w-[69%] pl-7 pr-9 py-8">
          {/* Nom + emploi recherché en haut à droite */}
          <header className="mb-6">
            <h1 className="text-4xl font-bold text-[#9b1c24] leading-tight break-words">
              {displayName}
            </h1>
            {displayTitle && (
              <div className="mt-1 text-base uppercase tracking-wide text-slate-700 break-words">
                {displayTitle}
              </div>
            )}
          </header>

          <div className="space-y-5 text-sm text-slate-800 leading-relaxed">
            {/* Profil */}
            {hasProfile && (
              <section>
                <h2 className="text-[16px] font-semibold tracking-wide text-[#9b1c24] uppercase border-b border-slate-200 pb-1 mb-2">
                  Profil
                </h2>
                <p className="whitespace-pre-line break-words">
                  {sections.profile.text}
                </p>
              </section>
            )}

            {/* Formation */}
            {hasEducation && (
              <section>
                <h2 className="text-[16px] font-semibold tracking-wide text-[#9b1c24] uppercase border-b border-slate-200 pb-1 mb-2">
                  Formation
                </h2>

                <div className="space-y-3 text-[13px]">
                  {sections.education.map((ed) => (
                    <article
                      key={ed.id || ed.school + ed.degree}
                      className="space-y-0.5"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="font-semibold text-slate-900 break-words">
                          {ed.degree || 'Diplôme'}
                        </div>
                        <div className="text-[11px] text-slate-500 whitespace-nowrap">
                          {formatDateRange(ed.startDate, ed.endDate)}
                        </div>
                      </div>
                      <div className="text-[12px] text-slate-700 break-words">
                        {safeJoin([ed.school, ed.city], ' • ')}
                      </div>
                      {ed.description && (
                        <div className="text-[12px] text-slate-700 whitespace-pre-line break-words mt-0.5">
                          {ed.description}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Expériences professionnelles */}
            {hasExperience && (
              <section>
                <h2 className="text-[16px] font-semibold tracking-wide text-[#9b1c24] uppercase border-b border-slate-200 pb-1 mb-2">
                  Expériences professionnelles
                </h2>

                <div className="space-y-3">
                  {sections.experience.map((exp) => (
                    <article
                      key={exp.id || exp.title + exp.company}
                      className="space-y-0.5"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="font-semibold text-[13px] text-slate-900 break-words">
                          {exp.title || 'Intitulé du poste'}
                          {exp.company ? ` – ${exp.company}` : ''}
                        </div>
                        <div className="text-[11px] text-slate-500 whitespace-nowrap">
                          {formatDateRange(exp.startDate, exp.endDate)}
                        </div>
                      </div>
                      <div className="text-[12px] text-slate-700 break-words">
                        {safeJoin([exp.city], ' • ')}
                      </div>
                      {exp.description && (
                        <ul className="mt-1 text-[12px] text-slate-800 space-y-0.5 whitespace-pre-line break-words">
                          {exp.description.split('\n').map((line, idx) => (
                            <li key={idx}>• {line}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
