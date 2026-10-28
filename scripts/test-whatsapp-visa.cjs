// Offline regression tests: no browser, network, live analytics or messages.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const code = fs.readFileSync(path.join(__dirname, '../assets/whatsapp-source.js'), 'utf8');
const marker = '[WEB INQUIRY - BROS WISATA]';
const sourceCount = href => (new URL(href).searchParams.get('text') || '').split(marker).length - 1;
let tests = 0;
function test(name, callback) {
  try { callback(); tests += 1; }
  catch (error) { error.message = `${name}: ${error.message}`; throw error; }
}

function anchor(href, cta = 'visa_hero') {
  const attrs = {href, 'data-cta': cta};
  return {
    textContent: 'Contact Ms Yana',
    getAttribute: key => attrs[key] || null,
    setAttribute: (key, value) => { attrs[key] = String(value); },
    closest: selector => selector === 'section[id]' ? {id: 'visa-service'} : null,
  };
}

function harness({url, anchors = [], readyState = 'complete', stored = {}, storageThrows = false}) {
  const listeners = {};
  const calls = {gtag: [], fbq: [], clarity: []};
  const storage = new Map(Object.entries(stored));
  const sessionStorage = {
    getItem(key) { if (storageThrows) throw new Error('Storage disabled'); return storage.get(key) || null; },
    setItem(key, value) { if (storageThrows) throw new Error('Storage disabled'); storage.set(key, value); },
  };
  const location = new URL(url);
  const document = {
    readyState,
    referrer: 'https://www.google.com/',
    querySelectorAll: () => anchors.filter(a => a.getAttribute('href')?.includes('wa.me')),
    addEventListener(name, callback, capture) {
      (listeners[name] ||= []).push({callback, capture});
    },
  };
  const window = {
    location, sessionStorage,
    gtag: (...args) => calls.gtag.push(args),
    fbq: (...args) => calls.fbq.push(args),
    clarity: (...args) => calls.clarity.push(args),
  };
  const context = vm.createContext({window, document, URL, URLSearchParams});
  const run = () => vm.runInContext(code, context, {filename: 'whatsapp-source.js'});
  function ready() { for (const {callback} of listeners.DOMContentLoaded || []) callback(); }
  function click(a) {
    const event = {target: {closest: () => a}};
    for (const {callback} of listeners.click || []) callback(event);
  }
  run();
  return {window, document, listeners, calls, storage, run, ready, click};
}

for (const lang of ['id', 'en', 'ms']) {
  for (const [phone, team] of [['6281370233750', 'visa'], ['6281260139399', 'tour']]) {
    test(`${lang} ${team} routing, attribution, one click event and idempotence`, () => {
      const message = 'Hello, dates & plans: +7 days / café #1?';
      const a = anchor(`https://wa.me/${phone}?text=${encodeURIComponent(message)}&app_absent=0`);
      const h = harness({url: `https://broswisata.id/${lang}/indonesia-visa?utm_source=instagram&utm_medium=social&utm_campaign=visa_indonesia&utm_content=story`, anchors: [a]});
      let url = new URL(a.getAttribute('href'));
      let text = url.searchParams.get('text');
      assert.equal(url.hostname, 'wa.me');
      assert.equal(url.pathname, `/${phone}`);
      assert.equal(url.searchParams.get('app_absent'), '0');
      assert(text.endsWith(message), 'original customer-facing message changed');
      assert(text.includes(`Language: ${lang.toUpperCase()}`));
      assert(text.includes('Traffic: instagram/social'));
      assert(text.includes('Campaign: visa_indonesia'));
      assert(text.includes('Content: story'));
      assert.equal(sourceCount(a.getAttribute('href')), 1);
      assert.equal(h.calls.gtag.length, 0, 'lead event fired on page load');
      assert.equal(h.calls.fbq.length, 0, 'Meta event fired on page load');
      assert.equal(h.calls.clarity.filter(c => c[0] === 'event').length, 0);
      const beforeClick = a.getAttribute('href');
      h.run();
      assert.equal(h.listeners.click.length, 1, 'second global click listener registered');
      assert.equal(h.listeners.click[0].capture, true);
      h.click(a);
      assert.equal(a.getAttribute('href'), beforeClick, 'click duplicated source decoration');
      assert.equal(h.calls.gtag.length, 1);
      assert.equal(h.calls.gtag[0][0], 'event');
      assert.equal(h.calls.gtag[0][1], 'lead_whatsapp_inquiry');
      const payload = h.calls.gtag[0][2];
      assert.equal(payload.page_type, 'visa_service');
      assert.equal(payload.page_language, lang.toUpperCase());
      assert.equal(payload.contact_team, team);
      assert.equal(payload.traffic_source, 'instagram');
      assert.equal(payload.traffic_medium, 'social');
      assert.equal(payload.traffic_campaign, 'visa_indonesia');
      assert.equal(h.calls.fbq.length, 1);
      assert.equal(h.calls.fbq[0][0], 'trackCustom');
      assert.equal(h.calls.fbq[0][1], 'WhatsAppLead');
      assert.equal(h.calls.clarity.filter(c => c[0] === 'event' && c[1] === 'lead_whatsapp_inquiry').length, 1);
      h.click(a);
      assert.equal(h.calls.gtag.length, 2, 'a second real click should record exactly one more event');
      assert.equal(sourceCount(a.getAttribute('href')), 1);
      assert.equal(new URL(a.getAttribute('href')).pathname, `/${phone}`);
    });
  }
}

