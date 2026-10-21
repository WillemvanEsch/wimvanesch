"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { pad, type Collection, type Photo } from "@/lib/photos";
import Lightbox from "./Lightbox";
import styles from "./Exhibition.module.css";

/**
 * A collection hung like an exhibition: on desktop the wall scrolls sideways
 * while you scroll down, on phones the photos stack full width.
 */
export default function Exhibition({ collection }: { collection: Collection }) {
  const [open, setOpen] = useState<number | null>(null);
  const [horizontal, setHorizontal] = useState(false);
  const photos = collection.photos;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px) and (hover: hover) and (min-aspect-ratio: 1/1)");
    const update = () => setHorizontal(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Deep link: /vogels#kievit1 opens that photo.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const i = photos.findIndex((p) => p.id === id);
    if (i >= 0) setOpen(i);
  }, [photos]);

  const show = useCallback(
    (i: number | null) => {
      setOpen(i);
      const url = i === null ? window.location.pathname : `#${photos[i].id}`;
      window.history.replaceState(null, "", url);
    },
    [photos],
  );

  return (
    <>
      {horizontal ? (
        <Wall collection={collection} onOpen={show} />
      ) : (
        <Stack collection={collection} onOpen={show} />
      )}
      <Lightbox photos={photos} index={open} onChange={show} />
    </>
  );
}

/* ---------- Desktop: horizontal wall ---------- */

function Wall({ collection, onOpen }: { collection: Collection; onOpen: (i: number) => void }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [current, setCurrent] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, (v) => -v * distance);
  const bar = useTransform(smooth, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setCurrent(Math.min(collection.photos.length - 1, Math.max(0, Math.round(v * (collection.photos.length - 1)))));
  });

  return (
    <section ref={section} className={styles.wall} style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className={styles.sticky}>
        <h1 className={styles.srOnly}>{collection.title}</h1>
        <motion.div ref={track} className={styles.track} style={{ x }}>
          {collection.photos.map((p, i) => (
            <Frame key={p.key} photo={p} index={i} progress={smooth} total={collection.photos.length} onOpen={onOpen} />
          ))}
          <div className={styles.end} aria-hidden />
        </motion.div>

        <div className={styles.hud}>
          <span className={`serif ${styles.hudCount}`}>
            {pad(current + 1)} <span className="label">/ {pad(collection.photos.length)}</span>
          </span>
          <div className={styles.progress}>
            <motion.span style={{ scaleX: bar }} />
          </div>
          <span className="label">{collection.title}</span>
        </div>
      </div>
    </section>
  );
}

function Frame({
  photo,
  index,
  total,
  progress,
  onOpen,
}: {
  photo: Photo;
  index: number;
  total: number;
  progress: MotionValue<number>;
  onOpen: (i: number) => void;
}) {
  // Each photo slides a little inside its frame, opposite to the wall.
  const center = total > 1 ? index / (total - 1) : 0.5;
  const shift = useTransform(progress, [center - 0.25, center + 0.25], ["7%", "-7%"]);
  const tall = photo.height > photo.width;

  return (
    <motion.figure
      className={`${styles.frame} ${tall ? styles.tall : ""}`}
      style={{ aspectRatio: `${photo.width} / ${photo.height}`, ["--glow" as string]: photo.color }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px -5% 0px 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className={styles.frameButton} onClick={() => onOpen(index)} data-cursor="Bekijk" aria-label={`Open foto ${index + 1}`}>
        <motion.div className={styles.frameImg} style={{ x: shift }}>
          <Image
            src={photo.src}
            alt={photo.title ?? ""}
            fill
            sizes="(min-aspect-ratio: 3/2) 110vh, 75vw"
            placeholder={photo.blurDataURL ? "blur" : "empty"}
            blurDataURL={photo.blurDataURL}
            style={{ objectFit: "cover" }}
          />
        </motion.div>
      </button>
      <figcaption className={styles.caption}>
        <span>{pad(index + 1)}</span>
        {photo.title && <span className="serif">{photo.title}</span>}
      </figcaption>
    </motion.figure>
  );
}

/* ---------- Phones / tablets: vertical stack ---------- */

function Stack({ collection, onOpen }: { collection: Collection; onOpen: (i: number) => void }) {
  return (
    <section className={styles.stack}>
      <h1 className={styles.srOnly}>{collection.title}</h1>
      {collection.photos.map((p, i) => (
        <motion.figure
          key={p.key}
          className={styles.stackItem}
          initial={{ clipPath: "inset(12% 6% 12% 6%)", opacity: 0.3 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <button className={styles.frameButton} onClick={() => onOpen(i)} aria-label={`Open foto ${i + 1}`}>
            <div style={{ position: "relative", aspectRatio: `${p.width} / ${p.height}` }}>
              <Image
                src={p.src}
                alt={p.title ?? ""}
                fill
                sizes="100vw"
                placeholder={p.blurDataURL ? "blur" : "empty"}
                blurDataURL={p.blurDataURL}
                style={{ objectFit: "cover" }}
              />
            </div>
          </button>
          <figcaption className={styles.caption}>
            <span>{pad(i + 1)}</span>
            {p.title && <span className="serif">{p.title}</span>}
          </figcaption>
        </motion.figure>
      ))}
    </section>
  );
}
