// client/src/utils/richText.js

// Encode basique (sécurise tout)
function htmlEncode(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Autorise UNIQUEMENT strong, em, u, br pour le rendu preview
export function sanitizeProfileHTML(input = '') {
  let enc = htmlEncode(input);
  enc = enc.replace(/\r?\n/g, '<br>');
  enc = enc
    .replace(/&lt;strong&gt;/gi, '<strong>')
    .replace(/&lt;\/strong&gt;/gi, '</strong>')
    .replace(/&lt;em&gt;/gi, '<em>')
    .replace(/&lt;\/em&gt;/gi, '</em>')
    .replace(/&lt;u&gt;/gi, '<u>')
    .replace(/&lt;\/u&gt;/gi, '</u>')
    .replace(/&lt;br\s*\/?&gt;/gi, '<br>');
  return enc;
}

// Normalise le HTML édité (contenteditable) vers strong/em/u/br sans attributs
export function normalizeEditorHTML(html = '') {
  let s = String(html);

  // Unwrap <div>/<p> en <br>
  s = s.replace(/<div><br><\/div>/gi, '<br>');
  s = s.replace(/<\/div>/gi, '<br>').replace(/<div>/gi, '');
  s = s.replace(/<p><br><\/p>/gi, '<br>');
  s = s.replace(/<\/p>/gi, '<br>').replace(/<p>/gi, '');

  // Remplacements de balises
  s = s.replace(/<b\b[^>]*>/gi, '<strong>').replace(/<\/b>/gi, '</strong>');
  s = s.replace(/<i\b[^>]*>/gi, '<em>').replace(/<\/i>/gi, '</em>');

  // Span underline → <u>
  s = s.replace(
    /<span[^>]*style="[^"]*text-decoration\s*:\s*underline[^"]*"[^>]*>(.*?)<\/span>/gi,
    '<u>$1</u>'
  );

  // Supprimer toute balise non autorisée
  s = s.replace(/<(?!\/?(strong|em|u|br)\b)[^>]*>/gi, '');

  // Retirer les attributs sur balises autorisées
  s = s.replace(/<(strong|em|u)\b[^>]*>/gi, '<$1>');

  // Normaliser les espaces
  s = s.replace(/&nbsp;/g, ' ');

  // Nettoyer <br> multiples en fin
  s = s.replace(/(<br>\s*){3,}$/i, '<br><br>');

  return s.trim();
}