const unrelated = [
  'https://wa.me/6281999999999?text=Please%20call%206281260139399',
  'https://wa.me/62813702337500?text=hello',
  'https://wa.me/0006281370233750?text=hello',
  'https://wa.me/6281370233750/extra?text=hello',
  'https://wa.me/6281370233750extra?text=hello',
  'https://wa.me/%36%32%38%31%33%37%30%32%33%33%37%35%30?text=hello',
  'https://wa.me.evil.example/6281370233750?text=hello',
  'https://evil.example/wa.me/6281260139399?text=hello',
  'https://www.wa.me/6281370233750?text=hello',
  'https://user@wa.me/6281370233750?text=hello',
  'https://wa.me:444/6281370233750?text=hello',
  'http://wa.me/6281370233750?text=hello',
  "javascript:alert('wa.me/6281370233750')",
];
for (const href of unrelated) test(`unrelated or misleading URL remains untouched: ${href}`, () => {
  const a = anchor(href);
  const h = harness({url: 'https://broswisata.id/en/indonesia-visa', anchors: [a]});
  assert.equal(a.getAttribute('href'), href);
  h.click(a);
  assert.equal(a.getAttribute('href'), href);
  assert.equal(h.calls.gtag.length, 0);
  assert.equal(h.calls.fbq.length, 0);
});

test('DOMContentLoaded path retains both distinct teams and emits no load conversion', () => {
  const yana = anchor('https://wa.me/6281370233750?text=Visa', 'visa_contact');
  const ahmad = anchor('https://wa.me/6281260139399?text=Tour', 'tour_contact');
  const h = harness({url: 'https://broswisata.id/id/', anchors: [yana, ahmad], readyState: 'loading'});
  assert.equal(sourceCount(yana.getAttribute('href')), 0);
  h.ready();
  h.ready();
  assert.equal(sourceCount(yana.getAttribute('href')), 1);
  assert.equal(sourceCount(ahmad.getAttribute('href')), 1);
  assert.equal(h.calls.gtag.length, 0);
  h.click(yana);
  h.click(ahmad);
  assert.equal(h.calls.gtag[0][2].contact_team, 'visa');
  assert.equal(h.calls.gtag[1][2].contact_team, 'tour');
  assert.equal(h.calls.gtag[0][2].page_type, 'homepage');
});

test('dynamically inserted Yana link is enriched on click only once', () => {
  const h = harness({url: 'https://broswisata.id/ms/indonesia-visa.html', anchors: []});
  const yana = anchor('https://wa.me/6281370233750/?text=Visa');
  h.click(yana);
  assert.equal(sourceCount(yana.getAttribute('href')), 1);
  assert.equal(new URL(yana.getAttribute('href')).pathname, '/6281370233750/');
  assert.equal(h.calls.gtag.length, 1);
  assert.equal(h.calls.gtag[0][2].page_type, 'visa_service');
});

test('stored attribution persists across landing and visa enquiry pages', () => {
  const stored = {bros_attribution_v1: JSON.stringify({source: 'bing', medium: 'organic', campaign: 'travel', landing_path: '/en/', referrer: 'https://www.bing.com/'})};
  const a = anchor('https://wa.me/6281370233750?text=Visa');
  const h = harness({url: 'https://broswisata.id/en/indonesia-visa', anchors: [a], stored});
  const text = new URL(a.getAttribute('href')).searchParams.get('text');
  assert(text.includes('Landing: /en/'));
  assert(text.includes('Traffic: bing/organic'));
  h.click(a);
  assert.equal(h.calls.gtag[0][2].traffic_source, 'bing');
});

test('disabled session storage does not break the direct visa link', () => {
  const a = anchor('https://wa.me/6281370233750?text=Visa');
  const h = harness({url: 'https://broswisata.id/id/indonesia-visa', anchors: [a], storageThrows: true});
  h.click(a);
  assert.equal(new URL(a.getAttribute('href')).pathname, '/6281370233750');
  assert.equal(sourceCount(a.getAttribute('href')), 1);
  assert.equal(h.calls.gtag.length, 1);
});

test('normal tour route and page type remain unchanged', () => {
  const a = anchor('https://wa.me/6281260139399?text=Private%20tour', 'seo_private-north-sumatra-tour_hero');
  const h = harness({url: 'https://broswisata.id/en/private-north-sumatra-tour', anchors: [a]});
  h.click(a);
  assert.equal(new URL(a.getAttribute('href')).pathname, '/6281260139399');
  assert.equal(h.calls.gtag[0][2].page_type, 'seo_landing');
  assert.equal(h.calls.gtag[0][2].contact_team, 'tour');
});

console.log(`PASS WhatsApp visa regression: ${tests} offline checks; one shared handler, two exact destinations, no page-load leads.`);
