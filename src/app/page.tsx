import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Rooms from "@/components/Rooms";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import { collections, heroPhotos } from "@/lib/photos";

// Every third photo of every collection, dealt over two rows.
const archive = collections.flatMap((c) => c.photos.filter((_, i) => i % 3 === 1));
const rows = [archive.filter((_, i) => i % 2 === 0), archive.filter((_, i) => i % 2 === 1)];

export default function Home() {
  return (
    <main>
      <Intro preload={heroPhotos.slice(0, 2).map((p) => p.src)} />
      <Hero photos={heroPhotos} />
      <Rooms />
      <Marquee rows={rows} />
      <Footer />
    </main>
  );
}
