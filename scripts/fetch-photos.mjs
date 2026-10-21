// Downloads every photo listed in src/data/manifest.json from the old
// WordPress site into public/photos/<collection>/, and writes
// src/data/photo-meta.json with real dimensions, a tiny blur placeholder
// and the dominant colour of each photo (used for the ambient glow).
//
//   npm run photos           download missing photos + refresh meta
//   npm run photos -- --meta only refresh meta from files already on disk
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(await fs.readFile(path.join(root, "src/data/manifest.json"), "utf8"));
const metaOnly = process.argv.includes("--meta");
const meta = {};
let downloaded = 0;
const failed = [];

for (const collection of manifest.collections) {
  const dir = path.join(root, "public/photos", collection.slug);
  await fs.mkdir(dir, { recursive: true });
  for (const photo of collection.photos) {
    const file = path.join(root, "public", photo.src);
    const exists = await fs.access(file).then(() => true, () => false);
    if (!exists && !metaOnly) {
      const res = await fetch(photo.source);
      if (!res.ok) {
        failed.push(`${photo.source} (${res.status})`);
        continue;
      }
      await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
      downloaded++;
    } else if (!exists) {
      continue;
    }
    const image = sharp(file);
    const { width, height } = await image.metadata();
    const { dominant } = await image.stats();
    const blur = await sharp(file).resize(16).webp({ quality: 40 }).toBuffer();
    const hex = (n) => n.toString(16).padStart(2, "0");
    meta[`${collection.slug}/${photo.id}`] = {
      width,
      height,
      color: `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };
  }
}

await fs.writeFile(path.join(root, "src/data/photo-meta.json"), JSON.stringify(meta, null, 2) + "\n");
console.log(`Downloaded ${downloaded}, meta for ${Object.keys(meta).length} photos.`);
if (failed.length) {
  console.error(`Failed:\n  ${failed.join("\n  ")}`);
  process.exitCode = 1;
}
