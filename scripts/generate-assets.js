import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'assets');
const logoPng = path.join(assetsDir, 'logo.png');

async function generateLogoAssets() {
  if (!fs.existsSync(logoPng)) {
    console.error('assets/logo.png not found');
    return;
  }

  // 1. logo-96.webp (for 2x high DPI 48x48)
  await sharp(logoPng)
    .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 85 })
    .toFile(path.join(assetsDir, 'logo-96.webp'));

  // 2. logo-48.webp (for 1x 48x48)
  await sharp(logoPng)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 85 })
    .toFile(path.join(assetsDir, 'logo-48.webp'));

  // 3. logo-96.avif (for next-gen avif support)
  await sharp(logoPng)
    .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .avif({ quality: 80 })
    .toFile(path.join(assetsDir, 'logo-96.avif'));

  // 4. logo-48.avif
  await sharp(logoPng)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .avif({ quality: 80 })
    .toFile(path.join(assetsDir, 'logo-48.avif'));

  console.log('Successfully generated logo-96.webp, logo-48.webp, logo-96.avif, logo-48.avif');
}

generateLogoAssets().catch(console.error);
