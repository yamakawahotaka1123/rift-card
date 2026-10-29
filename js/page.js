// Script for the static subpages (guide, FAQ, banner…): analytics, copy buttons and the language menu.
import { initAnalytics, track } from './analytics.js';

initAnalytics();

function toast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 3000);
}

document.addEventListener('click', async (e) => {
  const id = e.target.closest('[data-copy-target]')?.dataset.copyTarget;
  if (!id) return;
  try {
    await navigator.clipboard.writeText(document.getElementById(id).textContent);
    toast(document.body.dataset.copied);
    track('embed_copy', { target: id });
  } catch {
    toast(document.body.dataset.copyFailed);
  }
});

// Each option is the same page in another language; remember the choice for the tool page too.
const langSelect = document.getElementById('lang-pages');
langSelect?.addEventListener('change', () => {
  const option = langSelect.selectedOptions[0];
  try {
    localStorage.setItem('riftcard:lang', option.dataset.lang);
  } catch { /* storage unavailable */ }
  location.href = option.value;
});
