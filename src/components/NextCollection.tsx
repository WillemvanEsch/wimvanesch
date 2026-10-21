"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import type { Collection } from "@/lib/photos";
import styles from "./NextCollection.module.css";

export default function NextCollection({ collection }: { collection: Collection }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(30% 10% 0% 10%)", "inset(0% 0% 0% 0%)"]);
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]);
  const cover = collection.photos[0];

  return (
    <Link ref={ref} href={`/${collection.slug}`} className={styles.next} data-cursor="Volgende">
      <motion.div className={styles.frame} style={{ clipPath: clip }}>
        <motion.div className={styles.img} style={{ y }}>
          <Image src={cover.src} alt="" fill sizes="(max-aspect-ratio: 3/2) 150vh, 100vw" style={{ objectFit: "cover" }} />
        </motion.div>
      </motion.div>
      <div className={styles.text}>
        <span className="label">Volgende</span>
        <span className="label">{collection.title} →</span>
      </div>
    </Link>
  );
}
