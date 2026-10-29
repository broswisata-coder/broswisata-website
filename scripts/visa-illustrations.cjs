// Shared, decorative 3D enamel icons. No official seals, issued-document
// imagery, approval marks or third-party icon runtime.
const {iconMarkup} = require('./bros-3d-icons.cjs');
const allowed = new Set(['passport','business','multiple','permit','home','extension','chat','review','document','coordinate']);
function icon(key, className = '') {
  if (!allowed.has(key)) throw new Error('Unknown visa icon: ' + key);
  return iconMarkup(key, `visa-icon ${className}`.trim(), 48);
}
module.exports = {icon};
