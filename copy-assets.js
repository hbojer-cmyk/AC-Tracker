import fs from 'fs';
import path from 'path';

// Primary consolidated graphics folder
const srcDir = path.resolve('icons');
if (fs.existsSync(srcDir)) {
  // Copy to dist/icons
  const destIconsDir = path.resolve('dist', 'icons');
  fs.cpSync(srcDir, destIconsDir, { recursive: true });
  console.log('Successfully copied icons to dist/icons');

  // Also mirror to dist/icon for seamless singular/plural path compatibility
  const destIconDir = path.resolve('dist', 'icon');
  fs.cpSync(srcDir, destIconDir, { recursive: true });
  console.log('Successfully copied icons to dist/icon (compatibility mirror)');
} else {
  console.warn('Warning: icons directory does not exist!');
}
