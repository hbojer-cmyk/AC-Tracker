import fs from 'fs';
import path from 'path';

// Clean up legacy singular 'dist/icon' duplicate if present
const legacyIconDir = path.resolve('dist', 'icon');
if (fs.existsSync(legacyIconDir)) {
  fs.rmSync(legacyIconDir, { recursive: true, force: true });
  console.log('Removed legacy dist/icon duplicate directory');
}

// Primary consolidated graphics folder
const srcDir = path.resolve('icons');
if (fs.existsSync(srcDir)) {
  // Copy to dist/icons
  const destIconsDir = path.resolve('dist', 'icons');
  fs.cpSync(srcDir, destIconsDir, { recursive: true });
  console.log('Successfully copied icons to dist/icons');
} else {
  console.warn('Warning: icons directory does not exist!');
}

// Copy manifest.json to dist
const manifestSrc = path.resolve('manifest.json');
if (fs.existsSync(manifestSrc)) {
  const manifestDest = path.resolve('dist', 'manifest.json');
  fs.copyFileSync(manifestSrc, manifestDest);
  console.log('Successfully copied manifest.json to dist/manifest.json');
}

// Copy Mission Control Center dashboard (act-mcc-9f2b.html is the canonical source)
// admin.html is a local working copy — keep both in sync via: copy admin.html → act-mcc-9f2b.html
const mccSrc = path.resolve('act-mcc-9f2b.html');
if (fs.existsSync(mccSrc)) {
  fs.copyFileSync(mccSrc, path.resolve('dist', 'act-mcc-9f2b.html'));
  console.log('Successfully copied MCC dashboard to dist/act-mcc-9f2b.html');
} else {
  console.warn('Warning: act-mcc-9f2b.html not found — MCC dashboard will not be in dist.');
}

