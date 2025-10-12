import React from 'react';
import { motion } from 'framer-motion';
import { formatDate, formatRange } from '../../utils/dateUtils';

export function PreviewPanel({ cvData, settings }) {
  const { personal = {}, profile = {}, education = [], experience = [], skills = [], languages = [], interests = [] } = cvData || {};

  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl border-2 border-slate-300 shadow-xl"
    >
      {/* En-tête A4 */}
      <div className="aspect-[210/297] p-8 relative overflow-hidden">
        {/* Filigrane si non débloqué */}
        {!cvData?.exportUnlocked && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.08),transparent_60%)]" />
        )}

        <div className="h-full flex flex-col space-y-6">
          {/* En-tête avec photo */}
          <div className="text-center border-b border-slate-200 pb-4">
            {personal.photoUrl && (
              <div className="mx-auto mb-3 w-24 h-24 rounded-full overflow-hidden ring-1 ring-slate-200 shadow">
                <img src={personal.photoUrl} alt="Profil" className="w-full h-full object-cover" />
              </div>
            )}

            {fullName && (
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {fullName}
              </h1>
            )}
            {personal.jobTitle && (
              <p className="text-lg text-primary-600 font-medium">{personal.jobTitle}</p>
            )}

            {/* Contacts */}
            <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-600 mt-2">
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && <span>• {personal.phone}</span>}
              {(personal.address || personal.city) && (
                <span>• {[personal.address, personal.city].filter(Boolean).join(', ')}</span>
              )}
              {personal.website && <span>• {personal.website}</span>}
              {personal.linkedin && <span>• {personal.linkedin}</span>}
            </div>
          </div>

          {/* Profil */}
          {profile.summary && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Profil
              </h2>
              <p className="text-slate-700 text-sm leading-relaxed">{profile.summary}</p>
            </div>
          )}

          {/* Expérience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Expérience Professionnelle
              </h2>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id || `${exp.title}-${exp.company}-${exp.startDate}`} className="text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="font-semibold text-slate-900">{exp.title}</span>
                      <span className="text-slate-600">
                        {formatRange(exp.startDate, exp.endDate, settings?.dateFormat)}
                      </span>
                    </div>
                    <div className="text-slate-700">{exp.company}</div>
                    {exp.city && <div className="text-slate-600">{exp.city}</div>}
                    {exp.description && (
                      <p className="text-slate-700 mt-1">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formation */}
          {education.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Formation
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id || `${edu.degree}-${edu.school}-${edu.startDate}`} className="text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="font-semibold text-slate-900">{edu.degree}</span>
                      <span className="text-slate-600">
                        {formatRange(edu.startDate, edu.endDate, settings?.dateFormat)}
                      </span>
                    </div>
                    <div className="text-slate-700">{edu.school}</div>
                    {edu.field && <div className="text-slate-600">{edu.field}</div>}
                    {edu.city && <div className="text-slate-600">{edu.city}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compétences */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Compétences
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div key={skill.id || skill.name} className="text-sm bg-slate-100 px-2 py-1 rounded">
                    {skill.name}
                    {skill.level && (
                      <span className="text-slate-500 ml-1">
                        {'●'.repeat(skill.level)}{'○'.repeat(Math.max(0, 5 - skill.level))}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Langues
              </h2>
              <div className="flex flex-wrap gap-2">
                {languages.map((lg) => (
                  <div key={lg.id || lg.name} className="text-sm bg-slate-100 px-2 py-1 rounded">
                    {lg.name}
                    {lg.level && <span className="text-slate-500 ml-1">({lg.level})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Centres d’intérêt */}
          {interests.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Centres d’intérêt
              </h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((it) => (
                  <div key={it.id || it.name} className="text-sm bg-slate-100 px-2 py-1 rounded">
                    {it.name || it}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
