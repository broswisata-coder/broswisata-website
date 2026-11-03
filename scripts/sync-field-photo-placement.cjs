'use strict';
// Bounded photo-only placements. No itinerary, price, terms, metadata or sitemap writes.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {photos,card,style,escape}=require('./sync-photo-journal.cjs');
const {base,credit,locales}=require('./field-collection-20261103-data.cjs');
const root=path.resolve(__dirname,'..'),check=process.argv.includes('--check');
const start='<!-- BROS FIELD ROUTE GALLERY START -->',end='<!-- BROS FIELD ROUTE GALLERY END -->';
const routes={'bukit_lawang_4h3m':['20','27','57'],'medan_heritage_3h2m':['41','36','38']};
function picture(id,lang,{classes='',eager=false}={}){const p=photos.find(p=>p.photoId===id);assert(p,'Unknown photo '+id);return `<picture><source type="image/webp" srcset="${base}${p.slug}-640.webp ${p.smallWidth}w, ${base}${p.slug}.webp ${p.width}w" sizes="(max-width:650px) calc(100vw - 40px), 520px"/><img src="${base}${p.slug}.jpg" width="${p.width}" height="${p.height}" alt="${escape(p[lang][1])}"${classes?` class="${classes}"`:''} loading="${eager?'eager':'lazy'}" decoding="async"/></picture>`;}
function gallery(lang,ids){const t=locales[lang];return `${start}\n<section class="field-route-gallery" id="route-photos" aria-labelledby="route-photos-title"><h2 id="route-photos-title">${t.routeTitle}</h2><p class="field-route-gallery__intro">${t.routeIntro}</p><div class="photo-journal__grid">\n${ids.map(id=>card(photos.find(p=>p.photoId===id),lang)).join('\n')}\n</div></section>\n${end}\n`;}
const changed=[];
function write(relative,transform){const file=path.join(root,relative),old=fs.readFileSync(file,'utf8'),nl=old.includes('\r\n')?'\r\n':'\n',html=transform(old,nl);if(html!==old){changed.push(relative);if(!check)fs.writeFileSync(file,html);}}
for(const lang of ['id','en','ms']){
 for(const [slug,ids]of Object.entries(routes))write(`${lang}/paket-${slug}.html`,(html,nl)=>{let out=style(html);const mark=out.includes(start)?new RegExp(start+'[\\s\\S]*?'+end+'\\s*'): /<!-- INSTAGRAM CAROUSEL PREVIEW -->[\s\S]*?(?=<!-- ITINERARY -->)/;assert(mark.test(out),'Missing photo insertion contract '+lang+slug);return out.replace(mark,gallery(lang,ids).replace(/\n/g,nl));});
 const toba={id:'private-tour-lake-toba-samosir',en:'lake-toba-samosir-private-tour',ms:'pakej-lake-toba-samosir'}[lang];
 write(`${lang}/${toba}.html`,(html,nl)=>{const alt={id:'Danau Toba dan perbukitan hijau di bawah langit berawan',en:'Lake Toba and green hills under a cloudy sky',ms:'Danau Toba dan bukit menghijau di bawah langit berawan'}[lang];const p=photos.find(p=>p.photoId==='10');const pic=`<picture><source type="image/webp" srcset="${base}${p.slug}-640.webp 640w, ${base}${p.slug}.webp 1200w" sizes="(max-width:900px) calc(100vw - 48px), 520px"/><img src="${base}${p.slug}.jpg" width="1200" height="800" alt="${alt}" loading="eager" decoding="async"/></picture>`;const figure=`<figure class="seo-hero-photo seo-hero-photo--field">\n      ${pic}\n      <figcaption>${alt}. ${lang==='en'?'Photo':'Foto'}: ${credit}.</figcaption>\n    </figure>`;assert(/<figure class="seo-hero-photo(?: seo-hero-photo--field)?">[\s\S]*?<\/figure>/.test(html),'Missing Toba hero');return style(html).replace(/<figure class="seo-hero-photo(?: seo-hero-photo--field)?">[\s\S]*?<\/figure>/,figure.replace(/\n/g,nl));});
 for(const name of ['index.html','bros-wisata-homepage.html'])write(`${lang}/${name}`,(html,nl)=>{
  // Repair the three existing scene/caption mismatches, not the rest of the mosaic.
  const replacements=[
   ['20',/alt="(?:Rute eco orangutan Bukit Lawang|Bukit Lawang orangutan eco route|Laluan eco orangutan Bukit Lawang)"/],
   ['38',/alt="(?:Rute Medan heritage short stay|Medan heritage short stay route|Laluan Medan heritage short stay)"/],
   ['57',/alt="Bukit Lawang jungle suspension bridge"/]
  ];
  // Match each picture individually; never span another picture tag.
  let out=html.replace(/<picture>[^]*?<\/picture>/g,block=>{for(const[id,alt]of replacements)if(alt.test(block))return picture(id,lang,{classes:'w-full h-full object-contain field-photo-full-frame'});if(block.includes(base)&&block.includes('class="w-full h-full object-contain"'))return block.replace('class="w-full h-full object-contain"','class="w-full h-full object-contain field-photo-full-frame"');return block;});
  const bridgeCaption={id:'Jembatan gantung',en:'Suspension bridge',ms:'Jambatan gantung'}[lang];
  out=out.replace(new RegExp(`(<a[^>]+href="/${lang}/paket-western_4d3n_jungle"[^>]*>[\\s\\S]*?<\\/a>)`,'g'),block=>block.includes(base+'suspension-bridge-guests')?block.replace('Jungle Lodge',bridgeCaption):block);
  return out;
 });
}
if(check&&changed.length)throw Error('Field photo placements out of sync: '+changed.join(', '));
console.log(check?'Field photo placements synchronized.':`Field photo placements updated in ${changed.length} pages.`);
module.exports={picture,gallery};
