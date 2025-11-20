export function go(page){
  window.dispatchEvent(new CustomEvent('app:navigate', { detail: { page } }));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
