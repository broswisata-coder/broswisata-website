// Lightweight, decorative icons in the existing Bros blue/gold visual language.
// No official seals, issued documents, approval marks or external icon runtime.
const drawings = {
  passport: '<rect x="14" y="8" width="36" height="48" rx="5" fill="#0f47b0"/><path d="M20 8v48" stroke="#e8a317" stroke-width="2"/><circle cx="35" cy="28" r="10" fill="none" stroke="#f7f3ea" stroke-width="2"/><path d="M25 28h20m-10-10c-6 6-6 14 0 20m0-20c6 6 6 14 0 20M28 46h14" fill="none" stroke="#f7f3ea" stroke-width="2" stroke-linecap="round"/>',
  business: '<path d="M23 20v-7h18v7" fill="none" stroke="#0f47b0" stroke-width="4"/><rect x="9" y="20" width="46" height="34" rx="5" fill="#0f47b0"/><path d="M9 32c12 8 34 8 46 0" fill="none" stroke="#f7f3ea" stroke-width="2"/><rect x="28" y="30" width="8" height="10" rx="2" fill="#e8a317"/>',
  multiple: '<path d="M14 25a19 19 0 0 1 33-9l6 6M50 39a19 19 0 0 1-33 9l-6-6" fill="none" stroke="#0f47b0" stroke-width="4" stroke-linecap="round"/><path d="m41 22 12 1-1-12M23 42l-12-1 1 12" fill="none" stroke="#e8a317" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="32" r="6" fill="#0f47b0"/>',
  permit: '<rect x="9" y="13" width="46" height="39" rx="5" fill="#0f47b0"/><circle cx="24" cy="29" r="6" fill="#e8a317"/><path d="M15 45c2-8 16-8 18 0" fill="#f7f3ea"/><path d="M39 27h9m-9 7h9m-9 7h7" stroke="#f7f3ea" stroke-width="3" stroke-linecap="round"/>',
  home: '<path d="m8 29 24-20 24 20" fill="none" stroke="#e8a317" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 27v28h36V27L32 12 14 27Z" fill="#0f47b0"/><path d="M27 55V37h10v18" fill="#f7f3ea"/>',
  extension: '<rect x="11" y="14" width="40" height="39" rx="5" fill="#f7f3ea" stroke="#0f47b0" stroke-width="3"/><path d="M11 26h40M21 9v10M41 9v10" stroke="#0f47b0" stroke-width="4" stroke-linecap="round"/><path d="M28 38h12m-5-5 5 5-5 5" fill="none" stroke="#e8a317" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
  chat: '<path d="M9 13h46v31H29L16 55V44H9V13Z" fill="#0f47b0"/><circle cx="23" cy="29" r="3" fill="#f7f3ea"/><circle cx="32" cy="29" r="3" fill="#e8a317"/><circle cx="41" cy="29" r="3" fill="#f7f3ea"/>',
  review: '<rect x="13" y="8" width="32" height="46" rx="4" fill="#0f47b0"/><path d="M21 19h16m-16 8h13m-13 8h9" stroke="#f7f3ea" stroke-width="3" stroke-linecap="round"/><circle cx="43" cy="42" r="9" fill="#f7f3ea" stroke="#e8a317" stroke-width="3"/><path d="m50 49 7 7" stroke="#e8a317" stroke-width="4" stroke-linecap="round"/>',
  document: '<path d="M14 8h24l12 12v36H14V8Z" fill="#0f47b0"/><path d="M38 8v13h12" fill="#e8a317"/><path d="M23 30h18m-18 8h18m-18 8h11" stroke="#f7f3ea" stroke-width="3" stroke-linecap="round"/>',
  coordinate: '<circle cx="32" cy="32" r="22" fill="none" stroke="#0f47b0" stroke-width="3"/><path d="M10 32h44M32 10c-14 13-14 31 0 44m0-44c14 13 14 31 0 44" fill="none" stroke="#0f47b0" stroke-width="2"/><path d="m39 15 15 3-8 12-1-8-6-7Z" fill="#e8a317"/>',
};
function icon(key, className = '') {
  if (!drawings[key]) throw new Error('Unknown visa icon: ' + key);
  return `<svg class="visa-icon ${className}" viewBox="0 0 64 64" width="48" height="48" aria-hidden="true" focusable="false">${drawings[key]}</svg>`;
}
module.exports = {icon};
