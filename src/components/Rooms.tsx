"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { collections, pad, type Collection } from "@/lib/photos";
import styles from "./Rooms.module.css";

/** Each collection gets its own "room": a pinned photo that opens up as you scroll. */
export default function Rooms() {
  return (
    <section className={styles.rooms} aria-label="Collecties">
      {collections.map((c) => (
        <Room key={c.slug} collection={c} />
      ))}
    </section>
  );
}

function Room({ collection }: { collection: Collection }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const clip = useTransform(
    scrollYProgress,
    [0, 0.75],
    ["inset(22% 28% 22% 28%)", "inset(0% 0% 0% 0%)"],
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.35, 1]);
  const titleScale = useTransform(scrollYProgress, [0.1, 0.8], [0.7, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.25, 0.7], [0, 1]);
  const spread = useTransform(scrollYProgress, [0.2, 0.9], ["-0.04em", "0.02em"]);
  const cover = collection.photos[0];

  return (
    <Link ref={ref} href={`/${collection.slug}`} className={styles.room} data-cursor="Bekijk">
      <div className={styles.sticky}>
        <motion.div className={styles.frame} style={{ clipPath: clip }}>
          <motion.div className={styles.img} style={{ scale }}>
            <Image
              src={cover.src}
              alt={collection.title}
              fill
              sizes="(max-aspect-ratio: 3/2) 150vh, 100vw"
              placeholder={cover.blurDataURL ? "blur" : "empty"}
              blurDataURL={cover.blurDataURL}
              style={{ objectFit: "cover" }}
            />
          </motion.div>
          <div className={styles.shade} />
        </motion.div>

        <div className={styles.top}>
          <span className="label">
            {pad(collection.index + 1)} / {pad(collections.length)}
          </span>
          <span className="label">{collection.photos.length} foto&apos;s</span>
        </div>

        <motion.h2
          className={`serif ${styles.title}`}
          style={{ scale: titleScale, opacity: titleOpacity, letterSpacing: spread }}
        >
          {collection.title}
        </motion.h2>

        <motion.div className={styles.bottom} style={{ opacity: titleOpacity }}>
          <span className={`serif ${styles.sub}`}>{collection.subtitle}</span>
          <span className={styles.cta}>
            Bekijk collectie <span aria-hidden>→</span>
          </span>
        </motion.div>
      </div>
    </Link>
  );
}
