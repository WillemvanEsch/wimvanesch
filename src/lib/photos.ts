import manifest from "@/data/manifest.json";
import photoMeta from "@/data/photo-meta.json";

export type Photo = {
  key: string;
  id: string;
  collection: string;
  src: string;
  width: number;
  height: number;
  title?: string;
  color: string;
  blurDataURL?: string;
};

export type Collection = {
  slug: string;
  title: string;
  subtitle: string;
  index: number;
  photos: Photo[];
};

type Meta = { width: number; height: number; color: string; blurDataURL: string };
const meta = photoMeta as Record<string, Meta>;

const FALLBACK_COLOR = "#2a2622";

export const collections: Collection[] = manifest.collections.map((c, index) => ({
  slug: c.slug,
  title: c.title,
  subtitle: c.subtitle,
  index,
  photos: c.photos.map((p) => {
    const key = `${c.slug}/${p.id}`;
    const m = meta[key];
    return {
      key,
      id: p.id,
      collection: c.slug,
      src: p.src,
      width: m?.width ?? p.width,
      height: m?.height ?? p.height,
      title: "title" in p ? p.title : undefined,
      color: m?.color ?? FALLBACK_COLOR,
      blurDataURL: m?.blurDataURL,
    };
  }),
}));

const byKey = new Map(collections.flatMap((c) => c.photos.map((p) => [p.key, p] as const)));

export const heroPhotos: Photo[] = manifest.hero.map((k) => byKey.get(k)).filter((p): p is Photo => !!p);

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export const totalPhotos = collections.reduce((n, c) => n + c.photos.length, 0);

export const pad = (n: number) => String(n).padStart(2, "0");
