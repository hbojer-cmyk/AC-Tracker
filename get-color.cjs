const fs = require('fs');
const PNG = require('pngjs').PNG;

fs.createReadStream('./icons/airplane-icon.png')
  .pipe(new PNG())
  .on('parsed', function() {
    const w = this.width;
    const h = this.height;
    const tl = 0;
    const tr = (w - 1) << 2;
    const bl = (w * (h - 1)) << 2;
    const br = (w * h - 1) << 2;
    [tl, tr, bl, br].forEach(idx => {
      const r = this.data[idx];
      const g = this.data[idx+1];
      const b = this.data[idx+2];
      const a = this.data[idx+3];
      console.log(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
    });
  });
