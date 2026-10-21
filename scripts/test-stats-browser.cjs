// Isolated browser fixtures: no production telemetry or authenticated profile.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const {chromium} = require(process.env.BROS_PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const origin = 'https://broswisata.id';
const out = path.join(root,'output/analytics/20261021/qa');
fs.mkdirSync(out,{recursive:true});
const csp = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'";
const fixture = (lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><link rel="canonical" href="${origin}/${lang}/bros-wisata-tour-listing"><script src="/assets/analytics.js"></script><script src="/assets/whatsapp-source.js" defer></script></head><body><h1>Telemetry test fixture, not real visitors</h1><a id="package" href="/${lang}/paket-western_7d6n_ultimate?email=private@example.test">Package</a><a id="wa" data-cta="fixture-wa" href="https://wa.me/6281260139399?text=Guest%20private%40example.test%20needs%20private%20notes">WhatsApp</a><button data-bros-stats-toggle type="button">Settings</button><p data-bros-stats-status></p></body></html>`;
const results=[];
let browser;

async function clientCase(options={}) {
  const context=await browser.newContext();
  const events=[];
  let configs=0;
  await context.addInitScript((options)=>{
    window.__testOffset=0;
    const now=Date.now.bind(Date); Date.now=()=>now()+window.__testOffset;
    document.addEventListener('click',e=>{if(e.target.closest('a'))e.preventDefault();});
    if(options.dnt) Object.defineProperty(navigator,'doNotTrack',{get:()=> '1'});
    if(options.gpc) Object.defineProperty(navigator,'globalPrivacyControl',{get:()=>true});
    if(options.optOut) localStorage.setItem('bros_stats_optout_v1','1');
    if(options.noStorage) for(const key of ['localStorage','sessionStorage']) Object.defineProperty(window,key,{get(){throw new Error('Storage disabled');}});
  },options);
  await context.route('**/*',async route=>{
    const u=new URL(route.request().url());
    if(u.origin!==origin) return route.abort();
    if(u.pathname==='/api/stats/config') { configs++; return route.fulfill({status:options.configError?503:200,contentType:'application/json',body:JSON.stringify({enabled:options.disabled!==true})}); }
    if(u.pathname==='/api/stats/event') {events.push(JSON.parse(route.request().postData()));return route.fulfill({status:204});}
    if(u.pathname.startsWith('/assets/')) {
      const file=path.join(root,u.pathname);
      if(fs.existsSync(file))return route.fulfill({status:200,contentType:'text/javascript',body:fs.readFileSync(file)});
    }
    if(route.request().resourceType()==='document')return route.fulfill({status:200,contentType:'text/html',body:fixture(options.lang||'id')});
    return route.abort();
  });
  const page=await context.newPage();
  await page.goto(`${origin}/${options.lang||'id'}/bros-wisata-tour-listing?email=private@example.test&utm_source=google#private`,{waitUntil:'load',referer:'https://www.google.com/search?q=private@example.test'});
  await page.waitForFunction(()=>window.BrosStats && document.querySelector('[data-bros-stats-toggle]').textContent!=='Settings');
  if(!options.dnt&&!options.gpc&&!options.optOut&&!options.disabled&&!options.configError) {
    if(!options.noStorage)await page.waitForFunction(()=>sessionStorage.getItem('bros_stats_session_v1'));
    await page.waitForTimeout(100);
    assert.equal(events.filter(e=>e.event==='page_view').length,1);
    await page.addScriptTag({url:'/assets/bros-stats.js'});
    await page.addScriptTag({url:'/assets/analytics.js'});
    await page.addScriptTag({url:'/assets/whatsapp-source.js'});
    await page.locator('#wa').focus(); await page.keyboard.press('Enter');
    await page.locator('#package').click();
    await page.waitForTimeout(100);
    assert.equal(events.filter(e=>e.event==='page_view').length,1);
    assert.equal(events.filter(e=>e.event==='whatsapp_click').length,1);
    assert.equal(events.filter(e=>e.event==='package_select').length,1);
    const ga=await page.evaluate(()=>dataLayer.map(x=>Array.from(x)));
    assert.equal(ga.filter(x=>x[0]==='config').length,1);
    assert.equal(ga.filter(x=>x[0]==='event'&&x[1]==='lead_whatsapp_inquiry').length,1);
    const serialized=JSON.stringify(events);
    assert.ok(!/private|example|text=|email|628126|notes|utm_source|referrer/i.test(serialized));
    assert.ok(events.every(e=>e.path===`/${options.lang||'id'}/bros-wisata-tour-listing` && e.source==='google'));
    assert.ok(events.every(e=>Object.keys(e).every(k=>['id','event','session','path','source','device','target'].includes(k))));
    assert.equal(new Set(events.map(e=>e.session)).size,1);
    await page.evaluate(()=>window.__testOffset=31*60*1000);
    await page.locator('#wa').click(); await page.waitForTimeout(100);
    assert.notEqual(events[events.length-1].session,events[0].session);
    const before=events.length;
    await page.locator('[data-bros-stats-toggle]').click();
    await page.locator('#wa').click(); await page.waitForTimeout(50);
    assert.equal(events.length,before,'Opt-out must stop first-party events');
    await page.evaluate(()=>{window.BrosStats.track=()=>{throw new Error('Optional stats failure');};});
    await page.locator('#wa').click();
    const later=await page.evaluate(()=>dataLayer.map(x=>Array.from(x)).filter(x=>x[0]==='event'&&x[1]==='lead_whatsapp_inquiry').length);
    assert.equal(later,4,'Optional first-party failures must not stop the one GA4 lead per click');
  } else {
    await page.waitForTimeout(100);await page.locator('#wa').click();await page.waitForTimeout(50);
    assert.equal(events.length,0);
    if(options.dnt||options.gpc||options.optOut) assert.equal(configs,0);
  }
  results.push({kind:'client',options,status:'PASS'});await context.close();
}

