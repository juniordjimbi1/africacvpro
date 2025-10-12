// Helpers pour standardiser l'affichage des dates
export function parseDateInput(d) {
  // accepte Date | 'YYYY-MM-DD' | string convertible
  const s = String(d || '');
  const t = new Date(s);
  if (!isNaN(t.getTime())) return t;
  
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? new Date(`${s}T00:00:00`) : null;
}

export function formatDate(dt, mode = 'MY_LONG', locale = 'fr-FR') {
  const d = parseDateInput(dt);
  if (!d) return '';
  
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const fmt = (opt) => cap(d.toLocaleDateString(locale, opt));
  
  switch (mode) {
    case 'DMY_NUM':
      return fmt({ day: '2-digit', month: '2-digit', year: 'numeric' });
    case 'DMY_SHORT':
      return fmt({ day: '2-digit', month: 'short', year: 'numeric' });
    case 'DMY_LONG':
      return fmt({ day: 'numeric', month: 'long', year: 'numeric' });
    case 'MY_SHORT':
      return fmt({ month: 'short', year: 'numeric' });
    case 'MY_LONG':
      return fmt({ month: 'long', year: 'numeric' });
    default:
      return fmt({ month: 'long', year: 'numeric' });
  }
}

export function formatRange(a, b, mode = 'MY_LONG', locale = 'fr-FR') {
  const A = formatDate(a, mode, locale);
  const B = formatDate(b, mode, locale);
  
  if (A && B) return `${A} - ${B}`;
  if (A && !B) return `Depuis ${A}`;
  return '';
}