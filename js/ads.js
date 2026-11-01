// AdSense ad units. Each `[data-ad="<name>"]` box stays hidden until its slot ID is filled in below.
const CLIENT = 'ca-pub-2105839437802724';
const SLOTS = {
  tool: '', // below the card maker
  page: '', // under the text of guide, templates, FAQ and banner pages
};

export function initAds() {
  for (const box of document.querySelectorAll('[data-ad]')) {
    const slot = SLOTS[box.dataset.ad];
    if (!slot) continue;
    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.dataset.adClient = CLIENT;
    ins.dataset.adSlot = slot;
    ins.dataset.adFormat = 'auto';
    ins.dataset.fullWidthResponsive = 'true';
    box.append(ins);
    box.hidden = false;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      box.hidden = true;
    }
  }
}
