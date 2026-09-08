import fs from 'fs';
import path from 'path';

const dirs = ['Map-icons', 'icons', 'Headers', 'event-icons'];
dirs.forEach(dir => {
  const srcDir = path.resolve(dir);
  const destDir = path.resolve('dist', dir);
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log(`Successfully copied ${dir} to dist/${dir}`);
  } else {
    console.warn(`Warning: ${dir} directory does not exist!`);
  }
});
