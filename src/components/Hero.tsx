"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { collections, pad, type Photo } from "@/lib/photos";
import styles from "./Hero.module.css";

const ease = [0.76, 0, 0.24, 1] as const;
const SLIDE_MS = 6500;

export default function Hero({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Pointer parallax: the photo drifts gently against the mouse.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 60, damping: 20 });
  const y = useSpring(py, { stiffness: 60, damping: 20 });

  // Scroll: photo sinks and dims.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.85]);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % photos.length), SLIDE_MS);
    return () => clearTimeout(id);
  }, [index, paused, photos.length]);

  const photo = photos[index];
  const collection = collections.find((c) => c.slug === photo.collection);

  return (
    <section
      ref={ref}
      className={styles.hero}
      onPointerMove={(e) => {
        px.set((e.clientX / window.innerWidth - 0.5) * -28);
        py.set((e.clientY / window.innerHeight - 0.5) * -18);
      }}
    >
      <motion.div className={styles.stage} style={{ y: imgY }}>
        <motion.div className={styles.parallax} style={{ x, y }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={photo.key}
              className={styles.slide}
              initial={{ clipPath: "inset(0 0 0 100%)" }}
              animate={{ clipPath: "inset(0 0 0 0%)" }}
              exit={{ opacity: 0.999 }}
              transition={{ duration: 1.4, ease }}
            >
              <motion.div
                className={styles.kenburns}
                initial={{ scale: 1.25 }}
                animate={{ scale: 1.06 }}
                transition={{ duration: SLIDE_MS / 1000 + 2, ease: "linear" }}
              >
                <Image
                  src={photo.src}
                  alt={photo.title ?? ""}
                  fill
                  priority={index === 0}
                  sizes="(max-aspect-ratio: 3/2) 150vh, 100vw"
                  placeholder={photo.blurDataURL ? "blur" : "empty"}
                  blurDataURL={photo.blurDataURL}
                  style={{ objectFit: "cover" }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <motion.div className={styles.dim} style={{ opacity: dim }} />
      </motion.div>

      <div className={styles.shade} />

      <h1 className={styles.srOnly}>Wim van Esch fotografie</h1>

      <div className={styles.meta} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className={styles.counter}>
          <span className="serif">{pad(index + 1)}</span>
          <span className={styles.total}>/ {pad(photos.length)}</span>
        </div>
        <div className={styles.dots}>
          {photos.map((p, i) => (
            <button
              key={p.key}
              className={styles.dot}
              onClick={() => setIndex(i)}
              aria-label={`Foto ${i + 1}`}
              data-cursor=""
            >
              <span
                className={styles.dotFill}
                style={{
                  animationDuration: `${SLIDE_MS}ms`,
                  animationPlayState: paused ? "paused" : "running",
                }}
                data-state={i < index ? "done" : i === index ? "active" : "idle"}
                key={i === index ? `a${index}` : i}
              />
            </button>
          ))}
        </div>
        {collection && (
          <Link href={`/${collection.slug}`} className={styles.from} data-cursor="Open">
            <span className="label">{collection.title}</span>
          </Link>
        )}
      </div>

      <div className={styles.scroll} aria-hidden>
        <span className="label">Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
