'use strict';
// Supplied non-generatively corrected photos. Full frame; no capture-date claim.
// --check verifies all 9 localized homepage/alias/Meet Ahmad sections.
const fs=require('node:fs'),path=require('node:path');
const {base,credit,cssHref,locales,loadPhotos}=require('./field-collection-20261103-data.cjs');
const root=path.resolve(__dirname,'..'),checkOnly=process.argv.includes('--check');
const photos=loadPhotos();
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
function card(photo,lang){
 const [title,caption]=photo[lang],w=photo.width,h=photo.height,small=photo.smallWidth||640;
 return `<figure class="photo-journal__card" data-photo-id="${photo.photoId}">
<a class="photo-journal__image-link" href="${base}${photo.slug}.jpg" target="_blank" rel="noopener noreferrer" aria-label="${escape(locales[lang].open+': '+title)}"><picture><source type="image/webp" srcset="${base}${photo.slug}-640.webp ${small}w, ${base}${photo.slug}.webp ${w}w" sizes="(max-width:650px) calc(100vw - 40px), (max-width:1280px) calc((100vw - 96px) / 3), 395px"/>
<img src="${base}${photo.slug}.jpg" width="${w}" height="${h}" alt="${escape(caption)}" loading="lazy" decoding="async"/></picture></a>
<figcaption><strong>${escape(title)}</strong>${escape(caption)}<span class="photo-journal__credit">${locales[lang].credit}: ${credit}</span></figcaption>
</figure>`;
}
function section(lang,full){
 const t=locales[lang],selected=full?photos:['10','55','41'].map(id=>photos.find(p=>p.photoId===id));
 const link=full?`/${lang}/bros-wisata-custom-tour`:`/${lang}/meet-ahmad#foto-terbaru`;
 const button=`<a class="photo-journal__link" href="${link}">${full?t.cta:t.all}<span aria-hidden="true">&#8594;</span></a>`;
 return `<!-- PHOTO JOURNAL START -->
<section class="photo-journal" id="foto-terbaru" aria-labelledby="photo-journal-title">
<div class="photo-journal__inner"><div class="photo-journal__head"><div>
<p class="photo-journal__kicker">${t.kicker}</p><h2 id="photo-journal-title">${t.title}</h2>
<p class="photo-journal__intro">${full?t.fullIntro:t.intro}</p>
</div>${full?'':button}</div><div class="photo-journal__grid">
${selected.map(photo=>card(photo,lang)).join('\n')}
</div>${full?`<p class="photo-journal__note">${t.note}</p><div class="photo-journal__footer">${button}</div>`:''}
</div></section>
<!-- PHOTO JOURNAL END -->`;
}
function style(html){const tag=`<link href="${cssHref}" rel="stylesheet"/>`;if(/<link[^>]+href="\/assets\/photo-journal\.css[^"\n]*"[^>]*>/.test(html))return html.replace(/<link[^>]+href="\/assets\/photo-journal\.css[^"\n]*"[^>]*>/g,tag);return html.replace('</head>',tag+'\n</head>');}
function sync(){const changed=[];for(const lang of Object.keys(locales))for(const name of ['index.html','bros-wisata-homepage.html','meet-ahmad.html']){const relative=`${lang}/${name}`,filename=path.join(root,relative),original=fs.readFileSync(filename,'utf8'),nl=original.includes('\r\n')?'\r\n':'\n';let html=style(original);if(!html.includes('<!-- PHOTO JOURNAL START -->'))throw Error('Missing journal marker '+relative);html=html.replace(/<!-- PHOTO JOURNAL START -->[\s\S]*?<!-- PHOTO JOURNAL END -->/,section(lang,name==='meet-ahmad.html').replace(/\n/g,nl));if(html!==original){changed.push(relative);if(!checkOnly)fs.writeFileSync(filename,html,'utf8');}}if(checkOnly&&changed.length)throw Error('Photo journal out of sync: '+changed.join(', '));console.log(checkOnly?'Photo journal synchronized across 9 localized pages.':`Photo journal updated in ${changed.length} pages.`);}
if(require.main===module)sync();
module.exports={photos,card,style,escape};