function report(days=28) {
  return {range:{days,from:days===7?'2026-10-15':days===90?'2026-07-24':'2026-09-24',to:'2026-10-21',timezone:'Asia/Jakarta'},
    totals:{sessions:12,pageViews:20,whatsappClicks:3,packageSelections:5},
    daily:[{date:'2026-10-20',sessions:7,pageViews:12,whatsappClicks:1,packageSelections:2},{date:'2026-10-21',sessions:5,pageViews:8,whatsappClicks:2,packageSelections:3}],
    pages:[{path:'/id/bros-wisata-tour-listing',pageViews:20,whatsappClicks:3}],sources:[{source:'google',sessions:12,pageViews:20,whatsappClicks:3}],
    devices:[{device:'mobile',sessions:12,pageViews:20}],packages:[{packageId:'paket-western_7d6n_ultimate',selections:5}],languages:[{language:'id',pageViews:20,whatsappClicks:3}]};
}

async function dashboardCase(state,width) {
  const context=await browser.newContext({viewport:{width,height:1000}});
  const page=await context.newPage();let requests=0;
  await context.route('**/*',async route=>{
    const u=new URL(route.request().url());
    if(u.origin!==origin)return route.abort();
    if(u.pathname==='/ops/analytics/report') {
      requests++;const data=report(Number(u.searchParams.get('days')));
      if(state==='empty'){for(const key of Object.keys(data.totals))data.totals[key]=0;for(const key of ['daily','pages','sources','devices','packages','languages'])data[key]=[];}
      if(state==='invalid')data.totals.sessions=-1;
      if(state==='injection')data.pages[0].path='<img src=x onerror="window.__injected=1">';
      return route.fulfill({status:state==='auth'?403:state==='config'?503:state==='server'?500:200,contentType:'application/json',body:JSON.stringify(state==='auth'||state==='config'||state==='server'?{error:'unavailable'}:data)});
    }
    const filename=u.pathname==='/ops/analytics'?'/assets/bros-stats-dashboard.html':u.pathname;
    const file=path.join(root,filename);
    if(!fs.existsSync(file))return route.abort();
    return route.fulfill({status:200,headers:filename.endsWith('.html')?{'Content-Security-Policy':csp}:{},contentType:filename.endsWith('.css')?'text/css':filename.endsWith('.js')?'text/javascript':filename.endsWith('.png')?'image/png':'text/html',body:fs.readFileSync(file)});
  });
  await page.goto(`${origin}/ops/analytics`,{waitUntil:'load'});
  await page.waitForFunction(()=>document.getElementById('report-content').getAttribute('aria-busy')==='false');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${state} ${width} overflow`);
  assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.some(i=>!i.complete||!i.naturalWidth)),false);
  await page.locator('.logout-link').focus();
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.locator('.skip-link').evaluate(el=>el===document.activeElement),true,'Skip link remains keyboard accessible');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.skip-link').evaluate(el=>getComputedStyle(el).clipPath),'inset(100%)');
  const metric=await page.locator('#metric-sessions').textContent();
  if(['auth','config','server','invalid'].includes(state))assert.equal(metric,'—');
  else assert.equal(metric,state==='empty'?'0':'12');
  if(state==='injection')assert.equal(await page.evaluate(()=>window.__injected),undefined);
  if(state==='success') {
    assert.equal(await page.locator('.chart-bar').count(),4);
    await page.locator('#report-days').selectOption('7');
    await page.waitForFunction(()=>document.getElementById('report-content').getAttribute('aria-busy')==='false');
    assert.ok((await page.locator('#report-period').textContent()).includes('15 Okt'));
    await page.locator('#refresh-button').focus();await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.getElementById('report-content').getAttribute('aria-busy')==='false');
    assert.ok(requests>=3);
    await page.locator('#daily-details summary').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#daily-details').evaluate(el=>el.open),true);
  }
  if(['success','empty','config'].includes(state))await page.screenshot({path:path.join(out,`dashboard-${state}-${width}.png`),fullPage:true});
  results.push({kind:'dashboard',state,width,status:'PASS'});await context.close();
}

(async()=>{
  browser=await chromium.launch({headless:true,...(process.env.BROS_CHROMIUM_PATH?{executablePath:process.env.BROS_CHROMIUM_PATH}:{})});
  try {
    for(const lang of ['id','en','ms'])await clientCase({lang});
    for(const options of [{dnt:true},{gpc:true},{optOut:true},{disabled:true},{configError:true},{noStorage:true}])await clientCase(options);
    for(const width of [390,1440])for(const state of ['success','empty','auth','config','server','invalid','injection'])await dashboardCase(state,width);
    fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(results,null,2));
    console.log(`PASS ${results.length} isolated client/dashboard cases; no real telemetry sent.`);
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
