import React, { useMemo } from 'react';

const cls = (...xs) => xs.filter(Boolean).join(' ');
const safeHTML = (html) => ({ __html: String(html || '') });

const formatDate = (iso, mode = 'DMY_LONG') => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y) return '';
  if (mode === 'DMY_LONG') {
    const months = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
    if (!m) return String(y);
    if (!d) return `${months[m-1]} ${y}`;
    return `${d} ${months[m-1]} ${y}`;
  }
  return iso;
};
const bullets = (text) =>
  String(text || '')
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);

export function PreviewPanel({ cvData, settings }) {
  const {
    personal = {},
    profile = {},
    education = [],
    experience = [],
    skills = [],
    languages = [],
    interests = [],
    customSections = [],
    template = 'classic',
    sectionMeta = {}
  } = cvData || {};

  const {
    fontSize = 'medium',
    lineHeight = 1.25,
    colorScheme = 'blue',
    dateFormat = 'DMY_LONG',
  } = settings || {};

  const sizeClass = useMemo(() => {
    switch (fontSize) {
      case 'small': return 'text-[13px]';
      case 'large': return 'text-[16px]';
      default: return 'text-[14px]';
    }
  }, [fontSize]);

  const lhClass = useMemo(() => {
    if (lineHeight <= 1.1) return 'leading-[1.1]';
    if (lineHeight <= 1.25) return 'leading-[1.25]';
    if (lineHeight <= 1.4) return 'leading-[1.4]';
    return 'leading-[1.6]';
  }, [lineHeight]);

  const accent = useMemo(() => {
    switch (colorScheme) {
      case 'green': return 'text-emerald-700 border-emerald-300';
      case 'purple': return 'text-violet-700 border-violet-300';
      case 'rose': return 'text-rose-700 border-rose-300';
      default: return 'text-blue-700 border-blue-300';
    }
  }, [colorScheme]);

  const titleOf = (key, fallback) => sectionMeta?.[key]?.title || fallback;
  const visible = (key) => !(sectionMeta?.[key]?.hidden);
  const pageBreakBadge = (key) =>
    sectionMeta?.[key]?.pageBreakBefore ? (
      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full border border-slate-300 text-slate-600">
        Saut de page avant
      </span>
    ) : null;

  return (
    <div className="flex justify-center">
      {/* Feuille A4 */}
      <div
        className={cls(
          'bg-white rounded-sm',
          'px-8 py-8',
          'shadow-xl border border-slate-200 print:shadow-none print:border-0',
          sizeClass, lhClass
        )}
        style={{
          width: '794px',       // ≈ A4 @96dpi
          maxWidth: '100%',
          minHeight: '1123px'
        }}
      >
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className={cls('text-2xl font-bold text-slate-900')}>
                {[personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Votre nom'}
              </h1>
              <div className={cls('mt-1 text-slate-700')}>
                {personal.jobTitle || ''}
              </div>
              <div className="mt-2 text-slate-600 text-sm space-y-1">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {personal.email && <span>{personal.email}</span>}
                  {personal.phone && <span>• {personal.phone}</span>}
                  {personal.city && <span>• {personal.city}</span>}
                  {personal.website && <span>• {personal.website}</span>}
                  {personal.linkedin && <span>• {personal.linkedin}</span>}
                </div>
              </div>
            </div>

            {personal.photoUrl && (
              <div className="w-28 h-28 rounded-md overflow-hidden border border-slate-200 shrink-0">
                <img src={personal.photoUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </header>

        {/* Profil */}
        {visible('profile') && profile?.summary && (
          <section className="mb-5">
            <h2 className={cls('text-base font-semibold pb-1 mb-2 border-b', accent)}>
              {titleOf('profile', 'Profil')}
              {pageBreakBadge('profile')}
            </h2>
            <div className="prose prose-sm max-w-none text-slate-800"
                 dangerouslySetInnerHTML={safeHTML(profile.summary)} />
          </section>
        )}

        {/* Expériences */}
        {visible('experience') && Array.isArray(experience) && experience.length > 0 && (
          <section className="mb-5">
            <h2 className={cls('text-base font-semibold pb-1 mb-2 border-b', accent)}>
              {titleOf('experience', 'Expériences')}
              {pageBreakBadge('experience')}
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">
                      {exp.title || ''}{exp.company ? ` — ${exp.company}` : ''}{exp.city ? ` • ${exp.city}` : ''}
                    </div>
                    {exp.description && (
                      <ul className="list-disc ml-5 mt-1 text-slate-800 space-y-1">
                        {bullets(exp.description).map((li, i) => <li key={i}>{li}</li>)}
                      </ul>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 shrink-0">
                    {[
                      formatDate(exp.startDate, dateFormat),
                      exp.endDate ? `— ${formatDate(exp.endDate, dateFormat)}` : ''
                    ].filter(Boolean).join(' ')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formations */}
        {visible('education') && Array.isArray(education) && education.length > 0 && (
          <section className="mb-5">
            <h2 className={cls('text-base font-semibold pb-1 mb-2 border-b', accent)}>
              {titleOf('education', 'Formations')}
              {pageBreakBadge('education')}
            </h2>
            <div className="space-y-3">
              {education.map((ed) => (
                <div key={ed.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">
                      {(ed.degree || '')}{ed.field ? ` — ${ed.field}` : ''}
                    </div>
                    <div className="text-slate-700">
                      {ed.school || ''}{ed.city ? ` • ${ed.city}` : ''}
                    </div>
                    {ed.description && (
                      <ul className="list-disc ml-5 mt-1 text-slate-800 space-y-1">
                        {bullets(ed.description).map((li, i) => <li key={i}>{li}</li>)}
                      </ul>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 shrink-0">
                    {[
                      formatDate(ed.startDate, dateFormat),
                      ed.endDate ? `— ${formatDate(ed.endDate, dateFormat)}` : ''
                    ].filter(Boolean).join(' ')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Compétences */}
        {visible('skills') && Array.isArray(skills) && skills.length > 0 && (
          <section className="mb-5">
            <h2 className={cls('text-base font-semibold pb-1 mb-2 border-b', accent)}>
              {titleOf('skills', 'Compétences')}
              {pageBreakBadge('skills')}
            </h2>
            <ul className="list-disc ml-5 space-y-1 text-slate-800">
              {skills.map((sk) => (
                <li key={sk.id}>
                  <span className="font-medium">{sk.name || ''}</span>
                  {sk.level ? ` — ${sk.level}` : ''}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Langues */}
        {visible('languages') && Array.isArray(languages) && languages.length > 0 && (
          <section className="mb-5">
            <h2 className={cls('text-base font-semibold pb-1 mb-2 border-b', accent)}>
              {titleOf('languages', 'Langues')}
              {pageBreakBadge('languages')}
            </h2>
            <ul className="list-disc ml-5 space-y-1 text-slate-800">
              {languages.map((lg) => (
                <li key={lg.id}>
                  <span className="font-medium">{lg.name || ''}</span>
                  {lg.level ? ` — ${lg.level}` : ''}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Centres d’intérêt */}
        {visible('interests') && Array.isArray(interests) && interests.length > 0 && (
          <section className="mb-5">
            <h2 className={cls('text-base font-semibold pb-1 mb-2 border-b', accent)}>
              {titleOf('interests', 'Centres d’intérêt')}
              {pageBreakBadge('interests')}
            </h2>
            <ul className="list-disc ml-5 space-y-1 text-slate-800">
              {interests.map((it) => <li key={it.id}>{it.label || ''}</li>)}
            </ul>
          </section>
        )}

        {/* Sections supplémentaires (déjà OK, inchangé sauf A4 container) */}
        {Array.isArray(customSections) && customSections.length > 0 && (
          <section className="mb-5">
            {customSections.map((sec) => {
              if (!sec) return null;
              const bulletsMap = (txt) => bullets(txt).map((li, i) => <li key={i}>{li}</li>);

              if (sec.type === 'internship') {
                return (
                  <div key={sec.id} className="mb-5">
                    <h2 className={cls('text-base font-semibold pb-1 mb-2 border-b', accent)}>
                      {sec.title || 'Stage'}
                    </h2>
                    {(sec.items || []).length > 0 ? (
                      <div className="space-y-3">
                        {sec.items.map((it) => (
                          <div key={it.id} className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900">
                                {it.title || ''}{it.company ? ` — ${it.company}` : ''}{it.city ? ` • ${it.city}` : ''}
                              </div>
                              {it.description && (
                                <ul className="list-disc ml-5 mt-1 text-slate-800 space-y-1">
                                  {bulletsMap(it.description)}
                                </ul>
                              )}
                            </div>
                            <div className="text-sm text-slate-600 shrink-0">
                              {[
                                formatDate(it.startDate, dateFormat),
                                it.endDate ? `— ${formatDate(it.endDate, dateFormat)}` : ''
                              ].filter(Boolean).join(' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm">Aucun stage ajouté</div>
                    )}
                  </div>
                );
              }

              if (sec.type === 'certificate') {
                return (
                  <div key={sec.id} className="mb-5">
                    <h2 className={cls('text-base font-semibold pb-1 mb-2 border-b', accent)}>
                      {sec.title || 'Certificats'}
                    </h2>
                    {(sec.items || []).length > 0 ? (
                      <div className="space-y-3">
                        {sec.items.map((it) => (
                          <div key={it.id} className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900">
                                {it.degree || ''}{it.field ? ` — ${it.field}` : ''}
                              </div>
                              <div className="text-slate-700">{it.school || ''}</div>
                              {it.description && (
                                <ul className="list-disc ml-5 mt-1 text-slate-800 space-y-1">
                                  {bulletsMap(it.description)}
                                </ul>
                              )}
                            </div>
                            <div className="text-sm text-slate-600 shrink-0">
                              {formatDate(it.startDate, dateFormat)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm">Aucun certificat ajouté</div>
                    )}
                  </div>
                );
              }

              if (sec.type === 'reference') {
                return (
                  <div key={sec.id} className="mb-5">
                    <h2 className={cls('text-base font-semibold pb-1 mb-2 border-b', accent)}>
                      {sec.title || 'Références'}
                    </h2>
                    {(sec.items || []).length > 0 ? (
                      <ul className="space-y-2">
                        {sec.items.map((it) => (
                          <li key={it.id} className="text-slate-800">
                            <span className="font-semibold">{it.name}</span> — {it.role}
                            {it.company ? ` @ ${it.company}` : ''}
                            <div className="text-slate-700 text-sm">
                              {it.email}{it.phone ? ` • ${it.phone}` : ''}{it.authorized ? ' • OK pour contact' : ''}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-slate-500 text-sm">Aucune référence ajoutée</div>
                    )}
                  </div>
                );
              }

              if (sec.type === 'project') {
                return (
                  <div key={sec.id} className="mb-5">
                    <h2 className={cls('text-base font-semibold pb-1 mb-2 border-b', accent)}>
                      {sec.title || 'Projets'}
                    </h2>
                    {(sec.items || []).length > 0 ? (
                      <div className="space-y-3">
                        {sec.items.map((it) => (
                          <div key={it.id}>
                            <div className="font-semibold text-slate-900">{it.title}</div>
                            <div className="text-slate-700">
                              {it.role}{it.company ? ` — ${it.company}` : ''}{it.city ? ` • ${it.city}` : ''}
                              {it.link ? <> — <span className="text-blue-700 underline break-all">{it.link}</span></> : ''}
                            </div>
                            {it.description && (
                              <ul className="list-disc ml-5 mt-1 text-slate-800 space-y-1">
                                {bulletsMap(it.description)}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm">Aucun projet ajouté</div>
                    )}
                  </div>
                );
              }

              if (sec.type === 'publication') {
                return (
                  <div key={sec.id} className="mb-5">
                    <h2 className={cls('text-base font-semibold pb-1 mb-2 border-b', accent)}>
                      {sec.title || 'Publications'}
                    </h2>
                    {(sec.items || []).length > 0 ? (
                      <div className="space-y-3">
                        {sec.items.map((it) => (
                          <div key={it.id}>
                            <div className="font-semibold text-slate-900">{it.title}</div>
                            <div className="text-slate-700">
                              {it.publisher}{it.date ? ` — ${it.date}` : ''}{it.link ? ` — ${it.link}` : ''}
                            </div>
                            {it.description && (
                              <ul className="list-disc ml-5 mt-1 text-slate-800 space-y-1">
                                {bulletsMap(it.description)}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm">Aucune publication ajoutée</div>
                    )}
                  </div>
                );
              }

              if (sec.type === 'custom') {
                return (
                  <div key={sec.id} className="mb-5">
                    <h2 className={cls('text-base font-semibold pb-1 mb-2 border-b', accent)}>
                      {sec.title || 'Section personnalisée'}
                    </h2>
                    {(sec.items || []).length > 0 ? (
                      <div className="space-y-1">
                        {sec.items.map((it) => (
                          <div key={it.id}>
                            <div className="font-semibold text-slate-900">{it.label}</div>
                            {it.description && (
                              <ul className="list-disc ml-5 mt-1 text-slate-800 space-y-1">
                                {bulletsMap(it.description)}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm">Aucun élément ajouté</div>
                    )}
                  </div>
                );
              }

              if (sec.type === 'signature') {
                const meta = sec.meta || {};
                const alignClass =
                  meta.align === 'left' ? 'text-left' :
                  meta.align === 'center' ? 'text-center' : 'text-right';
                const today = new Date();
                const dd = String(today.getDate()).padStart(2, '0');
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const yyyy = today.getFullYear();
                return (
                  <div key={sec.id} className="mt-10">
                    <div className={cls(alignClass, 'text-slate-800')}>
                      <div className="text-sm">{meta.includeDate !== false ? `${dd}/${mm}/${yyyy}` : ''}</div>
                      <div className="h-10" />
                      <div className="font-semibold">
                        {[personal.firstName, personal.lastName].filter(Boolean).join(' ')}
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </section>
        )}

      </div>
    </div>
  );
}
