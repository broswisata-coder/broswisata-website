// Web delivery derivatives from user-approved, non-generative tonal corrections.
// Full source frames: resize only, without enlargement, cropping or further colour edits.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const bundled = 'C:/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_entry.cjs';
const req = fs.existsSync(path.dirname(bundled)) ? createRequire(bundled) : require;
const sharp = req('sharp');
const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'output/instagram/BROS-FOTO-BARU-15-KONTEN-20261103-CERAH-V2/EDITABLE/edits');
const DEST = path.join(ROOT, 'assets/gallery/field-collection-20261103');
const EVIDENCE = path.join(ROOT, 'output/web-photo-preview-20261103/assets.json');
const CREDIT = 'Ahmad and team';
const NOTE = 'Non-generative tonal correction; no content changes';
const WIDTH = 1200;
const SMALL = 640;
// Explicit binary delivery budgets; quality remains 85 / 84 without exception.
const BUDGET = { webp: 300 * 1024, smallWebp: 110 * 1024 };
const selected = [
  ['10', 'lake-toba-panorama'],
  ['20', 'orangutan-canopy'],
  ['41', 'maimun-palace-exterior'],
  ['13', 'lake-toba-viewpoint-guest'],
  ['61', 'travel-group-jungle-inn'],
  ['38', 'medan-grand-mosque-exterior'],
  ['36', 'maimun-palace-interior'],
  ['57', 'suspension-bridge-guests'],
  ['55', 'young-orangutan-branches'],
  ['08', 'traditional-roof-detail'],
  ['27', 'forest-fungi-detail'],
  ['44', 'forest-primate-on-branch'],
  ['05', 'waterfall-rockface'],
  ['02', 'lakeside-windmill'],
  ['37', 'medan-grand-mosque-interior']
];
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const relative = p => path.relative(ROOT, p).replaceAll('\\', '/');
const sizes = p => fs.statSync(p).size;
const outputFiles = slug => ({
  jpg: path.join(DEST, slug + '.jpg'),
  webp: path.join(DEST, slug + '.webp'),
  smallWebp: path.join(DEST, slug + '-640.webp')
});

async function create() {
  fs.mkdirSync(DEST, { recursive: true });
  const publicRows = [], privateRows = [];
  for (const [id, slug] of selected) {
    const source = path.join(SOURCE, 'P' + id + '.png');
    if (!fs.existsSync(source)) throw Error('Missing approved source: P' + id + '.png');
    const bytes = fs.readFileSync(source);
    const sm = await sharp(bytes).metadata();
    if (sm.format !== 'png' || !sm.width || !sm.height) throw Error('Invalid approved source: P' + id);
    const files = outputFiles(slug);
    const full = () => sharp(bytes).resize({ width: WIDTH, withoutEnlargement: true });
    await full().jpeg({ quality: 88, mozjpeg: true }).toFile(files.jpg);
    await full().webp({ quality: 85 }).toFile(files.webp);
    await sharp(bytes).resize({ width: SMALL, withoutEnlargement: true }).webp({ quality: 84 }).toFile(files.smallWebp);
    const fm = await sharp(files.webp).metadata();
    const tm = await sharp(files.smallWebp).metadata();
    const bytecounts = Object.fromEntries(Object.entries(files).map(([k, p]) => [k, sizes(p)]));
    const row = { id, slug, width: fm.width, height: fm.height, smallWidth: tm.width, smallHeight: tm.height, bytecounts, credit: CREDIT, sourceNote: NOTE };
    publicRows.push(row);
    privateRows.push({
      ...row,
      source: relative(source),
      sourceSha256: sha(bytes),
      sourceWidth: sm.width,
      sourceHeight: sm.height,
      outputs: Object.fromEntries(Object.entries(files).map(([k, file]) => [k, { file: relative(file), bytes: sizes(file), sha256: sha(fs.readFileSync(file)) }])),
      processing: { resizedOnly: true, crop: false, enlarged: false, furtherColourCorrection: false, ai: false, jpegQuality: 88, jpegMozjpeg: true, webpQuality: 85, smallWebpQuality: 84 }
    });
  }
  fs.writeFileSync(path.join(DEST, 'manifest.json'), JSON.stringify(publicRows, null, 2) + '\n');
  fs.mkdirSync(path.dirname(EVIDENCE), { recursive: true });
  fs.writeFileSync(EVIDENCE, JSON.stringify({ preparedAtUtc: new Date().toISOString(), sourcePolicy: NOTE, publicManifest: relative(path.join(DEST, 'manifest.json')), imageCount: selected.length * 3, photos: privateRows }, null, 2) + '\n');
}

