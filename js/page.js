// Script for the static subpages (guide, FAQ, banner…): analytics and copy buttons.
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
    toast('コピーしました');
    track('embed_copy', { target: id });
  } catch {
    toast('コピーできませんでした。手動で選択してコピーしてください');
  }
});
