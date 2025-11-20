// utils/whatsapp.js
// Lecture robuste de la variable d'env côté client (CRA et Vite)

function getEnvPhone() {
  // Vite
  const vitePhone =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_WHATSAPP_PHONE) || '';

  // CRA
  const craPhone =
    (typeof process !== 'undefined' &&
      process.env &&
      process.env.REACT_APP_WHATSAPP_PHONE) || '';

  return vitePhone || craPhone || '';
}

function cleanPhone(phone) {
  if (!phone) return '';
  return String(phone).replace(/[^\d]/g, ''); // garde uniquement les chiffres
}

const DEFAULT_PHONE = cleanPhone(getEnvPhone()); // ex: "221770914220";

/**
 * buildWhatsappUrl (CV)
 * @param {Object} payload  { offer, templateId, resumeId, email, title }
 * @param {Object} opts     { phone }  // prioritaire sur l'env
 */
export function buildWhatsappUrl(payload = {}, opts = {}) {
  const {
    offer = 'auto',
    templateId = '',
    resumeId = '',
    email = '',
    title = 'Mon CV.pdf',
  } = payload;

  const chosenPhone = cleanPhone(opts.phone || DEFAULT_PHONE);
  const phoneSegment = chosenPhone ? `/${chosenPhone}` : '';

  const offerLabel =
    offer === 'ai'
      ? 'Automatique optimisée IA'
      : offer === 'human'
      ? 'Professionnel (humain)'
      : 'Automatique';

  const lines = [
    `Bonjour AfricaCVpro 👋`,
    `Je souhaite recevoir mon CV sur WhatsApp.`,
    ``,
    `• Offre : ${offerLabel}`,
    templateId ? `• Modèle : ${templateId}` : null,
    resumeId ? `• ID brouillon : ${resumeId}` : null,
    `• Titre du CV : ${title}`,
    email ? `• Mon email : ${email}` : null,
    ``,
    `Merci !`,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));

  // Petit log utile si jamais aucun numéro n'est fourni
  if (!chosenPhone) {
    // eslint-disable-next-line no-console
    console.warn(
      '[WhatsApp] Aucun numéro détecté. Ajoute REACT_APP_WHATSAPP_PHONE (CRA) ou VITE_WHATSAPP_PHONE (Vite).'
    );
  }

  return `https://wa.me${phoneSegment}?text=${text}`;
}

/**
 * buildLetterWhatsappUrl (Lettre de motivation)
 * @param {Object} payload  { offer, templateId, fullName, email, jobTitle, company }
 * @param {Object} opts     { phone }  // prioritaire sur l'env
 */
export function buildLetterWhatsappUrl(payload = {}, opts = {}) {
  const {
    offer = 'auto',
    templateId = '',
    fullName = '',
    email = '',
    jobTitle = '',
    company = '',
  } = payload;

  const chosenPhone = cleanPhone(opts.phone || DEFAULT_PHONE);
  const phoneSegment = chosenPhone ? `/${chosenPhone}` : '';

  const offerLabel =
    offer === 'ai'
      ? 'Automatique optimisée IA'
      : offer === 'human'
      ? 'Professionnelle (humaine)'
      : 'Automatique';

  const lines = [
    `Bonjour AfricaCVpro 👋`,
    `Je souhaite recevoir ma lettre de motivation sur WhatsApp.`,
    ``,
    `• Offre lettre : ${offerLabel}`,
    templateId ? `• Modèle de lettre : ${templateId}` : null,
    fullName ? `• Nom : ${fullName}` : null,
    jobTitle ? `• Poste visé : ${jobTitle}` : null,
    company ? `• Entreprise / organisation ciblée : ${company}` : null,
    email ? `• Mon email : ${email}` : null,
    ``,
    `Merci !`,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));

  if (!chosenPhone) {
    // eslint-disable-next-line no-console
    console.warn(
      '[WhatsApp] Aucun numéro détecté. Ajoute REACT_APP_WHATSAPP_PHONE (CRA) ou VITE_WHATSAPP_PHONE (Vite).'
    );
  }

  return `https://wa.me${phoneSegment}?text=${text}`;
}