async function check() {
  const errors = [];
  const manifest = JSON.parse(fs.readFileSync(path.join(DEST, 'manifest.json'), 'utf8'));
  const provenance = JSON.parse(fs.readFileSync(EVIDENCE, 'utf8'));
  if (!Array.isArray(manifest) || manifest.length !== selected.length) errors.push('Public manifest must contain exactly 15 records');
  const allowed = ['id', 'slug', 'width', 'height', 'smallWidth', 'smallHeight', 'bytecounts', 'credit', 'sourceNote'];
  const expectedNames = new Set(selected.flatMap(([, slug]) => Object.values(outputFiles(slug)).map(p => path.basename(p))));
  const actualNames = fs.readdirSync(DEST).filter(f => /\.(jpe?g|webp|png)$/i.test(f));
  if (actualNames.length !== 45) errors.push('Expected exactly 45 delivery image files');
  for (const name of actualNames) if (!expectedNames.has(name)) errors.push('Unexpected delivery file: ' + name);
  for (const [id, slug] of selected) {
    const row = manifest.find(r => r.id === id && r.slug === slug);
    if (!row) { errors.push('Missing public record: ' + id); continue; }
    if (Object.keys(row).some(k => !allowed.includes(k))) errors.push('Unexpected public metadata field: ' + id);
    if (row.credit !== CREDIT || row.sourceNote !== NOTE) errors.push('Credit/provenance note mismatch: ' + id);
    const source = path.join(SOURCE, 'P' + id + '.png');
    const sm = await sharp(source).metadata();
    const fullWidth = Math.min(WIDTH, sm.width), smallWidth = Math.min(SMALL, sm.width);
    const fullHeight = Math.round(sm.height * fullWidth / sm.width), smallHeight = Math.round(sm.height * smallWidth / sm.width);
    if (row.width !== fullWidth || row.height !== fullHeight || row.smallWidth !== smallWidth || row.smallHeight !== smallHeight) errors.push('Manifest geometry/aspect mismatch: ' + id);
    for (const [kind, file] of Object.entries(outputFiles(slug))) {
      if (!fs.existsSync(file)) { errors.push('Missing asset: ' + relative(file)); continue; }
      const m = await sharp(file).metadata();
      await sharp(file).raw().toBuffer();
      const targetWidth = kind === 'smallWebp' ? smallWidth : fullWidth;
      const targetHeight = kind === 'smallWebp' ? smallHeight : fullHeight;
      if (m.width !== targetWidth || m.height !== targetHeight) errors.push('Output geometry mismatch: ' + relative(file));
      if (m.format !== (kind === 'jpg' ? 'jpeg' : 'webp')) errors.push('Output format mismatch: ' + relative(file));
      const bytes = sizes(file);
      if (row.bytecounts[kind] !== bytes) errors.push('Manifest byte count mismatch: ' + relative(file));
      if (BUDGET[kind] && bytes >= BUDGET[kind]) errors.push('Delivery byte budget exceeded: ' + relative(file) + ' (' + bytes + ')');
      const saved = provenance.photos.find(r => r.id === id)?.outputs[kind];
      if (!saved || saved.sha256 !== sha(fs.readFileSync(file))) errors.push('Output provenance hash mismatch: ' + relative(file));
    }
    const saved = provenance.photos.find(r => r.id === id);
    if (!saved || saved.sourceSha256 !== sha(fs.readFileSync(source))) errors.push('Approved source hash mismatch: ' + id);
  }
  const serialized = JSON.stringify(manifest);
  if (/C:[/\\]|Users[/\\]|EDITABLE|sourceSha|outputSha|\.png/i.test(serialized)) errors.push('Private provenance leaked into public manifest');
  const summary = { status: errors.length ? 'FAIL' : 'PASS', images: actualNames.length, photoCount: manifest.length, budgetsKiB: { webp: 300, smallWebp: 110 }, totals: manifest.reduce((a, r) => ({ jpg: a.jpg + r.bytecounts.jpg, webp: a.webp + r.bytecounts.webp, smallWebp: a.smallWebp + r.bytecounts.smallWebp }), { jpg: 0, webp: 0, smallWebp: 0 }), errors, photos: manifest };
  console.log(JSON.stringify(summary, null, 2));
  if (errors.length) process.exitCode = 1;
}

(async () => { if (!process.argv.includes('--check')) await create(); await check(); })().catch(e => { console.error(e); process.exit(1); });
