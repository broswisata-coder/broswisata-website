// Code-native presentation only: a country flag, not an official seal or affiliation.
const entries = {
  id: {single:'Sekali masuk',year:'Beberapa kali masuk',twoYears:'Izin tinggal terbatas',flag:'Bendera Indonesia'},
  en: {single:'Single entry',year:'Multiple entry',twoYears:'Limited stay',flag:'Flag of Indonesia'},
  ms: {single:'Sekali masuk',year:'Berbilang kemasukan',twoYears:'Permit tinggal terhad',flag:'Bendera Indonesia'},
};
function countryMark(lang) {
  return `<span class="visa-country-mark"><svg class="visa-flag" viewBox="0 0 36 24" width="36" height="24" role="img" aria-label="${entries[lang].flag}" focusable="false"><path fill="#ce1126" d="M0 0h36v12H0z"/><path fill="#fff" d="M0 12h36v12H0z"/></svg><span>Indonesia</span></span>`;
}
function typeBadge(rate, onDark = false) {
  const kind = rate.basis === 'single' ? 'single' : rate.basis === 'year' ? 'multiple' : 'limited';
  return `<span class="visa-type-badge visa-type-badge--${kind}${onDark?' visa-type-badge--on-dark':''}" data-visa-code="${rate.code}"><span class="visa-code-kicker">Visa</span><strong class="visa-code-value">${rate.code}</strong></span>`;
}
function entryLabel(rate, lang) {
  return `<span class="visa-entry-label">${entries[lang][rate.basis]}</span>`;
}
module.exports = {countryMark,typeBadge,entryLabel};
