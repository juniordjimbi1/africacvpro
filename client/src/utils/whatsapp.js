// client/src/utils/whatsapp.js
export function buildWhatsappUrl({ offer, template, resumeId, email }) {
  const number =
    process.env.REACT_APP_WHATSAPP_NUMBER ||
    localStorage.getItem('africacv_whatsapp') ||
    ''; // mets ton numéro dans REACT_APP_WHATSAPP_NUMBER (ex: 221771234567)

  const offerLabel =
    offer === 'ai' ? 'Optimisée IA' :
    offer === 'human' ? 'Offre humaine' :
    'Automatique';

  const lines = [
    'Bonjour 👋',
    `Je souhaite la prestation **${offerLabel}** pour mon CV.`,
    `• Modèle : ${template?.name || '—'}${template?.id ? ` (${template.id})` : ''}`,
    ...(resumeId ? [`• Brouillon : ${resumeId}`] : []),
    `• Mon email : ${email || '—'}`,
    '',
    'Merci de me confirmer la suite ✅'
  ];

  const text = encodeURIComponent(lines.join('\n'));
  return number ? `https://wa.me/${number}?text=${text}` : null;
}
