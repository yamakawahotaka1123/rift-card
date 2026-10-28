// Usage analytics via Google Analytics 4.
// Put the GA4 measurement ID (looks like "G-XXXXXXXXXX") here to turn it on. Empty = off.
export const GA_ID = 'G-78DHF4DF3D';

let ready = false;

export function initAnalytics() {
  if (!GA_ID) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.append(script);
  window.dataLayer = window.dataLayer || [];
  // gtag must push the arguments object itself, not an array.
  window.gtag = function gtag() { window.dataLayer.push(arguments); }; // eslint-disable-line prefer-rest-params
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
  ready = true;
  const notice = document.getElementById('analytics-notice');
  if (notice) notice.hidden = false;
}

export function track(name, params = {}) {
  if (!ready) return;
  try {
    window.gtag('event', name, params);
  } catch { /* never let analytics break the app */ }
}
