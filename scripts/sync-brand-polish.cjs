const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const cssHref = '/assets/bros-brand-polish.css?v=20261028';
const titleStart = '<!-- BROS TITLE MOTIF START -->';
const titleEnd = '<!-- BROS TITLE MOTIF END -->';
const brandStart = '<!-- BROS BRAND POLISH START -->';
const brandEnd = '<!-- BROS BRAND POLISH END -->';
const symbols = fs.readFileSync(path.join(root, 'assets/bros/icons/bros-icons.svg'), 'utf8');

function familyFor(relative, html) {
  const stem = path.basename(relative, '.html');
  if (stem === 'indonesia-visa') return 'visa';
  if (['privacy-policy', 'terms-of-service'].includes(stem)) return 'policy';
  if (['index', 'bros-wisata-homepage'].includes(stem)) return 'home';
  if (stem === 'bros-wisata-tour-listing') return 'tours';
  if (stem.startsWith('paket-')) return 'package';
  if (stem === 'bros-wisata-custom-tour') return 'custom';
  if (stem === 'bros-wisata-car-rental') return 'rental';
  if (stem === 'bros-wisata-contact') return 'contact';
  if (stem === 'bros-wisata-about') return 'about';
  if (stem === 'meet-ahmad') return 'guide';
  if (stem === 'responsible-travel') return 'responsible';
  if (/class=["'][^"']*\bseo-page\b/.test(html)) return 'seo';
  if (/destinasi|destination/.test(stem)) return 'destination';
  throw new Error('Unclassified public page: ' + relative);
}

function iconFor(relative, family) {
  if (family === 'policy') return 'document';
  if (family === 'contact') return 'chat';
  if (family === 'rental') return 'car';
  if (['about', 'guide'].includes(family)) return 'guide';
  if (/toba|samosir|halal_\d/.test(relative)) return 'lake';
  if (/berastagi|volcano/.test(relative)) return 'mountain';
  if (/lawang|tangkahan|jungle/.test(relative) || family === 'responsible' || family === 'destination') return 'forest';
  return family === 'home' ? 'mountain' : 'route';
}

function motif(name) {
  const extra = {
    document: '<path d="M16 8h24l10 10v38H16V8Z" fill="#0f47b0"/><path d="M40 8v12h10" fill="#e8a317"/><path d="M24 29h18m-18 9h18m-18 9h10" fill="none" stroke="#f7f3ea" stroke-width="3" stroke-linecap="round"/>',
    forest: '<path d="m19 9-13 22h8L3 48h20V30L19 9Z" fill="#0f47b0"/><path d="m41 6-16 27h10L22 53h38L47 33h10L41 6Z" fill="#0f47b0"/><path d="M41 41v17M18 47v10" stroke="#e8a317" stroke-width="4" stroke-linecap="round"/>',
  };
  const drawing = extra[name] || symbols.match(new RegExp(`<symbol id="bros-icon-${name}"[^>]*>([\\s\\S]*?)<\\/symbol>`))?.[1];
  if (!drawing) throw new Error('Missing Bros motif: ' + name);
  return `<svg class="bros-brand-icon" width="52" height="52" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${drawing}</svg>`;
}

function lockup(commercial) {
  const route = '<svg viewBox="0 0 560 64" width="560" height="64" aria-hidden="true" focusable="false"><path d="M2 39c81-46 117 24 195-8S338 7 397 33s103 13 161-9" fill="none" stroke="#0f47b0" stroke-width="2" stroke-dasharray="5 9" stroke-linecap="round"/><circle cx="8" cy="36" r="5" fill="#e8a317"/><circle cx="552" cy="27" r="5" fill="#0f47b0"/></svg>';
  const companion = commercial ? '<img class="bros-travel-companion" src="/assets/visa/bros-visa-companion.webp" width="512" height="768" alt="" aria-hidden="true" loading="lazy" decoding="async"/>' : '';
  return `${brandStart}\n<div class="bros-brand-lockup${commercial ? '' : ' bros-brand-lockup--quiet'}" aria-hidden="true"><div class="bros-brand-lockup-inner"><img class="bros-brand-mark" src="/bros-wisata-logos/bros-wisata-logo-horizontal.svg" width="300" height="80" alt="" aria-hidden="true" loading="lazy" decoding="async"/><div class="bros-brand-route">${route}</div>${companion}</div></div>\n${brandEnd}`;
}

function synchronizeBrandPolish(original, relative) {
  if (!/^(id|en|ms)\/[^/]+\.html$/.test(relative)) throw new Error('Brand polish is limited to localized public HTML: ' + relative);
  const newline = original.includes('\r\n') ? '\r\n' : '\n';
  let html = original.replace(/\r\n/g, '\n');
  html = html.replace(/<!-- BROS TITLE MOTIF START -->[\s\S]*?<!-- BROS TITLE MOTIF END -->/g, '');
  html = html.replace(/<!-- BROS BRAND POLISH START -->[\s\S]*?<!-- BROS BRAND POLISH END -->\n?/g, '');
  const family = familyFor(relative, html);
  html = html.replace(/<body\b[^>]*>/i, tag => tag.replace(/\sdata-bros-polish=["'][^"']*["']/g, '').replace(/>$/, ` data-bros-polish="${family}">`));
  if (family !== 'visa') {
    if ((html.match(/<h1\b/gi) || []).length !== 1) throw new Error('Expected one public page heading: ' + relative);
    html = html.replace(/<h1\b[^>]*>/i, tag => `${tag}${titleStart}<span class="bros-title-motif" aria-hidden="true">${motif(iconFor(relative, family))}</span>${titleEnd}`);
    if (!/<footer\b/i.test(html)) throw new Error('Missing footer: ' + relative);
    const commercial = ['home', 'tours', 'package', 'custom', 'rental', 'contact'].includes(family);
    html = html.replace(/<footer\b/i, `${lockup(commercial)}\n<footer`);
  }
  // The visa page already has its own icons, official logo and mascot.
  const link = `<link id="bros-brand-polish-style" href="${cssHref}" rel="stylesheet"/>`;
  if (html.includes('id="bros-brand-polish-style"')) {
    html = html.replace(/<link\b(?=[^>]*\bid="bros-brand-polish-style")[^>]*>/, link);
  } else {
    html = html.replace('</head>', `${link}\n</head>`);
  }
  return html.replace(/\n/g, newline);
}

module.exports = {synchronizeBrandPolish, familyFor, iconFor};
if (require.main === module) {
  const check = process.argv.includes('--check');
  const changed = [];
  let count = 0;
  for (const lang of ['id', 'en', 'ms']) for (const name of fs.readdirSync(path.join(root, lang)).filter(n => n.endsWith('.html')).sort()) {
    const relative = `${lang}/${name}`;
    const file = path.join(root, relative);
    const original = fs.readFileSync(file, 'utf8');
    const updated = synchronizeBrandPolish(original, relative);
    count++;
    if (original !== updated) {
      changed.push(relative);
      if (!check) fs.writeFileSync(file, updated, 'utf8');
    }
  }
  if (check && changed.length) throw new Error('Brand polish out of sync: ' + changed.join(', '));
  console.log(check ? `Bros brand polish synchronized across ${count} localized pages.` : `Applied Bros brand polish to ${changed.length}/${count} localized pages.`);
}
