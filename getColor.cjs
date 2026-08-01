const fs = require('fs');
const { PNG } = require('pngjs');

const readPixel = (filePath) => {
  fs.createReadStream(filePath)
    .pipe(new PNG())
    .on('parsed', function() {
      // Top left pixel
      const idx = (this.width * 0 + 0) << 2;
      const r = this.data[idx];
      const g = this.data[idx + 1];
      const b = this.data[idx + 2];
      const a = this.data[idx + 3];
      
      console.log(`Color for ${filePath}: rgba(${r}, ${g}, ${b}, ${a})`);
      console.log(`Hex: #${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
    });
};

readPixel('/icons/star-icon.png');
readPixel('/icons/map-icon.png');
readPixel('/icons/airplane-icon.png');
