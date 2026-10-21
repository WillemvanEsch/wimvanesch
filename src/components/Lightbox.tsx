"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { pad, type Photo } from "@/lib/photos";
import { lockScroll } from "./SmoothScroll";
import styles from "./Lightbox.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  photos: Photo[];
  index: number | null;
  onChange: (index: number | null) => void;
};

/** Fullscreen viewer with an ambient glow taken from the photo itself. */
export default function Lightbox({ photos, index, onChange }: Props) {
  const [dir, setDir] = useState(1);
  const thumbs = useRef<HTMLDivElement>(null);
  const isOpen = index !== null;

  const go = (step: number) => {
    if (index === null) return;
    setDir(step);
    onChange((index + step + photos.length) % photos.length);
  };

  useEffect(() => {
    lockScroll(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (index === null) return;
    thumbs.current
      ?.querySelector<HTMLElement>(`[data-i="${index}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const photo = index !== null ? photos[index] : null;

  return (
    <AnimatePresence>
      {photo && index !== null && (
        <motion.div
          className={styles.box}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
          role="dialog"
          aria-modal="true"
          aria-label="Foto"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={photo.key}
              className={styles.ambient}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              <Image src={photo.src} alt="" fill sizes="10vw" style={{ objectFit: "cover" }} />
            </motion.div>
          </AnimatePresence>

          <div className={styles.stage}>
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={photo.key}
                className={styles.photo}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: `${d * 12}%`, opacity: 0, scale: 0.96, filter: "blur(12px)" }),
                  center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
                  exit: (d: number) => ({ x: `${d * -12}%`, opacity: 0, scale: 0.96, filter: "blur(12px)" }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.9, ease }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.title ?? `Foto ${index + 1}`}
                  fill
                  sizes="100vw"
                  priority
                  placeholder={photo.blurDataURL ? "blur" : "empty"}
                  blurDataURL={photo.blurDataURL}
                  style={{ objectFit: "contain" }}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
            <button className={`${styles.zone} ${styles.prev}`} onClick={() => go(-1)} data-cursor="Vorige" aria-label="Vorige foto" />
            <button className={`${styles.zone} ${styles.next}`} onClick={() => go(1)} data-cursor="Volgende" aria-label="Volgende foto" />
          </div>

          <div className={styles.top}>
            <span className={`serif ${styles.count}`}>
              {pad(index + 1)} <span className="label">/ {pad(photos.length)}</span>
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={photo.key}
                className={`serif ${styles.caption}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                {photo.title}
              </motion.span>
            </AnimatePresence>
            <button className={styles.close} onClick={() => onChange(null)} data-cursor="Sluit" aria-label="Sluiten">
              <i />
              <i />
            </button>
          </div>

          <div className={styles.thumbs} ref={thumbs}>
            {photos.map((p, i) => (
              <button
                key={p.key}
                data-i={i}
                className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`}
                style={{ aspectRatio: `${p.width} / ${p.height}` }}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  onChange(i);
                }}
                data-cursor=""
                aria-label={`Foto ${i + 1}`}
              >
                <Image src={p.src} alt="" fill sizes="80px" style={{ objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
