"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { collections, pad } from "@/lib/photos";
import { lockScroll } from "./SmoothScroll";
import styles from "./Nav.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(0);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={styles.bar}>
        <Link href="/" className={styles.logo} data-cursor="">
          Wim van Esch
        </Link>
        <button className={styles.toggle} onClick={() => setOpen((o) => !o)} data-cursor="" aria-expanded={open}>
          <span className={styles.toggleText}>{open ? "Sluit" : "Collecties"}</span>
          <span className={`${styles.burger} ${open ? styles.burgerOpen : ""}`} aria-hidden>
            <i />
            <i />
          </span>
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.menu}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(100% 0 0% 0)" }}
            transition={{ duration: 0.9, ease }}
          >
            <div className={styles.menuBg} aria-hidden>
              <AnimatePresence initial={false}>
                <motion.div
                  key={hovered}
                  className={styles.menuBgImage}
                  initial={{ opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1.02 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease }}
                >
                  <Image
                    src={collections[hovered].photos[0].src}
                    alt=""
                    fill
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <nav className={styles.list}>
              {collections.map((c, i) => (
                <motion.div
                  key={c.slug}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease, delay: 0.25 + i * 0.06 }}
                  className={styles.itemWrap}
                >
                  <Link
                    href={`/${c.slug}`}
                    className={`${styles.item} ${hovered === i ? styles.itemActive : ""}`}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    data-cursor="Open"
                  >
                    <span className={styles.itemIndex}>{pad(i + 1)}</span>
                    <span className={`serif ${styles.itemTitle}`}>{c.title}</span>
                    <span className={styles.itemCount}>{c.photos.length}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className={styles.menuFoot}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="label">Fotografie</span>
              <a href="mailto:info@mediasolutions.nl" className="label" data-cursor="Mail">
                info@mediasolutions.nl
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
