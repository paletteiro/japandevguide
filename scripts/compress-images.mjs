import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const INPUT_DIR  = './images/ebook_images';
const OUTPUT_DIR = './images/ebook_images';
const MAX_WIDTH  = 900;   // pillar cards display at ~650px, 900px covers 2x retina
const QUALITY    = 82;    // good quality/size balance

const files = await readdir(INPUT_DIR);
const jpegs = files.filter(f => /\.(jpg|jpeg)$/i.test(f));

let saved = 0;
let count = 0;

for (const file of jpegs) {
  const inputPath  = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, file);

  const { size: before } = await stat(inputPath);
  const meta = await sharp(inputPath).metadata();

  // Skip if already small enough
  if (before < 200 * 1024 && meta.width <= MAX_WIDTH) {
    console.log(`  skip  ${file} (${(before/1024).toFixed(0)} KB)`);
    continue;
  }

  await sharp(inputPath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outputPath + '.tmp');

  // Only replace if the compressed version is actually smaller
  const { size: after } = await stat(outputPath + '.tmp');
  if (after < before) {
    const { rename } = await import('fs/promises');
    await rename(outputPath + '.tmp', outputPath);
    saved += before - after;
    count++;
    console.log(`  ✓  ${file}  ${(before/1024/1024).toFixed(2)} MB → ${(after/1024/1024).toFixed(2)} MB  (-${((1 - after/before)*100).toFixed(0)}%)`);
  } else {
    const { unlink } = await import('fs/promises');
    await unlink(outputPath + '.tmp');
    console.log(`  skip  ${file} (already optimal)`);
  }
}

console.log(`\nDone. ${count} images compressed. Total saved: ${(saved/1024/1024).toFixed(1)} MB`);
