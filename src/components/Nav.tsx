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
        <Link href="/" className={styles.logo} data-cursor="" aria-label="Wim van Esch, home">
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="10.5" />
            <circle cx="12" cy="12" r="3.2" />
          </svg>
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
            <nav className={styles.grid}>
              {collections.map((c, i) => (
                <motion.div
                  key={c.slug}
                  className={styles.cell}
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  animate={{ clipPath: "inset(0% 0 0 0)" }}
                  transition={{ duration: 1.1, ease, delay: 0.3 + i * 0.07 }}
                >
                  <Link
                    href={`/${c.slug}`}
                    className={`${styles.tile} ${hovered === i ? styles.tileActive : ""}`}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    data-cursor="Open"
                  >
                    <Image
                      src={c.photos[0].src}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <span className={styles.tileLabel}>
                      <span>{pad(i + 1)}</span>
                      <span>{c.title}</span>
                    </span>
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
              <span className="label">Wim van Esch</span>
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
