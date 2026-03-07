export const SITE_VARIANT: string = (() => {
  if (typeof window !== 'undefined') {
    // Check URL parameter first (?variant=stratum)
    const urlParams = new URLSearchParams(window.location.search);
    const urlVariant = urlParams.get('variant');
    if (urlVariant === 'tech' || urlVariant === 'full' || urlVariant === 'finance' || urlVariant === 'stratum') {
      localStorage.setItem('worldmonitor-variant', urlVariant);
      return urlVariant;
    }

    // Fall back to stored preference
    const stored = localStorage.getItem('worldmonitor-variant');
    if (stored === 'tech' || stored === 'full' || stored === 'finance' || stored === 'stratum') return stored;
  }
  return import.meta.env.VITE_VARIANT || 'full';
})();
