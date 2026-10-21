import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Exhibition from "@/components/Exhibition";
import NextCollection from "@/components/NextCollection";
import Footer from "@/components/Footer";
import { collections, getCollection } from "@/lib/photos";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCollection((await params).slug);
  if (!c) return {};
  return {
    title: c.title,
    openGraph: { title: `${c.title} — Wim van Esch`, images: [c.photos[0].src] },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const collection = getCollection((await params).slug);
  if (!collection) notFound();
  const next = collections[(collection.index + 1) % collections.length];

  return (
    <main>
      <Exhibition collection={collection} />
      <NextCollection collection={next} />
      <Footer />
    </main>
  );
}
